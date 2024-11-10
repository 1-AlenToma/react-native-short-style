import StateBuilder from "react-smart-state"
import { CheckBox, CheckBoxList, DropdownList, FormItem, TextInput } from "../src"
import { Block } from "./Block"



export const InputForm = () => {
    const state = StateBuilder({
        checkBoxes: [true, false]
    }).build();
    return (
        <Block title='Form'>
            <FormItem title="FullName" icon={{ type: "AntDesign", name: "user" }}>
                <TextInput css="fl:1" />
            </FormItem>
            <FormItem title="UserName" icon={{ type: "AntDesign", name: "user" }}>
                <TextInput css="fl:1" />
            </FormItem>
            <FormItem title="Passowrd" info="Passowrd must at least containes one upper char" icon={{ type: "AntDesign", name: "lock" }}>
                <TextInput css="fl:1" />
            </FormItem>
            <FormItem title="Country" info="Select where you are from" icon={{ type: "AntDesign", name: "flag" }}>
                <DropdownList mode="Fold"
                    selectedValue={0}
                    items={[{ label: "Sweden", value: 0 }, { label: "Irak", value: 1 }]} />
            </FormItem>
            <FormItem title="Stay logged in" info="Passowrd must at least containes one upper char" icon={{ type: "AntDesign", name: "lock" }}>
                <CheckBox checked checkBoxType="CheckBox"></CheckBox>
            </FormItem>
            <FormItem title="Stay logged in" info="Passowrd must at least containes one upper char" icon={{ type: "AntDesign", name: "lock" }}>
                <CheckBox checked checkBoxType="Switch"></CheckBox>
            </FormItem>
            <FormItem title="is User">
                <CheckBoxList labelPostion="Left" css={"wi:100% ali:flex-end"} onChange={(changes) => {
                    state.checkBoxes = changes.map(x => x.checked)
                }} checkBoxType="RadioButton" selectionType="Radio">
                    {
                        state.checkBoxes.map((x, i) => (
                            <CheckBox key={i} label={i==0 ? "Yes" : "No"} checked={x} />
                        ))
                    }
                </CheckBoxList>
            </FormItem>
        </Block>
    )
}