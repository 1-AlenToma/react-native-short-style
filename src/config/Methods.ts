import { serilizeCssStyle } from "../styles/cssTranslator"

export const newId = () => {
    let id = Date.now().toString(36) + Math.floor(Math.pow(10, 12) + Math.random() * 9 * Math.pow(10, 12)).toString(36)
    return id;
}

export const getClasses = (css: string, globalStyle: any) => {
    globalStyle = serilizeCssStyle(globalStyle);
    let items = css.split(" ").filter(x => x && x.length > 0);
    let props: string[] = [];
    for (let item of items) {
        if (item.indexOf(":") !== -1 && !props.find(x => x == item) && globalStyle[item]) {
            props.push(item)
        }
    }

    return props;
}