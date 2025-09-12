import StateBuilder from "react-smart-state";
import { ProgressBar, SliderView } from "../src"
import { Block } from "./Block";



export const ProgressView = () => {
    const state = StateBuilder({
        sliderValue: .5
    }).build();


    return (<Block title="ProgressBar">
        <ProgressBar value={state.sliderValue} />
        <SliderView
            css="mat:30"
            animationType="spring"
            minimumValue={0}
            value={state.sliderValue}
            onValueChange={(v) => state.sliderValue = v[0]}
            maximumValue={1}
            step={.1}
            enableButtons={true} />
    </Block>)
}