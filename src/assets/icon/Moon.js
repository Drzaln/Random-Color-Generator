import * as React from 'react'
import Svg, { Path } from 'react-native-svg'

export const Moon = ({props, stroke = '#000'}) => {
	return (
		<Svg
			width={24}
			height={24}
			viewBox='0 0 24 24'
			fill='none'
			stroke={stroke}
			strokeWidth={2}
			strokeLinecap='round'
			strokeLinejoin='round'
			className='prefix__feather prefix__feather-moon'
			{...props}>
			<Path d='M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z' />
		</Svg>
	)
}
