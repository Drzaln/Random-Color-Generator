import * as React from 'react'
import Svg, { Circle, Path } from 'react-native-svg'

export const Sun = ({props, stroke = '#F4D17F'}) => {
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
			className='prefix__feather prefix__feather-sun'
			{...props}>
			<Circle cx={12} cy={12} r={5} />
			<Path d='M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42' />
		</Svg>
	)
}