import Home from '../screens/Home'
import Detail from '../screens/Detail'
import { createAppContainer } from 'react-navigation'
import { createSharedElementStackNavigator } from 'react-navigation-shared-element'

const AppNavigator = createSharedElementStackNavigator(
	{
        Home,
        Detail
	},
	{ initialRouteName: 'Home', headerMode: 'none' }
)

export default createAppContainer(AppNavigator)
