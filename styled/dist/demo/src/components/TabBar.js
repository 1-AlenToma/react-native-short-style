var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PanResponder, Platform, View as NativeView, ScrollView as NativeAcrollView, Easing } from "react-native";
import * as React from "react";
import { View, AnimatedView, Text, TouchableOpacity } from "./ReactNativeComponents";
import { ifSelector, optionalStyle } from "../config";
import { useAnimate } from "../hooks";
import StateBuilder from "../States";
import { Icon } from "./Icon";
import { globalData } from "../theme/ThemeContext";
import { Loader } from "./Loader";
const TabBarContext = React.createContext({});
export class TabView extends React.PureComponent {
    render() {
        const props = this.props;
        return (_jsx(View, Object.assign({ inspectDisplayName: "TabView" }, props, { css: x => x.joinRight("TabView fl:1 wi:100% he:100% bac-transparent").joinRight(props.css) })));
    }
}
const TabBarMenu = React.memo(({ children }) => {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    const context = React.useContext(TabBarContext);
    const position = (_a = context.props.position) !== null && _a !== void 0 ? _a : "Bottom";
    let menuItems = children.filter(x => ifSelector(x.props.ifTrue) !== false);
    const state = StateBuilder({
        selectedIndex: context.selectedIndex,
        manuItemSize: undefined,
    }).build();
    let interpolate = menuItems.map((_, i) => { var _a, _b; return ((_b = (_a = state.manuItemSize) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : i) * i; });
    if (interpolate.length <= 1)
        interpolate = [0, 1];
    context.onChange = (index) => {
        state.selectedIndex = index;
    };
    state.useEffect(() => {
        context.onMenuChange(undefined, menuItems.map((_, i) => { var _a, _b; return ((_b = (_a = state.manuItemSize) === null || _a === void 0 ? void 0 : _a.width) !== null && _b !== void 0 ? _b : i) * i; }), state.manuItemSize.width);
    }, "manuItemSize");
    let header = {
        style: optionalStyle((_b = context.props.header) === null || _b === void 0 ? void 0 : _b.style),
        textStyle: optionalStyle((_c = context.props.header) === null || _c === void 0 ? void 0 : _c.textStyle),
        selectedStyle: optionalStyle((_d = context.props.header) === null || _d === void 0 ? void 0 : _d.selectedStyle),
        selectedIconStyle: optionalStyle((_e = context.props.header) === null || _e === void 0 ? void 0 : _e.selectedIconStyle),
        selectedTextStyle: optionalStyle((_f = context.props.header) === null || _f === void 0 ? void 0 : _f.selectedTextStyle),
        overlayStyle: {
            container: optionalStyle((_h = (_g = context.props.header) === null || _g === void 0 ? void 0 : _g.overlayStyle) === null || _h === void 0 ? void 0 : _h.container),
            content: optionalStyle((_k = (_j = context.props.header) === null || _j === void 0 ? void 0 : _j.overlayStyle) === null || _k === void 0 ? void 0 : _k.content)
        }
    };
    const getIcon = (icon, style, index) => {
        var _a;
        if (!icon)
            return null;
        let IconView = (_a = icon.component) !== null && _a !== void 0 ? _a : Icon;
        let iconProps = icon.type ? icon : {};
        let propStyle = icon.props && icon.props.style ? (Array.isArray(icon.props.style) ? icon.props.style : [icon.props.style]) : [];
        const iconStyle = icon.style ? (Array.isArray(icon.style) ? icon.style : [icon.style]) : [];
        let css = x => { var _a, _b; return x.joinLeft((_a = icon.css) !== null && _a !== void 0 ? _a : (_b = icon.props) === null || _b === void 0 ? void 0 : _b.css).joinRight(state.selectedIndex == index ? header.selectedIconStyle.c : undefined); };
        propStyle = [style, ...propStyle, ...iconStyle];
        if (state.selectedIndex == index) {
            propStyle.push(header.selectedIconStyle.o);
        }
        propStyle = optionalStyle(propStyle).o;
        if (state.selectedIndex == index) {
            if (propStyle.color && /(co|color)( )?(\:)/gim.test(header.selectedIconStyle.c))
                delete propStyle.color;
        }
        return (_jsx(IconView, Object.assign({}, iconProps, icon.props, { style: propStyle, css: css })));
    };
    if (menuItems.length <= 1)
        return null; // its a single View no need to display Menu Header;
    const width = (100 / menuItems.length) + "%";
    let border = (_jsx(AnimatedView, { css: header.overlayStyle.container.c, style: [
            {
                backgroundColor: "#e5313a",
            },
            header.overlayStyle.container.o,
            {
                zIndex: 100,
                overflow: "visible",
                borderRadius: 2,
                height: 3,
                width: width,
                transform: [
                    {
                        translateX: context.animated.x.interpolate({
                            inputRange: interpolate.sort((a, b) => a - b),
                            outputRange: interpolate,
                            extrapolate: "clamp"
                        })
                    }
                ]
            }
        ], children: _jsx(View, { onStartShouldSetResponder: event => false, onTouchStart: e => {
                context.onMenuChange(state.selectedIndex);
            }, style: [
                header.overlayStyle.content.o,
                {
                    width: "100%",
                    height: "100%"
                },
                position != "Top"
                    ? { bottom: "-100%" }
                    : { top: "-100%" }
            ], css: `bac:yellow bow:1 boc:red bor:1 _overflow op:0.1 _abc ${header.overlayStyle.content.c}` }) }));
    let selectedStyle = position != "Top"
        ? {
            borderTopWidth: 2,
            borderTopColor: "#ffff2d"
        }
        : {
            borderBottomWidth: 2,
            borderBottomColor: "#ffff2d"
        };
    const menuText = {
        alignSelf: "center",
        textTransform: "uppercase",
    };
    return (_jsxs(View, { css: x => x.cls("_tabBarMenu").if(position == "Bottom", x => x.boTC(".co-gray300").boTW(.5), x => x.boBC(".co-gray300").boBW(.5)).joinRight(header.style.c), style: [header.style.o], children: [position != "Top" ? border : null, _jsx(View, { css: "_tabBarContainerView bac-transparent", children: menuItems.map((x, i) => (_jsxs(TouchableOpacity, { onLayout: event => {
                        let item = event.nativeEvent.layout;
                        if (!item.width || isNaN(item.width))
                            return;
                        state.manuItemSize = item;
                    }, css: `bac-transparent _menuItem ${state.selectedIndex == i ? header.selectedStyle.c : ""}`, style: [
                        i == state.selectedIndex
                            ? selectedStyle
                            : undefined,
                        state.selectedIndex == i ? header.selectedStyle.o : null
                    ], onPress: () => {
                        // state.selectedIndex = i;
                        context.onMenuChange(i);
                    }, children: [x.props.icon ? getIcon(x.props.icon, Object.assign(Object.assign({}, menuText), { height: i == state.selectedIndex ? 15 : 18, fontSize: i == state.selectedIndex ? 15 : 18 }), i) : null, x.props.title ? (_jsx(Text, { style: [Object.assign({}, menuText), header.textStyle.o, state.selectedIndex == i ? header === null || header === void 0 ? void 0 : header.selectedTextStyle.o : null], css: `fos-sm ${state.selectedIndex == i ? header === null || header === void 0 ? void 0 : header.selectedTextStyle.o : ""} ${header.textStyle.c}`, children: x.props.title })) : null] }, i))) }), position == "Top" ? border : null] }));
});
export const TabBar = (props) => {
    var _a, _b, _c, _d;
    const children = React.useMemo(() => Array.isArray(props.children) ? props.children : [props.children], [props.children]);
    const position = (_a = props.position) !== null && _a !== void 0 ? _a : "Bottom";
    const visibleChildren = children.filter(x => ifSelector(x.props.ifTrue) !== false && (x.props.title || x.props.icon));
    const { animate, animateX, currentValue } = useAnimate({ easing: Easing.out(Easing.cubic) });
    const menuAnimation = useAnimate({ easing: Easing.out(Easing.cubic) });
    const temp = {};
    temp[(_b = props.selectedTabIndex) !== null && _b !== void 0 ? _b : 0] = true;
    const state = StateBuilder(() => {
        var _a;
        return ({
            index: (_a = props.selectedTabIndex) !== null && _a !== void 0 ? _a : 0,
            size: { width: 0, height: 0 },
            refItem: {
                rItems: children.map(x => { }),
                loadedViews: temp,
                menuInterpolate: undefined,
                menuItemWidth: undefined,
                startValue: undefined,
                handled: false,
                interpolate: [],
                panResponse: undefined,
            }
        });
    }).ignore("refItem", "size").build();
    //globalData.hook("window");
    const getWidth = (index) => {
        var _a;
        let v = index * ((_a = state.size.width) !== null && _a !== void 0 ? _a : 0);
        if (isNaN(v))
            return 0;
        return v;
    };
    const getInputRange = () => {
        let item = children
            .map((x, i) => {
            return {
                index: i,
                value: i == 0 ? 0 : -getWidth(i)
            };
        })
            .sort((a, b) => a.value - b.value);
        return item;
    };
    state.refItem.interpolate = getInputRange();
    const tAnimate = (index, speed, fn) => {
        let value = index * -state.size.width;
        if (state.refItem.menuInterpolate && state.refItem.menuInterpolate.length > 0)
            menuAnimation.animateX(state.refItem.menuInterpolate[index], undefined, speed);
        animateX(value, () => {
            fn === null || fn === void 0 ? void 0 : fn();
        }, speed);
    };
    const animateLeft = (index) => __awaiter(void 0, void 0, void 0, function* () {
        //while (isAnimating.current) await sleep(100);
        //setIndex(index);
        tAnimate(index, undefined, () => {
            state.index = index;
        });
    });
    let loadChildren = (i, notAnimated) => __awaiter(void 0, void 0, void 0, function* () {
        if (i >= 0 && i < children.length && notAnimated != true) {
            animateLeft(i);
        }
        if (!state.refItem.rItems[i] && children[i]) {
            state.refItem.loadedViews[i] = true;
            if (children[i].props.onLoad)
                children[i].props.onLoad();
        }
    });
    const getView = (index, view) => {
        if (props.lazyLoading && !state.refItem.loadedViews[index])
            return (_jsx(Loader, { loading: true, text: props.loadingText }));
        return view;
    };
    React.useEffect(() => {
        var _a;
        loadChildren((_a = props.selectedTabIndex) !== null && _a !== void 0 ? _a : 0);
    }, [props.selectedTabIndex]);
    state.useEffect(() => {
        var _a, _b;
        if (state.index !== undefined) {
            (_a = props.onTabChange) === null || _a === void 0 ? void 0 : _a.call(props, state.index);
            (_b = contextValue.onChange) === null || _b === void 0 ? void 0 : _b.call(contextValue, state.index);
        }
    }, "index");
    const windowChanged = () => {
        requestAnimationFrame(() => { tAnimate(state.index, 0); });
    };
    globalData.useEffect(windowChanged, "window");
    React.useEffect(() => {
        windowChanged();
    }, [children]);
    const assign = () => {
        const onRelease = (evt, gestureState) => {
            var _a;
            if (state.refItem.handled) {
                //  console.warn(state.refItem.handled)
                // tAnimate(state.index, 0);
                return;
            }
            state.refItem.handled = true;
            currentValue.x = undefined;
            menuAnimation.currentValue.x = undefined;
            let newValue = gestureState.dx;
            let diff = newValue - state.refItem.startValue;
            let width = state.size.width;
            let i = (_a = state.index) !== null && _a !== void 0 ? _a : 0;
            let speed = 200;
            menuAnimation.animate.flattenOffset();
            animate.flattenOffset();
            if (Math.abs(diff) > width / 3) {
                if (diff < 0) {
                    if (i + 1 < children.length)
                        loadChildren(i + 1);
                    else
                        tAnimate(i, speed);
                }
                else {
                    if (i - 1 >= 0)
                        loadChildren(i - 1);
                    else
                        tAnimate(i, speed);
                }
                //  onHide(!visible);
            }
            else {
                tAnimate(i, speed); // reset to start value
            }
            globalData.activePan = false;
            state.refItem.handled = true;
        };
        state.refItem.panResponse =
            PanResponder.create({
                onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
                    return (Platform.OS === 'web' ? gestureState.numberActiveTouches > 0 : false) && gestureState.dx != 0;
                },
                onMoveShouldSetPanResponder: (evt, gestureState) => {
                    const { dx, dy } = gestureState;
                    let lng = 20;
                    // context.panEnabled &&
                    return globalData.panEnabled && (visibleChildren.length > 1 &&
                        (dx > lng || dx < -lng));
                },
                onPanResponderGrant: (e, gestureState) => {
                    var _a;
                    state.refItem.startValue = gestureState.dx;
                    state.refItem.handled = false;
                    globalData.activePan = true;
                    let x1 = (_a = state.refItem.interpolate.find(x => x.index == state.index)) === null || _a === void 0 ? void 0 : _a.value;
                    let x2 = state.refItem.menuInterpolate[state.index];
                    if (!isNaN(x1))
                        animate.x.setValue(x1);
                    if (!isNaN(x2))
                        menuAnimation.animate.x.setValue(x2);
                    animate.extractOffset();
                    menuAnimation.animate.extractOffset();
                    return true;
                },
                onPanResponderTerminationRequest: (ev, gus) => {
                    // onRelease(ev, gus);
                    return true;
                },
                onPanResponderTerminate: onRelease,
                onPanResponderMove: (event, gestureState) => {
                    let newValue = gestureState.dx;
                    let diff = newValue - state.refItem.startValue;
                    let isng = diff < 0;
                    diff = Math.abs(diff) / children.length;
                    diff = Math.min(diff, state.refItem.menuItemWidth);
                    animate.x.setValue(state.refItem.startValue + newValue);
                    menuAnimation.animate.setValue({
                        x: isng ? diff : -diff,
                        y: 0
                    });
                    //  menuAnimate.animate.extractOffset();
                },
                onPanResponderEnd: onRelease,
                onPanResponderRelease: onRelease
            });
    };
    assign();
    const contextValue = {
        onChange: (index) => { },
        onMenuChange: (index, menuInterpolate, menuItemWidth) => {
            if (index != undefined)
                loadChildren(index);
            else if (menuInterpolate) {
                state.refItem.menuInterpolate = menuInterpolate;
                state.refItem.menuItemWidth = menuItemWidth;
                menuAnimation.animateX(state.refItem.menuInterpolate[state.index], undefined, 0);
            }
        },
        props: props,
        lazyLoading: (_c = props.lazyLoading) !== null && _c !== void 0 ? _c : false,
        selectedIndex: (_d = state.index) !== null && _d !== void 0 ? _d : 0,
        size: state.size,
        animated: menuAnimation.animate
    };
    const interpolate = state.refItem.interpolate.map(x => x.value);
    const tabMenu = visibleChildren.length > 1 ? (_jsx(TabBarContext.Provider, { value: contextValue, children: _jsx(TabBarMenu, { children: children }) })) : null;
    return (_jsxs(AnimatedView, { onLayout: (_a) => __awaiter(void 0, [_a], void 0, function* ({ nativeEvent }) {
            state.size = nativeEvent.layout;
            windowChanged();
        }), css: React.useMemo(() => x => x.cls("_tabBar").joinRight(props.css), [props.css]), style: props.style, children: [position === "Top" ? (tabMenu) : null, _jsx(AnimatedView, Object.assign({ css: `_tabBarContainer`, style: [
                    (visibleChildren.length <= 1 ? {
                        minHeight: null,
                        height: null
                    } : null),
                    {
                        transform: [
                            {
                                translateX: animate.x.interpolate({
                                    inputRange: interpolate,
                                    outputRange: interpolate,
                                    extrapolate: "clamp"
                                })
                            }
                        ],
                        width: state.size.width
                    }
                ] }, state.refItem.panResponse.panHandlers, { children: children.map((x, i) => (_jsxs(NativeView, { style: {
                        width: state.size.width,
                        height: '100%',
                        backgroundColor: "transparent"
                    }, children: [x.props.head, !props.disableScrolling && !x.props.disableScrolling ? (_jsx(NativeAcrollView, { style: {
                                width: "100%",
                            }, contentContainerStyle: React.useMemo(() => ({
                                flexGrow: 1,
                                width: "100%",
                                maxWidth: "100%"
                            }), []), children: getView(i, x) })) : (getView(i, x))] }, i))) })), position !== "Top" ? (tabMenu) : null, props.footer] }));
};
//# sourceMappingURL=TabBar.js.map