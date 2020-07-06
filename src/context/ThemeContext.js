import React, { useState, useMemo } from 'react'
import { Animated } from 'react-native'

const initialState = {
	theme: true,
	backgroundAnimte: new Animated.Value(0),
	setTheme: () => {}
}

export const ThemeContext = React.createContext(initialState)

export const { Provider: ThemeProvider, Consumer: ThemeConsumer } = ThemeContext

export const ThemeController = ({ children }) => {
	const [ theme, setTheme ] = useState(true)
	const [ backgroundAnimate ] = useState(new Animated.Value(0))

	return useMemo(
		() => (
			<ThemeProvider
				value={{
					theme,
					backgroundAnimte,
					setTheme
				}}>
				{children}
			</ThemeProvider>
		),
		[ theme, backgroundAnimate ]
	)
}
