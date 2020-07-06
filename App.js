import React from 'react'
import AppNavigator from './src/navigator/MainNavigator'
import { enableScreens } from "react-native-screens";
enableScreens()

const App = () => {
	return <AppNavigator />
}

export default App
