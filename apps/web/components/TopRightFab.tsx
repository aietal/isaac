import { Logomark } from '@components/landing/Logo';
import { Button } from '@components/ui/button';
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from '@components/ui/tooltip';
import { Panel, useUIStore } from '@context/ui.store';
import useGetEditorRouter from '@hooks/useGetEditorRouter';
import { commandKey } from '@lexical/utils/meta';
import clsx from 'clsx';
import { hotKeys } from 'data/shortcuts';
import { topFabOffset } from 'data/style.data';
import { motion } from 'framer-motion';
import { capitalize, startCase } from 'lodash';
import {
	Library,
	MessageSquare,
	PanelRightClose,
	PanelRightOpen,
	StickyNote,
} from 'lucide-react';
import React, { ReactNode } from 'react';

const TopRightFab = () => {
	const { projectId } = useGetEditorRouter();
	const activePanel = useUIStore(s => s.activePanel);
	const openPanel = useUIStore(s => s.openPanel);

	return (
		<>
			{projectId && (
				<motion.div>
					{/* <div className="flex px-4 py-2  justify-end fixed top-0 right-0 z-50 gap-1 min-h-[calc(2.7rem-1px)]  ">
						{activePanel === undefined ? (
							<>
								<TabButton panel={Panel.CHAT} />
								<TabButton panel={Panel.REFERENCES} />
								<TabButton panel={Panel.NOTES} />
							</>
						) : (
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										className="rounded-md relative h-7 w-7"
										variant="outline"
										size="icon"
										onClick={() =>
											openPanel(
												activePanel === undefined ? Panel.CHAT : undefined,
											)
										}
									>
										{activePanel === undefined ? (
											<PanelRightOpen strokeWidth={1.6} size={20} />
										) : (
											<PanelRightClose strokeWidth={1.6} size={20} />
										)}
									</Button>
								</TooltipTrigger>
								<TooltipContent side="right">
									<p>
										{activePanel === undefined
											? 'Open Right Panel'
											: 'Close Right Panel'}
									</p>
								</TooltipContent>
							</Tooltip>
						)}
					</div> */}
					<div
						className="flex px-4 py-1.5  justify-end fixed right-0 z-50 gap-1 min-h-[calc(2.7rem-1px)]"
						style={{
							top: topFabOffset,
						}}
					>
						<Tooltip>
							<TooltipTrigger asChild>
								<Button
									className="rounded-md relative h-7 w-full px-2"
									variant="outline"
									size="icon"
									onClick={() =>
										openPanel(
											activePanel === undefined ? Panel.CHAT : undefined,
										)
									}
								>
									{activePanel === undefined ? (
										<PanelRightOpen strokeWidth={1.6} size={20} />
									) : (
										<PanelRightClose strokeWidth={1.6} size={20} />
									)}
								</Button>
							</TooltipTrigger>
							<TooltipContent side="right">
								<p>
									{activePanel === undefined
										? 'Open Right Panel'
										: 'Close Right Panel'}
								</p>
							</TooltipContent>
						</Tooltip>
					</div>
				</motion.div>
			)}
		</>
	);
};

export default TopRightFab;

type TabButtonProps = {
	panel: Panel;
};

const TabButton = ({ panel }: TabButtonProps) => {
	const openPanel = useUIStore(s => s.openPanel);
	const activePanel = useUIStore(s => s.activePanel);
	let icon: ReactNode;
	let shortcutKey: string;

	switch (panel) {
		case Panel.CHAT:
			icon = (
				<MessageSquare
					className={clsx(
						'w-4 h-4 mr-1',
						activePanel === Panel.CHAT
							? 'text-primary'
							: 'text-muted-foreground',
					)}
				/>
			);
			shortcutKey = hotKeys.isaacPanel.key;
			break;
		case Panel.REFERENCES:
			icon = (
				<Library
					className={clsx(
						'w-4 h-4 mr-1',
						activePanel === Panel.REFERENCES
							? 'text-primary'
							: 'text-muted-foreground',
					)}
				/>
			);
			shortcutKey = hotKeys.referencePanel.key;

			break;
		case Panel.NOTES:
			icon = (
				<StickyNote
					className={clsx(
						'w-4 h-4 mr-1',
						activePanel === Panel.NOTES
							? 'text-primary'
							: 'text-muted-foreground',
					)}
				/>
			);
			shortcutKey = hotKeys.notePanel.key;

			break;
		default:
			icon = null;
	}

	return (
		<Tooltip delayDuration={300}>
			<TooltipTrigger asChild>
				<Button
					size="sm"
					variant="outline"
					className={clsx(
						'font-semibold flex items-center py-1 h-8 px-2.5',
						activePanel === panel && 'bg-neutral-200 dark:bg-neutral-800',
					)}
					onClick={() => openPanel(activePanel !== panel ? panel : undefined)}
				>
					{icon} {startCase(capitalize(panel))}
				</Button>
			</TooltipTrigger>
			<TooltipContent side="bottom">
				<p>
					{startCase(capitalize(panel))} |{' '}
					<strong>
						{commandKey} + {shortcutKey}
					</strong>
				</p>
			</TooltipContent>
		</Tooltip>
	);
};
