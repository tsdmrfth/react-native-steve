import React, { useRef, useState } from 'react'
import Animated, {
    useAnimatedGestureHandler,
    useSharedValue,
    withSpring,
    cancelAnimation,
    useAnimatedStyle,
    withDecay
} from 'react-native-reanimated'
import { Dimensions } from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler'

const { width: screenWidth } = Dimensions.get('window')

const getContainerHorizontalSpacing = style => {
    const {
        margin = 0,
        marginHorizontal = 0,
        marginLeft = 0,
        marginRight = 0,
        padding = 0,
        paddingHorizontal = 0,
        paddingLeft = 0,
        paddingRight = 0
    } = style
    return 2 * (margin + marginHorizontal + padding + paddingHorizontal)
           + (marginLeft + marginRight + paddingLeft + paddingRight)
}

export const Steve = ({ data, renderItem, keyExtractor, containerStyle, isRTL, itemStyle }) => {
    const itemLayoutsCache = useRef({})
    const [itemLayouts, setItemLayouts] = useState({})
    const containerHorizontalSpacing = getContainerHorizontalSpacing(containerStyle)
    const translateX = useSharedValue(0)
    const rtlStyle = isRTL ? { flexDirection: 'row-reverse' } : {}
    const onGestureEvent = useAnimatedGestureHandler({
        onStart: (event, context) => {
            if (context.isDecayAnimationRunning) {
                context.isDecayAnimationRunning = false
                cancelAnimation(translateX)
            }
        },
        onActive: (event, context) => {
            translateX.value = (context.offset || 0) + event.translationX
        },
        onEnd: (event, context) => {
            context.offset = translateX.value
            const { offset } = context
            const { velocityX } = event
            const maximumLayerWidth = Math.max(...Object.values(itemLayouts.sumWidthOfLayer))
            const levelDifference = screenWidth - maximumLayerWidth - containerHorizontalSpacing
            const leftBound = 0
            const rightBound = isRTL ? -levelDifference : levelDifference
            const firstCondition = isRTL ? (offset < leftBound) : (offset > leftBound)
            const secondCondition = isRTL ? (offset > rightBound) : (offset < rightBound)

            if (firstCondition) {
                context.offset = leftBound
                translateX.value = withSpring(leftBound, {
                    velocity: velocityX,
                    mass: 0.6,
                    stiffness: 90
                })
            } else if (secondCondition) {
                context.offset = rightBound
                translateX.value = withSpring(rightBound, {
                    velocity: velocityX,
                    mass: 0.6,
                    stiffness: 90
                })
            } else {
                context.isDecayAnimationRunning = true
                let clamp

                if (isRTL) {
                    if (velocityX < 0) {
                        clamp = [0, translateX.value]
                    } else {
                        clamp = [translateX.value, rightBound]
                    }
                } else {
                    if (velocityX < 0) {
                        clamp = [rightBound, translateX.value]
                    } else {
                        clamp = [translateX.value, 0]
                    }
                }

                translateX.value = withDecay(
                    {
                        velocity: velocityX,
                        clamp
                    },
                    () => {
                        context.isDecayAnimationRunning = false
                        context.offset = translateX.value
                    }
                )
            }
        }
    })

    const Items = () => {
        return data.map((item, index) => {
            const itemKey = keyExtractor(item, index)
            return (
                <Item
                    key={itemKey}
                    {...{ item, index, itemKey }}/>
            )
        })
    }

    // eslint-disable-next-line react/display-name
    const Item = ({ item, index, itemKey }) => {
        const style = useAnimatedStyle(() => {
            const { sumWidthOfLayer } = itemLayouts

            if (sumWidthOfLayer) {
                const currentLayerSumWidth = sumWidthOfLayer[itemLayouts[itemKey].layout.y]
                const levelDifference = screenWidth - currentLayerSumWidth
                const maxLevelDifference = screenWidth - Math.max(...Object.values(sumWidthOfLayer))
                const translationX = levelDifference > 0
                    ? translateX.value
                    : (levelDifference * translateX.value) / maxLevelDifference

                return {
                    transform: [
                        {
                            translateX: translationX
                        }
                    ]
                }
            }
            return {}
        }, [itemLayouts])

        return (
            <Animated.View
                style={[style, itemStyle]}
                onLayout={event => handleItemLayout(event, itemKey)}>
                {renderItem({ item, index })}
            </Animated.View>
        )
    }

    const handleItemLayout = (event, key) => {
        if (!itemLayoutsCache.current[key]) {
            itemLayoutsCache.current[key] = event.nativeEvent

            if (Object.keys(itemLayoutsCache.current).length === data.length) {
                finalizeLayoutSetUp()
            }
        }
    }

    const finalizeLayoutSetUp = () => {
        let spacingBetweenItems = 0
        itemLayoutsCache.current = Object
            .values(itemLayoutsCache.current)
            .reduce((accumulator, current, index) => {
                if (index === 0) {
                    const firstIndex = isRTL ? 1 : 0
                    const secondIndex = isRTL ? 0 : 1
                    const firstKey = keyExtractor(data[firstIndex], firstIndex)
                    const secondKey = keyExtractor(data[secondIndex], secondIndex)
                    const firstItem = itemLayoutsCache.current[firstKey]
                    const secondItem = itemLayoutsCache.current[secondKey]
                    spacingBetweenItems = secondItem.layout.x - firstItem.layout.width - firstItem.layout.x
                }

                if (!accumulator.sumWidthOfLayer) {
                    accumulator.sumWidthOfLayer = {}
                }

                if (!accumulator.sumWidthOfLayer[current.layout.y]) {
                    accumulator.sumWidthOfLayer[current.layout.y] = 0
                }

                accumulator.sumWidthOfLayer[current.layout.y] += current.layout.width + spacingBetweenItems
                return accumulator
            }, itemLayoutsCache.current)
        setItemLayouts(itemLayoutsCache.current)
    }

    return (
        <PanGestureHandler {...{ onGestureEvent }}>
            <Animated.View style={rtlStyle}>
                <Animated.View style={[styles.container, containerStyle, rtlStyle]}>
                    <Items/>
                </Animated.View>
            </Animated.View>
        </PanGestureHandler>
    )
}

const styles = {
    container: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        width: screenWidth * 1.8
    }
}

Steve.displayName = 'Steve'
Steve.defaultProps = {
    containerStyle: {},
    isRTL: false
}