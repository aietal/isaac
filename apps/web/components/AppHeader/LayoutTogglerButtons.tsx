import { Button } from '@components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@components/ui/tooltip';

import { Panel, useUIStore } from '@context/ui.store';
import { commandKey } from '@lexical/utils/meta';
import {
	PanelLeftClose,
	PanelLeftOpen,
	PanelRightClose,
	PanelRightOpen,
} from 'lucide-react';
import React from 'react';

export const ToggleRightPanel = () => {
	const activePanel = useUIStore(s => s.activePanel);
	const openPanel = useUIStore(s => s.openPanel);
	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="relative h-8 w-8"
					onClick={() =>
						openPanel(activePanel === undefined ? Panel.CHAT : undefined)
					}
				>
					{activePanel === undefined ? (
						<PanelRightOpen strokeWidth={1.2} size={20} />
					) : (
						<PanelRightClose strokeWidth={1.2} size={20} />
					)}
				</Button>
			</TooltipTrigger>
			<TooltipContent side="right">
				<p>
					{activePanel === undefined ? 'Open Right Panel' : 'Close Right Panel'}
				</p>
			</TooltipContent>
		</Tooltip>
	);
};
export const ToggleLeftPanel = () => {
	const activeSidebar = useUIStore(s => s.activePanel);
	const openPanel = useUIStore(s => s.openPanel);

	return (
		<Tooltip>
			<TooltipTrigger asChild>
				<Button
					onClick={() =>
						openPanel(activeSidebar ? undefined : Panel.FILE_EXPLORER)
					}
					variant="ghost"
					size="icon"
					className="relative h-8 w-8"
				>
					{activeSidebar ? (
						<PanelLeftClose strokeWidth={1.2} size={20} />
					) : (
						<PanelLeftOpen strokeWidth={1.2} size={20} />
					)}
				</Button>
			</TooltipTrigger>
			<TooltipContent side="right" className="text-sm">
				{activeSidebar ? 'Close Sidebar' : 'Open Sidebar'}
				<span className="text-neutral-400 dark:text-neutral-500 ml-1.5">
					{commandKey} + Q
				</span>
			</TooltipContent>
		</Tooltip>
	);
};
