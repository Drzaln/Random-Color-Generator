import React, { useContext, useMemo } from 'react'
import { View, Text, Animated } from 'react-native'
import { ThemeContext } from '../context/ThemeContext'

const Toast = () => {
	const { selectedColor, animatedValue } = useContext(ThemeContext)

	return useMemo(
		() => (
			<Animated.View
				style={{
					position: 'absolute',
					top: 65,
					left: 20,
					right: 20,
					zIndex: 10,
					transform: [
						{
							translateY: animatedValue.interpolate({
								inputRange: [ 0, 1 ],
								outputRange: [ -500, 0 ]
							})
						}
					]
				}}>
				<ToastBar color={selectedColor} />
			</Animated.View>
		),
		[ selectedColor, animatedValue ]
	)
}

export default Toast

const ToastBar = ({ color }) => {
	return (
		<View
			style={{
				backgroundColor: '#0C1226',
				shadowColor: '#A8B2C3',
				shadowOffset: { width: 0, height: 0 },
				shadowRadius: 15,
				shadowOpacity: 1,
				borderRadius: 29,
				paddingHorizontal: 20,
				paddingVertical: 10,
				alignItems: 'center',
				justifyContent: 'center'
			}}>
			<Text
				style={{
					color: '#FFF'
				}}>
				Color {color.toUpperCase()} copied to your dummy clipboard
			</Text>
		</View>
	)
}
