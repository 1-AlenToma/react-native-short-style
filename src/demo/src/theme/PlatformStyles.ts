import { Platform } from "react-native";
import NestedStyleSheet from "../styles/NestedStyleSheet";
const web = NestedStyleSheet.create({
    _formItem: x => x.cls("_overflow").maH(200).boBC("$bobc-gray300").boBW(.8),
    _formItem$View: x => x.wi("100%").maH("95%").cls("_overflow").flD("row").juC("space-between").alI("center").pa(5),
    _formItemCenter: x => x.miH(40).cls("_formItemChildren", "_center").flG(1).alI("flex-end"),
    _buttonGroup: x => x.wi("100%").miH(40).flD("row"),
    _buttonGroupCenter: x => x.wi("100%").miH(40).boR("$bor-sm").boW(0.5).maB(5).alI("center").cls("_overflow"),
    _buttonGroupButton: x => x.boRW(.5).cls("_center").boC("$boc-gray400").pa(5).he("100%").cls("_overflow").child("last", x => x.boRW(0)),
    // remove border from the last button
    _buttonGroupButton_last: x => x.boRW(0),
    _buttonGroupButton$Text: x => x.foS("$fos-sm").foW("bold"),
    selectedValue: x => x.baC("#007fff").co("#FFFFFF"),
    disabled: x => x.op(.8).baC("$baC-gray400"),
    _button: x => x.flD("row").pa(5).maB(5).boR(5).baC("$baC-primary"),
    // _button.Text OR _button.Icon will have this style
    _button$Text$$Icon: x => x.maL(0),
    _button$Text: x => x.paL(2),
    _slider: x => x.di("flex").flD("row").juC("space-between").alI("center").wi("100%").miH(40),
    _sliderButton: x => x.size(30, 30).cls("_center").pa(0),
    _modalClose: x => x.cls("_abc").he(30).wi(30).ri(4).to(4).zI(3).alI("flex-end").baC("$baC-transparent"),
    _modal: x => x.wi("50%"),
    _toast: x => x.zI(1).maW("80%").boR("$bor-sm").boC("$boc-gray400").cls("_overflow _abc sh-sm").pa(5).maW("80%").miH(30),
    // Style for its child at position 0
    _toast$View_0: x => x.fl(1).fillView().flD("row").cls("_center").baC("$baC-transparent"),
    _error: x => x.co("$co-light").baC("$baC-error"),
    _info: x => x.co("$co-light").baC("$baC-info"),
    _warning: x => x.co("$co-dark").baC("$baC-warning"),
    _success: x => x.co("$co-light").baC("$baC-success"),
    _tabBarMenu: x => x.wi("100%").fl(1).he(40).maH(40).cls("_overflow")

});

const android = NestedStyleSheet.create({
    _formItem: x => x.cls("_overflow").maH(200).boBC("$bobc-gray300").boBW(.8),
    _formItem$View: x => x.wi("100%").maH("95%").cls("_overflow").flD("row").juC("space-between").alI("center").pa(5),
    _formItemCenter: x => x.miH(40).cls("_formItemChildren", "_center").flG(1).alI("flex-end"),
});

export const PlatformStyleSheet = () => {
    return Platform.OS == "web" ? web : android;
}