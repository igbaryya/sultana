import React from 'react';

const LoaderButton: React.FC = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			style={{ width: '20px', height: '20px', marginRight: '8px' }}
			viewBox="0 0 100 100"
			preserveAspectRatio="xMidYMid"
		>
			<circle
				cx="50"
				cy="50"
				fill="none"
				stroke="white"
				strokeWidth="10"
				r="35"
				strokeDasharray="164 50"
				transform="rotate(137.5 50 50)"
			>
				<animateTransform
					attributeName="transform"
					type="rotate"
					repeatCount="indefinite"
					dur="1.5s"
					keyTimes="0;1"
					values="0 50 50;360 50 50"
				/>
			</circle>
		</svg>
	);
};

export default LoaderButton;
