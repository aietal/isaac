import { Button } from '@components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@components/ui/tooltip';
import { useUIStore } from '@context/ui.store';
import { commandKey } from '@lexical/utils/meta';
import clsx from 'clsx';
import { hotKeys } from 'data/shortcuts';
import { headerHeight, topFabOffset } from 'data/style.data';
import { PanelLeftOpen } from 'lucide-react';
import React from 'react';

const TopLeftFab = () => {
	const toggleSideBar = useUIStore(s => s.toggleSideBar);

	return (
		<div
			className={clsx(
				'fixed  left-0 px-3 py-1.5  flex z-30 space-x-2 bg-transparent',
			)}
			style={{ top: topFabOffset }}
		>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						className="rounded-md relative h-7 w-7"
						variant="outline"
						size="icon"
						onClick={toggleSideBar}
					>
						<PanelLeftOpen strokeWidth={1.6} size={20} />
					</Button>
				</TooltipTrigger>
				<TooltipContent side="right">
					<p>
						Open Sidebar |{' '}
						<strong>
							{commandKey} + {hotKeys.toggleSidebar.key}
						</strong>
					</p>
				</TooltipContent>
			</Tooltip>
		</div>
	);
};

export default TopLeftFab;
