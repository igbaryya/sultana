import React from 'react';
import LottieFiles from 'lottie-react';
import notFound from '../../../../public/assets/lottie/notFound.json';

type Props = {
	src: object;
	loop?: boolean;
	size?: number;
};
export const APP_LOTTIES = {
	NOT_FOUND: notFound
};
const Lottie = (props: Props) => {
	const { src, loop, size } = props;
	return (
		<LottieFiles
			animationData={src}
			width={size}
			loop={loop}
			size={size}
			autoplay
			sizes="small"
		/>
	);
};

export default Lottie;
