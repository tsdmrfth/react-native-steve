import * as React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Steve from 'react-native-steve'

export default function App() {
    const [result, setResult] = React.useState()

    React.useEffect(() => {
        Steve.multiply(3, 7).then(setResult)
    }, [])

    return (
        <View style={styles.container}>
            <Text>
                Result:
                {result}
            </Text>
        </View>
    )
}

App.displayName = 'App'

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    box: {
        width: 60,
        height: 60,
        marginVertical: 20
    }
})
