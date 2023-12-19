import AIOutputLogPanel from '@components/AIOutputLogPanel';
import ChatSessions from '@components/chat';
import IsaacSettingsSection from '@components/IsaacSettings/IsaacSettingsSection';
import ReferenceSearchSection from '@components/literature/LiteratureSearchSection';
import ReferencesSection from '@components/literature/ReferencesSection';
import NotesSection from '@components/notes/NotesSection';
import ProjectExplorer from '@components/ProjectExplorer';
import { Panel, useUIStore } from '@context/ui.store';
import clsx from 'clsx';

export default function Sidebar() {
	const activePanel = useUIStore(s => s.activePanel);

	return (
		<>
			<div
				className={clsx(
					'flex-grow',
					activePanel !== Panel.FILE_EXPLORER &&
						'w-0 overflow-hidden flex-grow-0',
				)}
			>
				<ProjectExplorer />
			</div>
			<div
				className={clsx(
					'flex-grow',
					activePanel !== Panel.REFERENCES && 'w-0 overflow-hidden flex-grow-0',
				)}
			>
				<ReferencesSection />
			</div>
			<div
				className={clsx(
					'flex-grow',
					activePanel !== Panel.LITERATURE_SEARCH &&
						'w-0 overflow-hidden flex-grow-0',
				)}
			>
				<ReferenceSearchSection />
			</div>
			<div
				className={clsx(
					'flex-grow',
					activePanel !== Panel.NOTES && 'w-0 overflow-hidden flex-grow-0',
				)}
			>
				<NotesSection />
			</div>
			<div
				className={clsx(
					'flex-grow',
					activePanel !== Panel.CHAT_SESSIONS
						? 'w-0 overflow-hidden flex-grow-0'
						: 'w-[inherit]',
				)}
			>
				<ChatSessions />
			</div>
			<div
				className={clsx(
					'flex-grow',
					activePanel !== Panel.AI_OUTPUT_LOGS
						? 'w-0 overflow-hidden flex-grow-0'
						: 'w-[inherit]',
				)}
			>
				<AIOutputLogPanel />
			</div>
			<div
				className={clsx(
					'flex-grow',
					activePanel !== Panel.ISAAC_SETTINGS
						? 'w-0 overflow-hidden flex-grow-0'
						: 'w-[inherit]',
				)}
			>
				<IsaacSettingsSection />
			</div>
		</>
	);
}
