import React, { useState, useLayoutEffect, useContext } from 'react'
import { Text, View, StatusBar, Dimensions, Animated, FlatList } from 'react-native'
import Ripple from 'react-native-material-ripple'
import randomColor from 'randomcolor'
import hexToHsl from 'hex-to-hsl'
import usePrevious from 'react-use-previous'
import { NavigationContext } from 'react-navigation'
import { SharedElement } from 'react-navigation-shared-element'
import { Moon, Sun } from '../assets/icon/index'

const Home = () => {
	const [ colors, setColors ] = useState(getNewColor())
	const [ selectedColor, setSelectedColor ] = useState()
	const [ animatedValue ] = useState(new Animated.Value(0))
	const [ backgroundAnimate ] = useState(new Animated.Value(0))
	const [ theme, setTheme ] = useState(true)
	const navigation = useContext(NavigationContext)

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

	const changeColor = () => {
		setColors(getNewColor(11))
	}

	const navigate = (route, param) => {
		navigation.navigate(route, { param })
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

	const backgroundColor = backgroundAnimate.interpolate({
		inputRange: [ 0, 1 ],
		outputRange: [ getHSLString('#EEEFF4'), getHSLString('#222831') ]
	})

	const fontColor = backgroundAnimate.interpolate({
		inputRange: [ 0, 1 ],
		outputRange: [ getHSLString('#000'), getHSLString('#FFF') ]
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
			<FlatList
				showsVerticalScrollIndicator={false}
				style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 16 }}
				columnWrapperStyle={{ justifyContent: 'space-between' }}
				numColumns={2}
				data={colors}
				renderItem={({ item, index }) => (
					<Item
						index={index}
						colors={colors}
						color={item.color}
						backgroundAnimate={backgroundAnimate}
						theme={theme}
						onPress={() => navigate('Detail', item.color)}
						onLongPress={() => setSelectedColor(item.color)}
					/>
				)}
				keyExtractor={(item) => item.id}
			/>
			<BottomDock onPress={() => changeColor()} theme={theme} backgroundAnimate={backgroundAnimate} />
		</Animated.View>
	)
}

export default Home

const Item = ({ color, onPress, onLongPress, backgroundAnimate, colors, index }) => {
	const [ animation ] = useState(new Animated.Value(0))
	const [ translate ] = useState(new Animated.Value(0))
	const prevColor = usePrevious(color)?.current || color;
	const { width, height } = Dimensions.get('window')
	const size = width / 2.23

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
				duration: 500,
				delay: index * 100,
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

	return (
		<Animated.View style={{ transform: [ { translateY } ] }}>
			<Ripple
				style={{
					marginBottom: 8
				}}
				rippleContainerBorderRadius={8}
				onPress={onPress}
				onLongPress={onLongPress}>
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
	)
}

const BottomDock = ({ onPress, theme, backgroundAnimate }) => {
	const overlayColor = backgroundAnimate.interpolate({
		inputRange: [ 0, 1 ],
		outputRange: [ getHSLString('#FFF'), getHSLString('#393e46') ]
	})

	return (
		<Animated.View
			style={{
				paddingHorizontal: 16,
				paddingTop: 16,
				paddingBottom: 32,
				backgroundColor: overlayColor,
				borderTopEndRadius: 16,
				borderTopStartRadius: 16
			}}>
			<Ripple onPress={onPress}>
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
	)
}

const getColor = () => {
	return randomColor({
		luminosity: 'light',
		hue: 'random'
	})
}

const getNewColor = (colorMuch = 6) => {
	const color = new Array()
	for (let index = 0; index < colorMuch; index++) {
		color.push({ id: index, color: getColor() })
	}
	return color
}

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
				Color {color} copied to your dummy clipboard
			</Text>
		</View>
	)
}
