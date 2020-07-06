import Home from '../screens/Home'
import Detail from '../screens/Detail'
import { createAppContainer } from 'react-navigation'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'
import { TransitionPresets } from 'react-navigation-stack'

const AppNavigator = createSharedElementStackNavigator(
	{
        Home,
        Detail
	},
	{ initialRouteName: 'Home', headerMode: 'none', defaultNavigationOptions: {
		...TransitionPresets.SlideFromRightIOS
	} }
)

export default createAppContainer(AppNavigator)
