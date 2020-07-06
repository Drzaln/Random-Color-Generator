import React from 'react'
import AppNavigator from './src/navigator/MainNavigator'
import { enableScreens } from "react-native-screens";
import codePush from 'react-native-code-push';
enableScreens()

const MyApp = () => {
	return <AppNavigator />
}

const App = codePush(MyApp)

export default App
