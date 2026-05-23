import * as React from "react";
import { globalData } from "../theme/ThemeContext";
import { useId } from "../hooks";
export const Portal = (props) => {
    const id = useId();
    React.useEffect(() => {
        return () => globalData.portals.clean(id);
    }, []);
    globalData.portals.addElem(props.id ?? id, { visible: props.visible ?? true, children: props.children });
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