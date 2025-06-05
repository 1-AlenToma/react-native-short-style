import StateBuilder from "react-smart-state";

const createState = ((item: any) => StateBuilder(item)) as typeof StateBuilder;
export default createState;