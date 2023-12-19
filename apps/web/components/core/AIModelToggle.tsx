import { Logomark } from '@components/landing/Logo';
import { Button } from '@components/ui/button';
import { Popover, PopoverAnchor, PopoverContent } from '@components/ui/popover';
import { useUser } from '@context/user';
import useToggle from '@hooks/useToggle';
import { useLocalStorage } from '@mantine/hooks';
import classed from '@utils/classed';
import { cva } from 'cva';
import {
	aiModelList,
	AIModelLocalStorageKey,
	AIModels,
} from 'data/aiModels.data';
import { ArrowRightIcon, SparklesIcon } from 'lucide-react';
import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const ToggleButton = classed.button(
	cva({
		base: 'text-xs font-medium leading-none flex items-center gap-1 px-2.5 py-1.5 rounded-md w-full whitespace-nowrap',
		variants: {
			isActive: {
				true: 'text-primary-foreground',
				false: 'text-primary hover:bg-secondary opacity-70',
			},
		},
	}),
);

export default function AIModelToggle() {
	const [selectedModel, setSelectedModel] = useLocalStorage({
		key: AIModelLocalStorageKey,
		defaultValue: AIModels.GPT_3_5,
	});
	const [models, setModels] = useState(aiModelList);
	const { user } = useUser();
	useEffect(() => {
		if (user?.is_subscribed) {
			setModels(state => state.map(i => ({ ...i, disabled: false })));
		} else if (user?.is_subscribed === false) {
			setSelectedModel(AIModels.GPT_3_5);
		}
	}, [user]);

	const buttons = useRef<Partial<Record<AIModels, HTMLButtonElement>>>({});

	const currentButtonRef = buttons.current[selectedModel];
	const currentButtonRect = useMemo(
		() =>
			currentButtonRef?.getBoundingClientRect() ?? {
				height: 0,
				width: 0,
				left: 0,
				top: 0,
			},
		[currentButtonRef],
	);

	// Visibility of upgrade CTA
	const [isUpgradeVisible, openUpgrade, , , setUpgradeVisible] = useToggle();

	return (
		<Popover onOpenChange={setUpgradeVisible} open={isUpgradeVisible}>
			<PopoverAnchor className="w-full">
				<div className="p-0.5 border flex items-center gap-0.5 rounded-lg overflow-hidden z-10 relative">
					{models.map(({ model, disabled, label }) => (
						<ToggleButton
							key={model}
							ref={el => (buttons.current[model] = el)}
							onClick={useCallback(
								() => (disabled ? openUpgrade() : setSelectedModel(model)),
								[disabled, model],
							)}
							isActive={model === selectedModel}
							className="transition-color duration-200 ease-out-expo"
						>
							{disabled && <SparklesIcon size={12} />}
							{label}
						</ToggleButton>
					))}
					<div
						className="rounded-md bg-primary absolute transition-all duration-500 ease-out-expo -z-10"
						style={{
							height: currentButtonRect.height + 'px',
							width: currentButtonRect.width + 'px',
							left: currentButtonRef?.offsetLeft + 'px',
							top: currentButtonRef?.offsetTop + 'px',
						}}
					/>
				</div>
			</PopoverAnchor>
			<PopoverContent className="bg-isaac text-white shadow-xl border-none shadow-isaac/20 flex flex-col gap-[0.5lh]">
				<span className="font-bold text-lg flex items-center">
					<Logomark className="w-[1.5em] h-[1.5em] fill-white -mx-[0.3125em]" />
					&nbsp; Give Isaac superpowers.
				</span>
				<p>Use our most powerful model with Isaac Pro.</p>
				<Link href="/onboarding">
					<Button variant="secondary" className="w-full mt-2.5">
						Get Isaac Pro
						<ArrowRightIcon size={16} className="ml-1.5" />
					</Button>
				</Link>
			</PopoverContent>
		</Popover>
	);
}

// function UpgradeCTA() {}
