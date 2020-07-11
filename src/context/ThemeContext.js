import React, { useState, useMemo, useContext } from 'react'
import { Animated } from 'react-native'
import hexToHsl from 'hex-to-hsl'
import randomColor from 'randomcolor'
import { NavigationContext } from 'react-navigation'

const initialState = {
	theme: true,
	colors: [],
	selectedColor: '',
	animatedValue: new Animated.Value(0),
	backgroundAnimate: new Animated.Value(0),
	animation: new Animated.Value(0),
	translate: new Animated.Value(0),
	setTheme: () => {},
	setColors: () => {},
	setSelectedColor: () => {},
	getHSLString: () => {},
	toogleTheme: () => {},
	changeColor: () => {},
	navigate: () => {}
}

export const ThemeContext = React.createContext(initialState)

export const { Provider: ThemeProvider, Consumer: ThemeConsumer } = ThemeContext

export const ThemeController = ({ children }) => {
	const [ selectedColor, setSelectedColor ] = useState('')
	const [ animatedValue ] = useState(new Animated.Value(0))
	const [ backgroundAnimate ] = useState(new Animated.Value(0))
	const [ animation ] = useState(new Animated.Value(0))
	const [ translate ] = useState(new Animated.Value(0))
	const [ theme, setTheme ] = useState(true)
	const navigation = useContext(NavigationContext)

	const getColor = () => {
		return randomColor({
			luminosity: 'light',
			hue: 'random'
		})
	}

	const getNewColor = (colorMuch = 12) => {
		const color = new Array()
		for (let index = 0; index < colorMuch; index++) {
			color.push({ id: index, color: getColor() })
		}
		return color
	}

	const [ colors, setColors ] = useState(getNewColor())

	const getHSLString = (color) => {
		const [ h, s, l ] = hexToHsl(color)
		return 'hsl(' + h + ',' + s + '%,' + l + '%)'
	}

	const hexAToRGBA = (h) => {
		let r = 0,
			g = 0,
			b = 0,
			a = 1

		if (h.length == 5) {
			r = '0x' + h[1] + h[1]
			g = '0x' + h[2] + h[2]
			b = '0x' + h[3] + h[3]
			a = '0x' + h[4] + h[4]
		} else if (h.length == 9) {
			r = '0x' + h[1] + h[2]
			g = '0x' + h[3] + h[4]
			b = '0x' + h[5] + h[6]
			a = '0x' + h[7] + h[8]
		}
		a = +(a / 255).toFixed(3)

		return 'rgba(' + +r + ',' + +g + ',' + +b + ',' + a + ')'
	}

	const changeColor = () => {
		setColors(getNewColor(12))
	}

	const toogleTheme = () => {
		if (theme) {
			Animated.timing(backgroundAnimate, {
				toValue: 1,
				delay: 3,
				useNativeDriver: false
			}).start(() => setTheme(false))
		} else {
			Animated.timing(backgroundAnimate, {
				toValue: 0,
				delay: 3,
				useNativeDriver: false
			}).start(() => setTheme(true))
		}
	}

	const navigate = (route, param) => {
		navigation.navigate(route, { param })
	}

	return useMemo(
		() => (
			<ThemeProvider
				value={{
					theme,
					colors,
					selectedColor,
					animatedValue,
					backgroundAnimate,
					animation,
					translate,
					setTheme,
					setColors,
					setSelectedColor,
					getHSLString,
					toogleTheme,
					changeColor,
					navigate
				}}>
				{children}
			</ThemeProvider>
		),
		[ theme, colors, selectedColor, animatedValue, backgroundAnimate, animation, translate ]
	)
}
