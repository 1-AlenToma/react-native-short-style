import StateBuilder from "react-smart-state";

const createState = ((item: any) => StateBuilder(item).timeout(0)) as typeof StateBuilder;
export default createState;