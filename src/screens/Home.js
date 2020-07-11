import React, { useState, useLayoutEffect, useContext, useMemo } from 'react'
import { View, StatusBar, Dimensions, Animated, FlatList } from 'react-native'
import Ripple from 'react-native-material-ripple'
import usePrevious from 'react-use-previous'
import { SharedElement } from 'react-navigation-shared-element'
import { ThemeController, ThemeContext } from '../context/ThemeContext'
import Header from '../components/Header'
import Toast from '../components/Toast'
import BottomDock from '../components/BottomDock'

const Home = () => {
	return (
		<ThemeController>
			<Content />
		</ThemeController>
	)
}

export default Home

const Content = () => {
	const { selectedColor, animatedValue, backgroundAnimate, getHSLString, theme, colors } = useContext(ThemeContext)

	useLayoutEffect(
		() => {
			if (selectedColor) {
				animatedValue.setValue(0)
				Animated.sequence([
					Animated.spring(animatedValue, {
						toValue: 1,
						useNativeDriver: true
					}),
					Animated.delay(1000),
					Animated.spring(animatedValue, {
						toValue: 0,
						useNativeDriver: true
					})
				]).start()
			}
		},
		[ selectedColor ]
	)

	const backgroundColor = backgroundAnimate.interpolate({
		inputRange: [ 0, 1 ],
		outputRange: [ getHSLString('#EEEFF4'), getHSLString('#222831') ]
	})

	return (
		<Animated.View
			style={{
				backgroundColor: backgroundColor,
				flex: 1,
				paddingTop: 16 + StatusBar.currentHeight
			}}>
			<StatusBar
				backgroundColor={'transparent'}
				barStyle={theme ? 'dark-content' : 'light-content'}
				animated
				translucent
			/>
			<Header />
			<Toast />
			<FlatList
				showsVerticalScrollIndicator={false}
				style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 16 }}
				columnWrapperStyle={{ justifyContent: 'space-between' }}
				numColumns={2}
				data={colors}
				renderItem={({ item, index }) => <Item index={index} color={item.color} />}
				keyExtractor={(item) => item.id}
			/>
			<BottomDock />
		</Animated.View>
	)
}

const Item = ({ color, index }) => {
	const { backgroundAnimate, getHSLString, animation, colors, navigate, setSelectedColor } = useContext(ThemeContext)
	const [ translate ] = useState(new Animated.Value(0))
	const { width, height } = Dimensions.get('window')
	const size = width / 2.23
	const prevColor = usePrevious(color)?.current || color

	useLayoutEffect(
		() => {
			animation.setValue(0)
			Animated.timing(animation, {
				toValue: 1,
				duration: 1000,
				useNativeDriver: false
			}).start()
		},
		[ color ]
	)

	useLayoutEffect(
		() => {
			translate.setValue(0)
			Animated.timing(translate, {
				toValue: 1,
				duration: 400,
				delay: index * 150,
				useNativeDriver: true
			}).start()
		},
		[ colors.length ]
	)

	const backgroundColor = animation.interpolate({
		inputRange: [ 0, 1 ],
		outputRange: [ getHSLString(prevColor), getHSLString(color) ]
	})

	const overlayColor = backgroundAnimate.interpolate({
		inputRange: [ 0, 1 ],
		outputRange: [ getHSLString('#FFF'), getHSLString('#393e46') ]
	})

	const fontColor = backgroundAnimate.interpolate({
		inputRange: [ 0, 1 ],
		outputRange: [ getHSLString('#000'), getHSLString('#FFF') ]
	})

	const translateY = translate.interpolate({
		inputRange: [ 0, 1 ],
		outputRange: [ height, 0 ]
	})

	return useMemo(
		() => (
			<Animated.View style={{ transform: [ { translateY } ] }}>
				<Ripple
					style={{
						marginBottom: 8
					}}
					rippleContainerBorderRadius={8}
					onPress={() => navigate('Detail', color)}
					onLongPress={() => setSelectedColor(color)}>
					<Animated.View
						style={{
							width: size,
							height: size,
							backgroundColor: overlayColor,
							borderRadius: 8,
							padding: 4
						}}>
						<View style={{ flex: 4 }}>
							<SharedElement id={`item.${color}`}>
								<Animated.View
									style={{
										backgroundColor: backgroundColor,
										width: '100%',
										height: '100%',
										borderRadius: 8
									}}
								/>
							</SharedElement>
						</View>
						<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
							<Animated.Text style={{ textAlign: 'center', color: fontColor }}>
								{color.toUpperCase()}
							</Animated.Text>
						</View>
					</Animated.View>
				</Ripple>
			</Animated.View>
		),
		[ backgroundAnimate, animation, translate, colors ]
	)
}
