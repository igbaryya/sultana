import React from 'react';
import { WithTranslation, withTranslation } from 'react-i18next';

interface Props extends WithTranslation {
	children?: any;
	fontSize?: number;
	color?: string;
	textAlign?: 'center' | 'right' | 'left';
	bold?: boolean;
	padding?: number | string;
	pt?: number;
	pb?: number;
	pl?: number;
	pr?: number;
	translation?: string;
}
function Text({
	children,
	textAlign,
	color,
	fontSize,
	bold,
	padding,
	pt,
	pb,
	pr,
	pl,
	t,
	translation
}: Props) {
	return (
		<div style={{
			padding,
			textAlign,
			paddingTop: pt,
			paddingBottom: pb,
			paddingLeft: pl,
			paddingRight: pr,
		}}
		>
			<span style={{
				color,
				fontSize,
				fontWeight: bold ? 'bold' : 'normal',
			}}
			>
				{translation ? t(translation) : children}
			</span>
		</div>
	);
}

export default withTranslation()(Text);
