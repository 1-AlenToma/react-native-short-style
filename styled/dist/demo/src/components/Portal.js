import * as React from "react";
import { globalData } from "../theme/ThemeContext";
import { useId } from "../hooks";
export const Portal = (props) => {
    const id = useId();
    globalData.portals.addElem(props.id ?? id, { visible: props.visible ?? true, children: props.children });
    React.useEffect(() => {
        return () => globalData.portals.clean(id);
    }, []);
    return null;
};
//# sourceMappingURL=Portal.js.map