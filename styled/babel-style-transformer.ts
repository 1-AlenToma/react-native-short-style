import { PluginObj, types as t, NodePath } from "@babel/core";
import { parseExpression } from "@babel/parser";
import NestedStyleSheet from "./src/styles/NestedStyleSheet";
import generate from "@babel/generator";


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
    path: NodePath
): any {


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
            path
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
                        path
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
                    path
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



export default function styleTransformer(): PluginObj {

    return {

        visitor: {

            CallExpression(path) {


                const callee = path.node.callee;


                if (!t.isMemberExpression(callee))
                    return;

                if (!isNestedStyleSheetCreate(callee))
                    return;



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
            }
        }
    };
}