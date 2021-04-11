declare module 'react-native-steve' {
	import { ViewStyle } from 'react-native';
	
	export interface SteveProps<T> {
		data: T[],
		renderItem: ({item, index}: {item: T, index: number}) => JSX.Element,
		keyExtractor: (item: T, index: number) => string,
		containerStyle?: ViewStyle,
		isRTL?: boolean,
		itemStyle?: ViewStyle
	}
	const Steve: <T extends {}>(props: SteveProps<T>) => JSX.Element;
	
	export default Steve;
}

