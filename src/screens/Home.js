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

	return (
		<View style={{
			backgroundColor: theme ? '#EEEFF4' : '#222831',
			flex: 1,
			paddingTop: 16
		}}>
			<StatusBar
				backgroundColor={theme ? '#EEEFF4' : '#222831'}
				barStyle={theme ? 'dark-content' : 'light-content'}
				animated
			/>
			<View
				style={{
					marginBottom: 16,
					paddingHorizontal: 16,
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center'
				}}>
				<Text
					style={{
						fontWeight: 'bold',
						fontSize: 24,
						fontFamily: 'Roboto',
						color: theme ? 'black' : 'white'
					}}>
					Color Palette Generator
				</Text>
				<Ripple onPress={() => setTheme(!theme)}>{theme ? <Moon /> : <Sun />}</Ripple>
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
				renderItem={({ item }) => <Item color={item.color} theme={theme} onPress={() => navigate('Detail', item.color)} />}
				keyExtractor={(item) => item.id}
			/>
			<BottomDock onPress={() => changeColor()} theme={theme} />
		</View>
	)
}

export default Home

const Item = ({ color, onPress, theme }) => {
	const [ animation ] = useState(new Animated.Value(0))
	const prevColor = usePrevious(color)?.current || color;
	const { width } = Dimensions.get('window')
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

	const backgroundColor = animation.interpolate({
		inputRange: [ 0, 1 ],
		outputRange: [ getHSLString(prevColor), getHSLString(color) ]
	})

	return (
		<Ripple
			style={{
				marginBottom: 8
			}}
			rippleContainerBorderRadius={8}
			onPress={onPress}>
			<View
				style={{
					width: size,
					height: size,
					backgroundColor: theme ? 'white' : '#393e46',
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
					<Text style={{ textAlign: 'center', color: theme ? 'black' : 'white' }}>{color.toUpperCase()}</Text>
				</View>
			</View>
		</Ripple>
	)
}

const BottomDock = ({ onPress, theme }) => {
	return (
		<View
			style={{
				paddingHorizontal: 16,
				paddingTop: 16,
				paddingBottom: 32,
				backgroundColor: theme ? 'white' : '#393e46',
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
		color.push({ id: index, color: getColor() })
	}
	return color
}

const getHSLString = (color) => {
	const [ h, s, l ] = hexToHsl(color)
	return 'hsl(' + h + ',' + s + '%,' + l + '%)'
}

const hexAToRGBA = (h) => {
	let r = 0, g = 0, b = 0, a = 1;
  
	if (h.length == 5) {
	  r = "0x" + h[1] + h[1];
	  g = "0x" + h[2] + h[2];
	  b = "0x" + h[3] + h[3];
	  a = "0x" + h[4] + h[4];
  
	} else if (h.length == 9) {
	  r = "0x" + h[1] + h[2];
	  g = "0x" + h[3] + h[4];
	  b = "0x" + h[5] + h[6];
	  a = "0x" + h[7] + h[8];
	}
	a = +(a / 255).toFixed(3);
  
	return "rgba(" + +r + "," + +g + "," + +b + "," + a + ")";
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
