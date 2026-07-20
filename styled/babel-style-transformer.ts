import { PluginObj, types as t, NodePath } from "@babel/core";
import { parseExpression } from "@babel/parser";
import NestedStyleSheet from "./src/styles/NestedStyleSheet";
import fs from "fs";
import * as filePath from "path";
import generate from "@babel/generator";
import transform from 'css-to-react-native';

export function parseCssToTuples(cssString: string) {
    const result = {} as Record<string, [[string, any, boolean]]>

    // Clean up whitespace and remove CSS comments
    const cleanCss = cssString
        .replace(/\/\*[\s\S]*?\*\//g, '')
        .trim();

    // Regex matches: selector { contents }
    const blockRegex = /([^{]+)\s*\{\s*([^}]+)\s*\}/g;
    let match;

    while ((match = blockRegex.exec(cleanCss)) !== null) {
        const selector = match[1].trim();
        const rulesString = match[2].trim();

        // Split declarations by semicolons
        const declarations = rulesString.split(';').map(d => d.trim()).filter(Boolean);

        const tuples = declarations.map(decl => {
            // Split into property and value at the first colon
            const colonIndex = decl.indexOf(':');
            if (colonIndex === -1) return null;

            const property = decl.slice(0, colonIndex).trim();
            let value = decl.slice(colonIndex + 1).trim();
            const isImportant = typeof value == "string" && /!important/i.test(value);
            if (isImportant)
                value = value.replace(/!important/i, "");

            return [property, value, isImportant];
        }).filter(Boolean); // Filter out any malformed lines

        result[selector] = tuples;
    }

    return result 
}


function valueToAST(value: any): t.Expression {

    if (value?.__ast) {
        return value.__ast;
    }


    if (value === null)
        return t.nullLiteral();


    if (typeof value === "string")
        return t.stringLiteral(value);


    if (typeof value === "number")
        return t.numericLiteral(value);


    if (typeof value === "boolean")
        return t.booleanLiteral(value);


    if (Array.isArray(value)) {
        return t.arrayExpression(
            value.map(valueToAST)
        );
    }


    /*    if (typeof value === "function") {
            return t.identifier(value.name || "anonymous");
        }*/

    if (typeof value === "function") {
        const ast = parseExpression(
            value.toString()
        );

        return ast;
    }

    if (typeof value === "object") {

        const properties: t.ObjectExpression["properties"] = [];


        for (const [key, val] of Object.entries(value)) {

            let keyNode: t.Expression;

            if (/^[a-zA-Z_$][\w$]*$/.test(key)) {
                keyNode = t.identifier(key);
            }
            else {
                keyNode = t.stringLiteral(key);
            }


            properties.push(
                t.objectProperty(
                    keyNode,
                    valueToAST(val)
                )
            );
        }


        return t.objectExpression(properties);
    }


    throw new Error(
        "valueToAST - Unsupported value " + String(value)
    );
}



function resolveIdentifier(
    node: t.Identifier,
    path: NodePath
): any {

    const binding = path.scope.getBinding(node.name);


    if (!binding) {
        throw new Error(
            `Cannot resolve "${node.name}". ` +
            `Only variables declared in the same file are supported.`
        );
    }


    const declaration = binding.path;


    if (
        declaration.isVariableDeclarator() &&
        declaration.node.init
    ) {

        return astToValue(
            declaration.node.init,
            declaration
        );
    }


    throw new Error(
        `Unsupported declaration of "${node.name}"`
    );
}



function astToValue(
    node: t.Node,
    pathNode: NodePath
): any {


    if (
        t.isCallExpression(node) &&
        t.isIdentifier(node.callee, { name: "require" }) &&
        node.arguments.length === 1 &&
        t.isStringLiteral(node.arguments[0])
    ) {

        return node.arguments[0].value;
    }

    // Arrow functions
    if (
        t.isArrowFunctionExpression(node) ||
        t.isFunctionExpression(node)
    ) {
        try {
            const code = generate(node).code;
            return eval(`(${code})`);
        } catch {
            return {
                __ast: node
            };
        }
    }



    if (t.isStringLiteral(node))
        return node.value;


    if (t.isNumericLiteral(node))
        return node.value;


    if (t.isBooleanLiteral(node))
        return node.value;



    // Resolve local variables
    if (t.isIdentifier(node)) {
        return resolveIdentifier(
            node,
            pathNode
        );
    }



    // Keep expressions
    if (
        t.isMemberExpression(node) ||
        t.isCallExpression(node) ||
        t.isConditionalExpression(node)
    ) {
        return {
            __ast: node
        };
    }




    if (t.isObjectExpression(node)) {

        const obj: any = {};


        for (const prop of node.properties) {


            // ...userDefined
            if (t.isSpreadElement(prop)) {


                if (!t.isIdentifier(prop.argument)) {
                    throw new Error(
                        "Only identifier spreads are supported"
                    );
                }


                const spreadValue =
                    resolveIdentifier(
                        prop.argument,
                        pathNode
                    );


                Object.assign(
                    obj,
                    spreadValue
                );


                continue;
            }




            if (!t.isObjectProperty(prop))
                continue;



            let key: string;


            if (t.isIdentifier(prop.key)) {
                key = prop.key.name;
            }
            else if (t.isStringLiteral(prop.key)) {
                key = prop.key.value;
            }
            else {
                throw new Error(
                    "Unsupported object key"
                );
            }



            obj[key] =
                astToValue(
                    prop.value,
                    pathNode
                );
        }


        return obj;
    }



    throw new Error(
        "Unsupported AST node: " + node.type
    );
}


function isNestedStyleSheetCreate(
    node: t.MemberExpression
) {

    if (t.isIdentifier(node.object) && node.object.name?.indexOf("NestedStyleSheet") !== -1) {
        console.info("found NestedSheet")
        return true;
    }


    if (
        t.isMemberExpression(node.object) &&
        t.isIdentifier(node.object.object) &&
        node.object.object.name?.indexOf("NestedStyleSheet") !== -1 &&
        t.isIdentifier(node.object.property) &&
        node.object.property.name === "default"
    ) {
        console.info("found NestedSheet")
        return true;
    }


    return false;
}


function isCssStyleSheetCreate(
    node: t.MemberExpression
) {

    if (t.isIdentifier(node.object) && node.object.name?.indexOf("CssStyleSheet") !== -1) {
        console.info("found CssStyleSheet")
        return true;
    }


    if (
        t.isMemberExpression(node.object) &&
        t.isIdentifier(node.object.object) &&
        node.object.object.name?.indexOf("CssStyleSheet") !== -1 &&
        t.isIdentifier(node.object.property) &&
        node.object.property.name === "default"
    ) {
        console.info("found CssStyleSheet")
        return true;
    }


    return false;
}



export default function styleTransformer(): PluginObj {

    return {

        visitor: {

            CallExpression(path) {


                const callee = path.node.callee;


                if (!t.isMemberExpression(callee))
                    return;

                if (isNestedStyleSheetCreate(callee)) {
                    const arg =
                        path.node.arguments[0];



                    if (!t.isObjectExpression(arg))
                        return;

                    try {

                        const value =
                            astToValue(
                                arg,
                                path
                            );


                        // console.warn("Converting Value",value);


                        const newValue =
                            NestedStyleSheet.create(
                                value
                            );


                        // console.warn("New Value",newValue);



                        path.replaceWith(
                            valueToAST(newValue)
                        );
                    } catch (e) {
                        console.warn("babel-style-transformer:Warning", e);
                    }
                } else if (isCssStyleSheetCreate(callee)) {
                    try {
                        const arg = path.node.arguments[0];
                        const value: string =
                            astToValue(
                                arg,
                                path
                            );


                        const _path = filePath.resolve(value);
                        if (!fs.existsSync(_path)) {
                            console.error(_path, "css file not found");
                            return;
                        }
                        console.info("babel-style-transformer parsing the css file", _path);

                        let cssString = parseCssToTuples(fs.readFileSync(_path, { encoding: "utf8" }));

                        let newValue = {};
                        for (let k in cssString) {
                            let itemKey = k.startsWith(".") ? k.substring(1) : k;
                            let data = cssString[k];
                            newValue[itemKey]={};
                            for (let d of data) {
                                let item = transform([d as any]);
                                if (d[2])
                                {
                                    for(let tm in item)
                                        item[tm]+= "-!important";
                                }
                                Object.assign(newValue[itemKey], item);
                            }
                        }

                        newValue = NestedStyleSheet.create(
                            newValue
                        );
                        console.info("css Parsed");
                        //console.log("parsed", newValue)
                        path.replaceWith(
                            valueToAST(newValue)
                        );
                    } catch (e) {
                        throw e;
                    }
                }

            }
        }
    };
}