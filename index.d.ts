declare module 'react-native-steve' {
	import React from 'react'
	import {ViewStyle} from 'react-native'
	
	export type SteveProps = {
		data: any[],
		renderItem: ({item: any, index: number}) => React.ReactNode,
		containerStyle?: ViewStyle
	}
	
	const Steve: React.FunctionComponent<SteveProps> = () => React.ReactNode
	
	export default Steve
}