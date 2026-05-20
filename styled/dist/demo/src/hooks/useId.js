import { newId } from "react-smart-state";
import { useLocalRef } from "./useLocalRef";
export const useId = () => {
    return useLocalRef(newId);
};
//# sourceMappingURL=useId.js.map