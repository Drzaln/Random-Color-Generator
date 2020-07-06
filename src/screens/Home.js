import React, { useState, useLayoutEffect } from 'react'
import { StyleSheet, Text, View, StatusBar, Dimensions, ScrollView, Animated } from 'react-native'
import Ripple from 'react-native-material-ripple'
import randomColor from 'randomcolor'
import hexToHsl from 'hex-to-hsl'
import usePrevious from 'react-use-previous'

const Home = () => {
	const [ colors, setColors ] = useState(getNewColor())
	const [ selectedColor, setSelectedColor ] = useState()
	const [ animatedValue ] = useState(new Animated.Value(0))
	let item
	let justifyContent = 'center'

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
		setColors(getNewColor(6))
	}

	const selectColor = (color) => {
		setSelectedColor(color)
	}

	item = colors.map((color, index) => {
		if (index === colors.length - 1) {
			justifyContent = 'flex-start'
		}
		return (
			<View key={index}>
				<Item color={color} onPress={() => selectColor(color)} />
			</View>
		)
	})

	return (
		<View style={styles.container}>
			<StatusBar backgroundColor='#EEEFF4' barStyle='dark-content' />
			<View style={{ marginBottom: 16, paddingHorizontal: 16 }}>
				<Text style={{ fontWeight: 'bold', fontSize: 24, fontFamily: 'Roboto' }}>Color Palette Generator</Text>
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
			<ScrollView
				showsVerticalScrollIndicator={false}
				style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 16 }}
				contentContainerStyle={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: justifyContent }}>
				{item}
			</ScrollView>
			<BottomDock onPress={() => changeColor()} />
		</View>
	)
}

export default Home

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#EEEFF4',
		flex: 1,
		paddingTop: 16
	}
})

const Item = ({ color, onPress }) => {
	const [ animation ] = useState(new Animated.Value(0))
	const prevColor = usePrevious(color)?.current || color;
	const { width } = Dimensions.get('window')
	const size = width / 2.3

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

	const backgroundColor = animation.interpolate({
		inputRange: [ 0, 1 ],
		outputRange: [ getHSLString(prevColor), getHSLString(color) ]
	})

	return (
		<Ripple
			style={{
				marginHorizontal: 4,
				marginBottom: 8
			}}
			rippleContainerBorderRadius={8}
			onPress={onPress}>
			<View
				style={{
					width: size,
					height: size,
					backgroundColor: 'white',
					borderRadius: 8,
					padding: 4
				}}>
				<Animated.View
					style={{
						backgroundColor: backgroundColor,
						width: '100%',
						flex: 4,
						borderRadius: 8
					}}
				/>
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<Text style={{ textAlign: 'center' }}>{color.toUpperCase()}</Text>
				</View>
			</View>
		</Ripple>
	)
}

const BottomDock = ({ onPress }) => {
	return (
		<View
			style={{
				paddingHorizontal: 16,
				paddingTop: 16,
				paddingBottom: 32,
				backgroundColor: 'white',
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
		</View>
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
		color.push(getColor())
	}
	return color
}

const getHSLString = (color) => {
	const [ h, s, l ] = hexToHsl(color)
	return 'hsl(' + h + ',' + s + '%,' + l + '%)'
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
