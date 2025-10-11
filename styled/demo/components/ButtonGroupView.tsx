import StateBuilder from "react-smart-state"
import { ButtonGroup } from "../src"
import { Block } from "./Block"

const colors = [
    {
        "name": "Muted Blue Gray",
        "hex": "#2C2F33",
        "mode": "dark"
    },
    {
        "name": "Light Gray",
        "hex": "#D3D3D3",
        "mode": "light"
    },
    {
        "name": "Warm Dark Brown",
        "hex": "#2D1B14",
        "mode": "dark"
    },
    {
        "name": "Soft Beige",
        "hex": "#F5F5DC",
        "mode": "light"
    },
    {
        "name": "Pale Yellow",
        "hex": "#FAFAD2",
        "mode": "light"
    },
    {
        "name": "Soft Dark Olive",
        "hex": "#3B3C36",
        "mode": "dark"
    },
    {
        "name": "Warm White",
        "hex": "#FFF8E7",
        "mode": "light"
    },
    {
        "name": "Deep Gray",
        "hex": "#1E1E1E",
        "mode": "dark"
    },
    {
        "name": "Muted Green",
        "hex": "#D8E8D8",
        "mode": "light"
    },
    {
        "name": "Dark Charcoal",
        "hex": "#121212",
        "mode": "dark"
    }
].map(x => x.name)

export const ButtonGroupView = () => {
    const state = StateBuilder({
        selectedButtons: [8] as number[]
    }).build()


    return (
        <Block style={{ width: 300, minHeight: 200 }} title='ButtonGroup'>
            <ButtonGroup onPress={(btns) => state.selectedButtons = btns} numColumns={2} scrollable={true} isVertical={true} buttons={colors} selectedIndex={state.selectedButtons} />
        </Block>
    )
}