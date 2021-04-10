# react-native-steve

React Native horizontal scroll view component as seen on Clubhouse tags

![BUM](https://media.giphy.com/media/FFq4lKeqeAIFrh7CrI/giphy.gif)

## Installation

```sh
npm install react-native-steve
```

or

```sh
yarn add react-native-steve
```

## Dependencies
This library requires [react-native-reanimated](https://github.com/software-mansion/react-native-reanimated) and [react-native-gesture-handler](https://github.com/software-mansion/react-native-gesture-handler)

### Important

> This component uses [react-native-reanimated](https://docs.swmansion.com/react-native-reanimated/docs) v2 stable version so in order to use this component your app must be configured for reanimated v2

## Usage

```javascript
import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Steve from 'react-native-steve'

const topics = [
    {
        emoji: '🍻',
        text: 'Entertainment'
    },
    {
        emoji: '🐈',
        text: 'Cats'
    },
    {
        emoji: '🦾',
        text: 'Robots'
    },
    {
        emoji: '🎉',
        text: 'Party'
    },
    {
        emoji: '🌍',
        text: 'World'
    },
    {
        emoji: '📚',
        text: 'Books'
    },
    {
        emoji: '👘',
        text: 'Fashion'
    },
    {
        emoji: '📱',
        text: 'Applications'
    },
    {
        emoji: '📸',
        text: 'Photography'
    },
    {
        emoji: '🧠',
        text: 'Ideas'
    },
    {
        emoji: '⚔️',
        text: 'War'
    },
    {
        emoji: '💼',
        text: 'Business'
    },
    {
        emoji: '🎭',
        text: 'Theater'
    },
    {
        emoji: '📮',
        text: 'Job'
    }
]

export default function TopicsScreen() {
    const { topicContainer, topicText, title } = styles

    const renderTopic = ({ item }) => {
        const { emoji, text } = item
        return (
            <View style={topicContainer} >
                <Text >
                    {emoji}
                </Text >
                <Text style={topicText} >
                    {text}
                </Text >
            </View >
        )
    }

    return (
        <View style={styles.container} >
            <Text style={title} >
                {'TOPICS TO EXPLORE'}
            </Text >
            <Steve
                data={topics}
                renderItem={renderTopic}
                keyExtractor={item => item.text} />
        </View >
    )
}

App.displayName = 'App'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
        justifyContent: 'center'
    },
    topicContainer: {
        borderWidth: 1,
        borderColor: '#ecd9d9',
        borderBottomWidth: 2,
        borderRadius: 10,
        paddingHorizontal: 10,
        height: 38,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        margin: 5,
        backgroundColor: '#FFF'
    },
    topicText: {
        fontSize: 14,
        fontWeight: '500',
        marginLeft: 5
    },
    title: {
        fontSize: 13,
        color: 'rgb(134,130,119)',
        marginBottom: 5,
        marginLeft: 15,
        fontWeight: '600'
    }
})
```

## Props

| name                      | required | type |  default | description |
| ------------------------- | -------- | ---- |  ------- | ------------|
| data                | yes      |   Array      |  | An array of items to render
| renderItem | yes | Function | | Function that returns a component with given item and index. It is similar to FlatList's renderItem prop  |
|keyExtractor| yes | Function| | Function that returns an unique key for each item in the array. Notice that it is a must to provide a unique key since it's used to make calculations||
|containerStyle|no|Style Object| | Style to use for root component | 

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

## Author

#### [tsdmrfth](https://twitter.com/tsdmrfth)
