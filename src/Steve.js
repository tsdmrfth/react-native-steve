import React, { useRef, useState } from 'react'
import Animated, {
    useAnimatedGestureHandler,
    useSharedValue,
    withDecay,
    withSpring,
    cancelAnimation,
    useAnimatedStyle
} from 'react-native-reanimated'
import { Dimensions } from 'react-native'
import { PanGestureHandler } from 'react-native-gesture-handler'

const { width: screenWidth } = Dimensions.get('window')
const containerPaddingHorizontal = 10

export const Steve = ({ data, renderItem, keyExtractor, containerStyle }) => {
    const itemLayoutsCache = useRef({})
    const [itemLayouts, setItemLayouts] = useState({})
    const translateX = useSharedValue(0)
    const paddingHorizontal = containerStyle?.paddingHorizontal || containerPaddingHorizontal
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
            const maxLevelDifference = screenWidth - Math.max(...Object.values(itemLayouts.sumWidthOfLayer))
            const leftBound = 0
            const rightBound = maxLevelDifference - paddingHorizontal

            if (offset > leftBound) {
                context.offset = leftBound
                translateX.value = withSpring(leftBound, {
                    velocity: velocityX,
                    mass: 0.6,
                    stiffness: 90
                })
            } else if (offset < rightBound) {
                context.offset = rightBound
                translateX.value = withSpring(rightBound, {
                    velocity: velocityX,
                    mass: 0.6,
                    stiffness: 90
                })
            } else {
                context.isDecayAnimationRunning = true
                translateX.value = withDecay(
                    {
                        velocity: velocityX,
                        clamp: velocityX < 0 ? [rightBound, translateX.value] : [translateX.value, 0]
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
                {...{ style }}
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
        itemLayoutsCache.current = Object
            .values(itemLayoutsCache.current)
            .reduce((accumulator, current) => {
                if (!accumulator.sumWidthOfLayer) {
                    accumulator.sumWidthOfLayer = {}
                }

                if (!accumulator.sumWidthOfLayer[current.layout.y]) {
                    accumulator.sumWidthOfLayer[current.layout.y] = 0
                }

                const tempMax = accumulator.sumWidthOfLayer[current.layout.y]
                const maybeMax = current.layout.x + current.layout.width

                if (maybeMax > tempMax) {
                    accumulator.sumWidthOfLayer[current.layout.y] = maybeMax
                }

                return accumulator
            }, itemLayoutsCache.current)
        setItemLayouts(itemLayoutsCache.current)
    }

    return (
        <PanGestureHandler
            activeOffsetX={[0, 0]}
            {...{ onGestureEvent }}
            activeOffsetY={[-Number.MAX_VALUE, Number.MAX_VALUE]}>
            <Animated.View style={[styles.container, containerStyle]}>
                <Items/>
            </Animated.View>
        </PanGestureHandler>
    )
}

const styles = {
    container: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        width: screenWidth * 1.8,
        paddingHorizontal: containerPaddingHorizontal
    }
}

Steve.displayName = 'Steve'