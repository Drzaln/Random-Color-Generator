import React, { useContext, useMemo } from 'react'
import { View, Animated } from 'react-native'
import Ripple from 'react-native-material-ripple'
import { ThemeContext } from '../context/ThemeContext'
import { Moon, Sun } from '../assets/icon'

const Header = () => {
	const { backgroundAnimate, getHSLString, theme, toogleTheme } = useContext(ThemeContext)

	const fontColor = backgroundAnimate.interpolate({
		inputRange: [ 0, 1 ],
		outputRange: [ getHSLString('#000'), getHSLString('#FFF') ]
	})

	return useMemo(
		() => (
			<View
				style={{
					marginBottom: 16,
					paddingHorizontal: 16,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center'
				}}>
				<Animated.Text
					style={{
						fontWeight: 'bold',
						fontSize: 24,
						fontFamily: 'Roboto',
						color: fontColor
					}}>
					Color Palette Generator
				</Animated.Text>
				<Ripple onPress={() => toogleTheme()}>{theme ? <Moon /> : <Sun />}</Ripple>
			</View>
		),
		[ backgroundAnimate, theme ]
	)
}

export default Header
