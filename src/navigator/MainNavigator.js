import React from 'react'
import { createStackNavigator } from 'react-navigation-stack'
import Home from '../screens/Home'
import { createAppContainer } from 'react-navigation'

const AppNavigator = createStackNavigator(
	{
		Home
	},
	{ initialRouteName: 'Home', headerMode: 'none' }
)

export default createAppContainer(AppNavigator)
