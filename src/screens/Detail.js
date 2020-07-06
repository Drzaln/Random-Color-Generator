import React, { useContext, useState } from 'react'
import { View, Text, StatusBar } from 'react-native'
import { NavigationContext } from 'react-navigation'
import { SharedElement } from 'react-navigation-shared-element'

const Detail = () => {
    const navigation = useContext(NavigationContext)
    const [color, setColor] = useState(navigation.getParam('param'))

	return (
		<View
			style={{
				backgroundColor: '#EEEFF4',
				flex: 1,
			}}>
			<StatusBar backgroundColor={color} barStyle='dark-content' animated />
            <SharedElement id={`item.${color}`} >
			<View style={{backgroundColor: color, width: '100%', height: 100, borderBottomEndRadius: 16, borderBottomStartRadius: 16}} />
            </SharedElement>
		</View>
	)
}

Detail.sharedElements = (navigation) => {
    const color = navigation.getParam('param');
    return [`item.${color}`];
  };

export default Detail
