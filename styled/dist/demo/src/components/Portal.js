import * as React from "react";
import { globalData } from "../theme/ThemeContext";
import { useId } from "../hooks";
export const Portal = (props) => {
    var _a, _b;
    const id = useId();
    React.useEffect(() => {
        return () => globalData.portals.clean(id);
    }, []);
    globalData.portals.addElem((_a = props.id) !== null && _a !== void 0 ? _a : id, { visible: (_b = props.visible) !== null && _b !== void 0 ? _b : true, children: props.children });
    /*  React.useEffect(() => {
          let fn = ifSelector(props.ifTrue) !== false ? context.add.bind(context) : context.remove.bind(context);
          fn(state.id, (
              <View inspectDisplayName="Portal" key={state.id} css={`zi:1 ${optionalStyle(props.css).c}`} style={props.style}>
                  {props.children}
              </View>
          ), true);
  
          return () => context.remove(state.id);
      })*/
    return null;
};
//# sourceMappingURL=Portal.js.map