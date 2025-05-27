import StateBuilder from "react-smart-state"
import { ButtonGroup } from "../src"
import { Block } from "./Block"



export const ButtonGroupView = () => {
    const state = StateBuilder({
        selectedButtons: [1] as number[]
    }).build()


    return (
        <Block style={{ width: 300 }} title='ButtonGroup'>
            <ButtonGroup onPress={(btns) => state.selectedButtons = btns} scrollable={true} isVertical={false} buttons={["Simple", "Button", "Group", "khasldkj", "lkjasdnkj", "klhasdkh", "kjhasdh"]} selectedIndex={state.selectedButtons} />
        </Block>
    )
}