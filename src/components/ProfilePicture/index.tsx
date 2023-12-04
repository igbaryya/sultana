import React, { useState } from 'react';
import './index.scss';

type Props = {
	imgSrc?: string;
	size?: number;
};
export const DEFAULT_AVATAR = '/assets/images/default-avatar.jpg';
export default function ProfilePicture({ imgSrc, size = 35 }: Props) {
	const [src, setSrc] = useState(imgSrc || DEFAULT_AVATAR);
	return (
		<div
			className="profile-picture-wrapper"
			style={{ width: size, height: size }}
		>
			<img
				src={src}
				alt=""
				onError={() => {
					// eslint-disable-next-line @typescript-eslint/no-var-requires
					setSrc(DEFAULT_AVATAR);
				}}
			/>
		</div>
	);
}
