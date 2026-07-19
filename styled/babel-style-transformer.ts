import { PluginObj, types as t } from "@babel/core";
import NestedStyleSheet from "./src/styles/NestedStyleSheet";

function valueToAST(value: any): t.Expression {
    if (value === null) {
        return t.nullLiteral();
    }

    if (typeof value === "string") {
        return t.stringLiteral(value);
    }

    if (typeof value === "number") {
        return t.numericLiteral(value);
    }

    if (typeof value === "boolean") {
        return t.booleanLiteral(value);
    }

    if (Array.isArray(value)) {
        return t.arrayExpression(
            value.map(valueToAST)
        );
    }

    if (typeof value === "object") {
        return t.objectExpression(
            Object.entries(value).map(([key, val]) =>
                t.objectProperty(
                    t.identifier(key),
                    valueToAST(val)
                )
            )
        );
    }

    throw new Error("Unsupported value");
}

function astToValue(node: t.Node): any {

    if (t.isStringLiteral(node))
        return node.value;

    if (t.isNumericLiteral(node))
        return node.value;

    if (t.isBooleanLiteral(node))
        return node.value;


    if (t.isObjectExpression(node)) {

        const obj: any = {};

        for (const prop of node.properties) {

            if (t.isObjectProperty(prop)
                && t.isIdentifier(prop.key)
            ) {
                obj[prop.key.name] =
                    astToValue(prop.value);
            }
        }

        return obj;
    }

    return undefined;
}

export default function styleTransformer(): PluginObj {
    return {
        visitor: {
            CallExpression(path) {

                const callee = path.node.callee;

                if (
                    !t.isMemberExpression(callee)
                ) {
                    return;
                }

                if (
                    !t.isIdentifier(callee.object, {
                        name: "NestedStyleSheet"
                    })
                ) {
                    return;
                }

                if (
                    !t.isIdentifier(callee.property, {
                        name: "create"
                    })
                ) {
                    return;
                }


                const arg = path.node.arguments[0];


                if (
                    t.isObjectExpression(arg)
                ) {
                    const value = astToValue(arg);
                    console.warn("converting Value", value)
                    let newValue = NestedStyleSheet.create(value);
                    console.warn("new Value", newValue)
                    path.replaceWith(
                        valueToAST(newValue)
                    );
                }
            }
        }
    };
}