import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { PanResponder, Platform, View as NativeView, ScrollView as NativeAcrollView, Easing } from "react-native";
import * as React from "react";
import { View, AnimatedView, Text, TouchableOpacity } from "./ReactNativeComponents";
import { ifSelector, optionalStyle } from "../config";
import { useAnimate, useLocalMemo } from "../hooks";
import StateBuilder from "../States";
import { Icon } from "./Icon";
import { globalData } from "../theme/ThemeContext";
import { Loader } from "./Loader";
const TabBarContext = React.createContext({});
export class TabView extends React.PureComponent {
    render() {
        const props = this.props;
        return (_jsx(View, { inspectDisplayName: "TabView", ...props, css: x => x.joinRight("TabView fl:1 wi:100% he:100% bac-transparent").joinRight(props.css) }));
    }
}
const TabBarMenu = ({ children }) => {
    const context = React.useContext(TabBarContext);
    const position = context.props.position ?? "Bottom";
    const { mem, memo } = useLocalMemo();
    let menuItems = children.filter(x => ifSelector(x.props.ifTrue) !== false);
    const state = StateBuilder({
        selectedIndex: context.selectedIndex,
        manuItemSize: undefined,
    }).build();
    let interpolate = React.useMemo(() => {
        let res = menuItems.map((_, i) => (state.manuItemSize?.width ?? i) * i);
        if (res.length <= 1)
            res = [0, 1];
        return res;
    }, [state.manuItemSize?.width, children.length, menuItems.length]);
    context.onChange = mem((index) => {
        state.selectedIndex = index;
    });
    state.useEffect(() => {
        context.onMenuChange(undefined, menuItems.map((_, i) => (state.manuItemSize?.width ?? i) * i), state.manuItemSize.width);
    }, "manuItemSize");
    let header = memo(() => ({
        style: optionalStyle(context.props.header?.style),
        textStyle: optionalStyle(context.props.header?.textStyle),
        selectedStyle: optionalStyle(context.props.header?.selectedStyle),
        selectedIconStyle: optionalStyle(context.props.header?.selectedIconStyle),
        selectedTextStyle: optionalStyle(context.props.header?.selectedTextStyle),
        overlayStyle: {
            container: optionalStyle(context.props.header?.overlayStyle?.container),
            content: optionalStyle(context.props.header?.overlayStyle?.content)
        }
    }), context.props.header);
    const getIcon = mem((icon, style, index) => {
        if (!icon)
            return null;
        let IconView = icon.component ?? Icon;
        let iconProps = icon.type ? icon : {};
        let propStyle = icon.props && icon.props.style ? (Array.isArray(icon.props.style) ? icon.props.style : [icon.props.style]) : [];
        const iconStyle = icon.style ? (Array.isArray(icon.style) ? icon.style : [icon.style]) : [];
        let css = x => x.joinLeft(icon.css ?? icon.props?.css).joinRight(state.selectedIndex == index ? header.selectedIconStyle.c : undefined);
        propStyle = [style, ...propStyle, ...iconStyle];
        if (state.selectedIndex == index) {
            propStyle.push(header.selectedIconStyle.o);
        }
        propStyle = optionalStyle(propStyle).o;
        if (state.selectedIndex == index) {
            if (propStyle.color && /(co|color)( )?(\:)/gim.test(header.selectedIconStyle.c))
                delete propStyle.color;
        }
        return (_jsx(IconView, { ...iconProps, ...icon.props, style: propStyle, css: css }));
    }, header);
    if (menuItems.length <= 1)
        return null; // its a single View no need to display Menu Header;
    const width = (100 / menuItems.length) + "%";
    let border = (_jsx(AnimatedView, { css: header.overlayStyle.container.c, style: memo(() => [
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
        ], context.animated.x, header, interpolate, width), children: _jsx(View, { onStartShouldSetResponder: mem(event => false), onTouchStart: mem(e => {
                context.onMenuChange(state.selectedIndex);
            }), style: memo(() => [
                header.overlayStyle.content.o,
                {
                    width: "100%",
                    height: "100%"
                },
                position != "Top"
                    ? { bottom: "-100%" }
                    : { top: "-100%" }
            ], header, position), css: `bac:yellow bow:1 boc:red bor:1 _overflow op:0.1 _abc ${header.overlayStyle.content.c}` }) }));
    let selectedStyle = mem(position != "Top"
        ? {
            borderTopWidth: 2,
            borderTopColor: "#ffff2d"
        }
        : {
            borderBottomWidth: 2,
            borderBottomColor: "#ffff2d"
        }, position);
    const menuText = mem({
        alignSelf: "center",
        textTransform: "uppercase",
    });
    return (_jsxs(View, { css: mem(x => x.cls("_tabBarMenu").if(position == "Bottom", x => x.boTC(".co-gray300").boTW(.5), x => x.boBC(".co-gray300").boBW(.5)).joinRight(header.style.c), position, header), style: header.style.o, children: [position != "Top" ? border : null, _jsx(View, { css: "_tabBarContainerView bac-transparent", children: menuItems.map((x, i) => (_jsxs(TouchableOpacity, { onLayout: mem(event => {
                        let item = event.nativeEvent.layout;
                        if (!item.width || isNaN(item.width))
                            return;
                        state.manuItemSize = item;
                    }), css: `bac-transparent _menuItem ${state.selectedIndex == i ? header.selectedStyle.c : ""}`, style: mem([
                        i == state.selectedIndex
                            ? selectedStyle
                            : undefined,
                        state.selectedIndex == i ? header.selectedStyle.o : null
                    ], state.selectedIndex, header, i, selectedStyle), onPress: mem(() => {
                        // state.selectedIndex = i;
                        context.onMenuChange(i);
                    }, context.onMenuChange), children: [mem(x.props.icon ? getIcon(x.props.icon, {
                            ...menuText,
                            height: i == state.selectedIndex ? 15 : 18,
                            fontSize: i == state.selectedIndex ? 15 : 18
                        }, i) : null, x.props.icon, state.selectedIndex, i), x.props.title ? (_jsx(Text, { style: mem([{ ...menuText }, header.textStyle.o, state.selectedIndex == i ? header?.selectedTextStyle.o : null], header, state.selectedIndex, i), css: `fos-sm ${state.selectedIndex == i ? header?.selectedTextStyle.o : ""} ${header.textStyle.c}`, children: x.props.title })) : null] }, i))) }), position == "Top" ? border : null] }));
};
export const TabBar = (props) => {
    const children = React.useMemo(() => Array.isArray(props.children) ? props.children : [props.children], [props.children]);
    const position = props.position ?? "Bottom";
    const { mem, memo } = useLocalMemo();
    const visibleChildren = children.filter(x => ifSelector(x.props.ifTrue) !== false && (x.props.title || x.props.icon));
    const { animate, animateX, currentValue } = useAnimate({ easing: Easing.out(Easing.cubic) });
    const menuAnimation = useAnimate({ easing: Easing.out(Easing.cubic) });
    const temp = {};
    temp[props.selectedTabIndex ?? 0] = true;
    const state = StateBuilder(() => ({
        index: props.selectedTabIndex ?? 0,
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
    })).ignore("refItem", "size").build();
    //globalData.hook("window");
    const getWidth = mem((index) => {
        let v = index * (state.size.width ?? 0);
        if (isNaN(v))
            return 0;
        return v;
    }, state.size);
    const getInputRange = mem(() => {
        let item = children
            .map((x, i) => {
            return {
                index: i,
                value: i == 0 ? 0 : -getWidth(i)
            };
        })
            .sort((a, b) => a.value - b.value);
        return item;
    }, children);
    state.refItem.interpolate = getInputRange();
    const tAnimate = mem((index, speed, fn) => {
        let value = index * -state.size.width;
        if (state.refItem.menuInterpolate && state.refItem.menuInterpolate.length > 0)
            menuAnimation.animateX(state.refItem.menuInterpolate[index], undefined, speed);
        animateX(value, () => {
            fn?.();
        }, speed);
    });
    const animateLeft = mem(async (index) => {
        //while (isAnimating.current) await sleep(100);
        //setIndex(index);
        tAnimate(index, undefined, () => {
            state.index = index;
        });
    }, tAnimate);
    let loadChildren = mem(async (i, notAnimated) => {
        if (i >= 0 && i < children.length && notAnimated != true) {
            animateLeft(i);
        }
        if (!state.refItem.rItems[i] && children[i]) {
            state.refItem.loadedViews[i] = true;
            if (children[i].props.onLoad)
                children[i].props.onLoad();
        }
    }, children, tAnimate);
    const getView = mem((index, view) => {
        if (props.lazyLoading && !state.refItem.loadedViews[index])
            return (_jsx(Loader, { loading: true, text: props.loadingText }));
        return view;
    }, props.lazyLoading, props.loadingText);
    React.useEffect(() => {
        loadChildren(props.selectedTabIndex ?? 0);
    }, [props.selectedTabIndex]);
    state.useEffect(() => {
        if (state.index !== undefined) {
            props.onTabChange?.(state.index);
            contextValue.onChange?.(state.index);
        }
    }, "index");
    const windowChanged = mem(() => {
        requestAnimationFrame(() => { tAnimate(state.index, 0); });
    }, tAnimate);
    globalData.useEffect(windowChanged, "window");
    React.useEffect(() => {
        windowChanged();
    }, [children]);
    const assign = mem(() => {
        const onRelease = (evt, gestureState) => {
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
            let i = state.index ?? 0;
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
                    state.refItem.startValue = gestureState.dx;
                    state.refItem.handled = false;
                    globalData.activePan = true;
                    let x1 = state.refItem.interpolate.find(x => x.index == state.index)?.value;
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
    }, tAnimate, state.size);
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
        lazyLoading: props.lazyLoading ?? false,
        selectedIndex: state.index ?? 0,
        size: state.size,
        animated: menuAnimation.animate
    };
    const interpolate = state.refItem.interpolate.map(x => x.value);
    const tabMenu = visibleChildren.length > 1 ? (_jsx(TabBarContext.Provider, { value: contextValue, children: _jsx(TabBarMenu, { children: children }) })) : null;
    return (_jsxs(AnimatedView, { onLayout: mem(async ({ nativeEvent }) => {
            state.size = nativeEvent.layout;
            windowChanged();
        }, windowChanged), css: mem(x => x.cls("_tabBar").joinRight(props.css), props.css), style: props.style, children: [position === "Top" ? (tabMenu) : null, _jsx(AnimatedView, { css: `_tabBarContainer`, style: memo(() => [
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
                ], visibleChildren.length, animate.x, state.refItem.interpolate, state.size), ...state.refItem.panResponse.panHandlers, children: children.map((x, i) => (_jsxs(NativeView, { style: mem({
                        width: state.size.width,
                        height: '100%',
                        backgroundColor: "transparent"
                    }, state.size), children: [x.props.head, !props.disableScrolling && !x.props.disableScrolling ? (_jsx(NativeAcrollView, { style: mem({
                                width: "100%",
                            }), contentContainerStyle: mem({
                                flexGrow: 1,
                                width: "100%",
                                maxWidth: "100%"
                            }), children: getView(i, x) })) : (getView(i, x))] }, i))) }), position !== "Top" ? (tabMenu) : null, props.footer] }));
};
//# sourceMappingURL=TabBar.js.map