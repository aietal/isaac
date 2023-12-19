import EditorSettingsMenu from '@components/AppHeader/EditorSettingsMenu';
import EditorToolbar from '@components/AppHeader/EditorToolbar';

import { ToggleLeftPanel } from '@components/AppHeader/LayoutTogglerButtons';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@components/ui/popover';
import clsx from 'clsx';
import { headerHeight } from 'data/style.data';
import { FileCog } from 'lucide-react';
import dynamic from 'next/dynamic';

const HeaderCommand = dynamic(() => import('./HeaderCommand'), {
	ssr: false,
});

const AppHeader = () => {
	return (
		<div
			className={clsx(
				'w-screen inline-flex items-center justify-between border-b border-b-border max-h-10 px-1 ',
			)}
			style={{ height: headerHeight }}
		>
			<div className="inline-flex items-center z-20">
				<ToggleLeftPanel />
				<EditorToolbar />
			</div>

			<div className="hidden md:inline-flex items-center z-20">
				<EditorSettingsMenu />
			</div>
			<div className="md:hidden z-20">
				<Popover>
					<PopoverTrigger asChild>
						<FileCog strokeWidth={1} size={20} className="cursor-pointer" />
					</PopoverTrigger>
					<PopoverContent
						className="p-1 w-[160px] h-[110px]"
						sideOffset={12}
						align="end"
					>
						<EditorSettingsMenu />
					</PopoverContent>
				</Popover>
			</div>
			<div className="absolute flex justify-center w-screen z-10">
				<HeaderCommand />
			</div>
		</div>
	);
};

export default AppHeader;
