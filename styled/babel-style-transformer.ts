import { PluginObj, types as t, NodePath } from "@babel/core";
import { parseExpression } from "@babel/parser";
import NestedStyleSheet from "./src/styles/NestedStyleSheet";
import fs from "fs";
import * as filePath from "path";
import generate from "@babel/generator";
import transform from 'css-to-react-native';
import { newId } from "./src/config/CSSMethods";

function isCssPath(cssFilePathOrCssString: string): boolean {
    const trimmed = cssFilePathOrCssString.trim();

    // 1. Explicitly check for CSS file paths/URLs
    if (trimmed.endsWith(".css") || trimmed.includes(".css?")) {
        return true;
    }

    return false;
}


const IF_SELECTOR_NAME = "__rnss_ifSelector";

export function injectIfSelector(
    program: NodePath<t.Program>
) {
    const helper = t.variableDeclaration("const", [
        t.variableDeclarator(
            t.identifier(IF_SELECTOR_NAME),
            t.arrowFunctionExpression(
                [
                    t.identifier("item"),
                ],
                t.blockStatement([
                    t.ifStatement(
                        t.logicalExpression(
                            "||",
                            t.binaryExpression(
                                "===",
                                t.identifier("item"),
                                t.nullLiteral()
                            ),
                            t.binaryExpression(
                                "===",
                                t.identifier("item"),
                                t.identifier("undefined")
                            )
                        ),
                        t.blockStatement([
                            t.returnStatement(
                                t.identifier("undefined")
                            )
                        ])
                    ),

                    t.ifStatement(
                        t.binaryExpression(
                            "===",
                            t.unaryExpression(
                                "typeof",
                                t.identifier("item")
                            ),
                            t.stringLiteral("function")
                        ),
                        t.blockStatement([
                            t.expressionStatement(
                                t.assignmentExpression(
                                    "=",
                                    t.identifier("item"),
                                    t.callExpression(
                                        t.identifier("item"),
                                        []
                                    )
                                )
                            )
                        ])
                    ),

                    t.returnStatement(
                        t.identifier("item")
                    )
                ])
            )
        ),
    ]);

    // Put it after imports
    let insertIndex = 0;

    while (
        insertIndex < program.node.body.length &&
        t.isImportDeclaration(
            program.node.body[insertIndex]
        )
    ) {
        insertIndex++;
    }

    program.node.body.splice(
        insertIndex,
        0,
        helper
    );
}

function resolveMemberExpression(
    node: t.MemberExpression,
    pathNode: NodePath
) {
    if (
        t.isIdentifier(node.object) &&
        node.object.name === "exports" &&
        t.isIdentifier(node.property)
    ) {

        const name = node.property.name;

        const program = pathNode.findParent(
            p => p.isProgram()
        );

        for (const stmt of program.node.body) {

            if (
                t.isExpressionStatement(stmt) &&
                t.isAssignmentExpression(stmt.expression)
            ) {

                const left = stmt.expression.left;

                if (
                    t.isMemberExpression(left) &&
                    t.isIdentifier(left.object) &&
                    left.object.name === "exports" &&
                    t.isIdentifier(left.property) &&
                    left.property.name === name
                ) {
                    return astToValue(
                        stmt.expression.right,
                        pathNode
                    );
                }
            }
        }
    }

    throw new Error(
        `Cannot resolve ${generate(node).code}`
    );

}


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
    if (t.isTemplateLiteral(node)) {

        // Fast path: no expressions
        if (node.expressions.length === 0) {
            return node.quasis[0].value.cooked;
        }

        try {
            const code = generate(node).code;
            return eval(code);
        } catch (e: any) {
            throw new Error(
                `Could not statically evaluate template literal:\n\n` +
                `${generate(node).code}\n\n` +
                `Reason: ${e.message}`
            );
        }
    }


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

                let spreadValue;

                if (t.isIdentifier(prop.argument)) {

                    spreadValue = resolveIdentifier(
                        prop.argument,
                        pathNode
                    );

                } else if (t.isMemberExpression(prop.argument)) {

                    spreadValue = resolveMemberExpression(
                        prop.argument,
                        pathNode
                    );

                } else {
                    throw new Error(
                        "Unsupported spread: " +
                        generate(prop.argument).code
                    );
                }


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
        //  console.info("found NestedSheet")
        return true;
    }


    if (
        t.isMemberExpression(node.object) &&
        t.isIdentifier(node.object.object) &&
        node.object.object.name?.indexOf("NestedStyleSheet") !== -1 &&
        t.isIdentifier(node.object.property) &&
        node.object.property.name === "default"
    ) {
        // console.info("found NestedSheet")
        return true;
    }


    return false;
}


function isCssStyleSheetCreate(
    node: t.MemberExpression
) {

    if (t.isIdentifier(node.object) && node.object.name?.indexOf("CssStyleSheet") !== -1) {
        //  console.info("found CssStyleSheet")
        return true;
    }


    if (
        t.isMemberExpression(node.object) &&
        t.isIdentifier(node.object.object) &&
        node.object.object.name?.indexOf("CssStyleSheet") !== -1 &&
        t.isIdentifier(node.object.property) &&
        node.object.property.name === "default"
    ) {
        //  console.info("found CssStyleSheet")
        return true;
    }


    return false;
}


const nestedSheetExpression = (path) => {


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

            let cssString;
            if (isCssPath(value)) {
                const _path = filePath.resolve(value);
                if (!fs.existsSync(_path)) {
                    console.error(_path, "css file not found");
                    return;
                }
                console.info("babel-style-transformer parsing the css file", _path);

                cssString = parseCssToTuples(fs.readFileSync(_path, { encoding: "utf8" }));
            } else {
                cssString = parseCssToTuples(value);
            }

            let newValue = {};
            for (let k in cssString) {
                let itemKey = k.startsWith(".") ? k.substring(1) : k;
                let data = cssString[k];
                newValue[itemKey] = {};
                for (let d of data) {
                    let item = transform([d as any]);
                    if (d[2]) {
                        for (let tm in item)
                            item[tm] += "-!important";
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

const ifTrueExpression = (path, state) => {
    const callee = path.node.callee;

    let isJSXRuntime = false;

    if (
        t.isIdentifier(callee) &&
        (callee.name === "jsx" || callee.name === "jsxs")
    ) {
        isJSXRuntime = true;
    }

    // Handles: (0, jsx_runtime_1.jsx)
    if (
        t.isSequenceExpression(callee)
    ) {
        const last =
            callee.expressions[callee.expressions.length - 1];

        if (
            t.isMemberExpression(last) &&
            t.isIdentifier(last.property) &&
            (last.property.name === "jsx" ||
                last.property.name === "jsxs")
        ) {
            isJSXRuntime = true;
        }
    }

    if (!isJSXRuntime)
        return;


    const props = path.node.arguments[1];

    if (!t.isObjectExpression(props))
        return;


    const ifTrueIndex =
        props.properties.findIndex(
            prop =>
                t.isObjectProperty(prop) &&
                t.isIdentifier(prop.key) &&
                prop.key.name === "ifTrue"
        );


    if (ifTrueIndex === -1)
        return;


    const prop =
        props.properties[ifTrueIndex] as t.ObjectProperty;


    const condition = prop.value;


    // remove ifTrue
    props.properties.splice(
        ifTrueIndex,
        1
    );


    state.hasIfSelector = true;


    const check =
        t.binaryExpression(
            "!==",
            t.callExpression(
                t.identifier(IF_SELECTOR_NAME),
                [
                    condition
                ]
            ),
            t.booleanLiteral(false)
        );


    path.replaceWith(
        t.conditionalExpression(
            check,
            path.node,
            t.nullLiteral()
        )
    );
};

const lockMemoExpression = (path, state) => {
    const callee = path.node.callee;

    const calleeNames = ["locMem", "locMemo"];
    if (
        !t.isIdentifier(callee) ||
        !calleeNames.includes(callee.name)
    ) {
        return;
    }


    // already transformed
    if (
        path.node.arguments.length > 0 &&
        t.isStringLiteral(
            path.node.arguments[0]
        )
    ) {
        return;
    }


    path.node.arguments.unshift(
        t.stringLiteral(
            newId()
            //createKey(path)
        )
    );


}


export default function styleTransformer(): PluginObj {

    return {

        visitor: {
            Program: {
                enter(path, state) {
                    state.hasIfSelector = false;
                },

                exit(path, state) {
                    if (state.hasIfSelector) {
                        injectIfSelector(path);
                    }
                },
            },
            JSXElement(path: NodePath<t.JSXElement>, state) {
                try {
                    const attrs = path.node.openingElement.attributes;

                    const index = attrs.findIndex(
                        attr =>
                            t.isJSXAttribute(attr) &&
                            t.isJSXIdentifier(attr.name) &&
                            attr.name.name === "ifTrue"
                    );

                    if (index === -1)
                        return;

                    const attr = attrs[index] as t.JSXAttribute;

                    if (
                        !attr.value ||
                        !t.isJSXExpressionContainer(attr.value)
                    ) {
                        return;
                        throw path.buildCodeFrameError(
                            "ifTrue must be a JSX expression."
                        );
                    }

                    const expr = attr.value.expression;

                    // Remove ifTrue from JSX
                    attrs.splice(index, 1);

                    // Clone JSX without ifTrue
                    const jsx = t.cloneNode(path.node, true);

                    // Mark that helper is needed
                    state.hasIfSelector = true;

                    // ifSelector(expr) !== false
                    const condition = t.binaryExpression(
                        "!==",
                        t.callExpression(
                            t.identifier(IF_SELECTOR_NAME),
                            [
                                expr
                            ]
                        ),
                        t.booleanLiteral(false)
                    );


                    const replacement = t.conditionalExpression(
                        condition,
                        jsx,
                        t.nullLiteral()
                    )
                    if (path.parentPath.isJSXElement()) {
                        path.replaceWith(
                            t.jsxExpressionContainer(replacement)
                        );
                    } else {
                        path.replaceWith(replacement);
                    }
                } catch (e) {
                    console.warn("its ok, ifTrue expression could not be handle")
                }
            },
            CallExpression(path, state) {
                lockMemoExpression(path, state);
                nestedSheetExpression(path);
                ifTrueExpression(path, state);
            }
        }
    };
}