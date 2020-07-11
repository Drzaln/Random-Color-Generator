import React, { useContext, useMemo } from 'react'
import { View, Text, Animated } from 'react-native'
import { ThemeContext } from '../context/ThemeContext'
import Ripple from 'react-native-material-ripple'

const BottomDock = () => {
	const { backgroundAnimate, getHSLString, changeColor } = useContext(ThemeContext)

	const overlayColor = backgroundAnimate.interpolate({
		inputRange: [ 0, 1 ],
		outputRange: [ getHSLString('#FFF'), getHSLString('#393e46') ]
	})

	return useMemo(
		() => (
			<Animated.View
				style={{
					paddingHorizontal: 16,
					paddingTop: 16,
					paddingBottom: 32,
					backgroundColor: overlayColor,
					borderTopEndRadius: 16,
					borderTopStartRadius: 16
				}}>
				<Ripple onPress={() => changeColor()}>
					<View style={{ backgroundColor: '#A3A3F8', padding: 12, borderRadius: 8 }}>
						<Text
							style={{
								textAlign: 'center',
								color: 'white',
								fontWeight: 'bold',
								fontSize: 18,
								fontFamily: 'Roboto'
							}}>
							Generate Palette
						</Text>
					</View>
				</Ripple>
			</Animated.View>
		),
		[ backgroundAnimate ]
	)
}

export default BottomDock
