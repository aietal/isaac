import { StepType, TourProvider } from '@reactour/tour';
import { steps } from '@utils/tourSteps';
import React, { ReactNode } from 'react';

type Props = {
	children: ReactNode;
};

const EditorTourProvider = ({ children }: Props) => {
	return (
		<TourProvider
			disableDotsNavigation={true}
			steps={steps as StepType[]}
			showCloseButton={false}
			onClickMask={({ setCurrentStep, currentStep, steps, setIsOpen }) => {
				null;
			}}
			showNavigation={false}
			showBadge={false}
			styles={{
				popover: base => ({
					...base,
					borderRadius: '10px',
					// backgroundColor:
					// 	theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
				}),
				maskArea: base => ({ ...base, rx: 10 }),
				badge: base => ({
					...base,
					background: null,
					left: -32,
					top: -24,
					boxShadow: null,
				}),
			}}
		>
			{children}
		</TourProvider>
	);
};

export default EditorTourProvider;
