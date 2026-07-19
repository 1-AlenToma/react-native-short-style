import StateBuilder, { PrimitiveObject, PrimitiveValue } from "react-smart-state";

const createState = ((item: any) => StateBuilder(item)) as typeof StateBuilder;
export {
    createState,
    PrimitiveObject,
    PrimitiveValue
}

export default createState;