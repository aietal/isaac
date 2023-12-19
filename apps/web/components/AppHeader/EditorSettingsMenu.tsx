import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarLabel,
	MenubarMenu,
	MenubarSeparator,
	MenubarShortcut,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from '@components/ui/menubar';
import { useUIStore } from '@context/ui.store';

import useCitationStyle from '@hooks/api/isaac/useCitationStyle';
import { commandKey } from '@lexical/utils/meta';
import { citationStyleList } from 'data/citationStyles';
import { languages } from 'data/languages';
import { hotKeys } from 'data/shortcuts';
import {
	Bell,
	CircleDot,
	Heart,
	HelpCircle,
	MessageSquare,
	Twitter,
} from 'lucide-react';
import { useIntercom } from 'react-use-intercom';

import { useUser } from '@context/user';

import AIModelMenu from '@components/core/AIModelToggle';
import { Icons } from '@components/landing/icons';
import { useBreakpoint } from '@hooks/misc/useBreakPoint';
import { useUpdateEditorLanguage } from '@resources/user';
import { appHeaderMenuTitle } from '@styles/className';
import { discordInviteLink, twitterLink } from 'data/externalLinks';
import mixpanel from 'mixpanel-browser';
import { useRouter } from 'next/router';
import { memo, useCallback, useEffect, useState } from 'react';

const EditorSettingsMenu = memo(() => {
	return (
		<Menubar className="flex flex-col md:flex-row gap-1">
			<AIModelMenu />
			<SettingsMenu />
			<HelpMenu />
		</Menubar>
	);
});

const SettingsMenu = memo(() => {
	const showDocumentComments = useUIStore(s => s.showDocumentComments);
	const toggleDocumentComment = useUIStore(s => s.toggleDocumentComment);
	const setCustomInstructionsModalOpen = useUIStore(
		s => s.setCustomInstructionsModalOpen,
	);
	const { isAboveMd, isBelowMd } = useBreakpoint('md');

	const { citationStyle, setCitationStyle } = useCitationStyle();
	const { user } = useUser();

	const { mutateAsync: updateEditorLanguage } = useUpdateEditorLanguage();

	const handleCitationChange = useCallback(
		item => {
			setCitationStyle(item);
		},
		[setCitationStyle],
	);

	const [isDarkMode, setIsDarkMode] = useState(() => {
		const htmlElem = document.querySelector('html');
		return htmlElem?.classList.contains('dark') ?? false;
	});

	const handleToggleTheme = useCallback(() => {
		const htmlElem = document.querySelector('html');
		if (htmlElem) {
			if (htmlElem.classList.contains('dark')) {
				htmlElem.classList.remove('dark');
				setIsDarkMode(false);
			} else {
				htmlElem.classList.add('dark');
				setIsDarkMode(true);
			}
		}
	}, []);

	const handleToggleComments = useCallback(() => {
		toggleDocumentComment();
	}, [toggleDocumentComment]);

	return (
		<MenubarMenu>
			<MenubarTrigger className={appHeaderMenuTitle}>
				<span className="mx-auto">Settings</span>
			</MenubarTrigger>
			<MenubarContent
				side={isBelowMd ? 'left' : 'bottom'}
				align={isBelowMd ? 'start' : 'center'}
			>
				<MenubarItem onClick={() => setCustomInstructionsModalOpen(true)}>
					Custom Instructions
				</MenubarItem>

				<MenubarSub>
					<MenubarSubTrigger>
						Editor language (
						{[...languages].find(l => l.value === user?.editor_language)?.image}
						)
					</MenubarSubTrigger>
					<MenubarSubContent>
						{languages.map(item => (
							<MenubarItem
								onClick={() => {
									updateEditorLanguage({
										userId: user?.id,
										editorLanguage: item.value,
									});
								}}
								key={item.value}
							>
								<span className="mr-2 h-4 w-4">{item.image}</span>
								<span>{item.label}</span>{' '}
							</MenubarItem>
						))}
					</MenubarSubContent>
				</MenubarSub>
				<MenubarSeparator />
				<MenubarSub>
					<MenubarSubTrigger>
						Citation style ({citationStyle})
					</MenubarSubTrigger>
					<MenubarSubContent>
						{citationStyleList.map(item => (
							<MenubarItem
								onClick={() => {
									handleCitationChange(item);
								}}
								key={item}
							>
								{item}
							</MenubarItem>
						))}
					</MenubarSubContent>
				</MenubarSub>
				<MenubarSeparator />
				<MenubarItem
					onClick={e => {
						e.preventDefault();
						handleToggleTheme();
					}}
				>
					<span>{isDarkMode ? 'Light mode' : 'Dark mode'}</span>
					<MenubarShortcut>
						{commandKey}
						{hotKeys.toggleTheme.key.toUpperCase()}
					</MenubarShortcut>
				</MenubarItem>
				<MenubarItem
					onClick={e => {
						e.preventDefault();
						handleToggleComments();
					}}
				>
					{`${showDocumentComments ? 'Hide' : 'Show'} comments`}
					<MenubarShortcut>
						{commandKey}
						{hotKeys.toggleComment.key.toUpperCase()}
					</MenubarShortcut>
				</MenubarItem>
			</MenubarContent>
		</MenubarMenu>
	);
});

const HelpMenu = memo(() => {
	const setProductGuideModalOpen = useUIStore(s => s.setProductGuideModalOpen);
	const setFeedbackModalOpen = useUIStore(s => s.setFeedbackModalOpen);
	const showChangelogUpdate = useUIStore(s => s.showChangelogUpdate);
	const setShowChangelogUpdate = useUIStore(s => s.setShowChangelogUpdate);
	const { isAboveMd, isBelowMd } = useBreakpoint('md');

	const { boot, show } = useIntercom();
	const { user } = useUser();
	const { push } = useRouter();

	function openIntercom() {
		boot({
			verticalPadding: 50,
			email: user?.email,
			createdAt: user?.created_at,
			userId: user?.id,
			alignment: 'right',
			horizontalPadding: -200,
			hideDefaultLauncher: true,
		});
		show();
		mixpanel.track('Intercom Opened');
	}

	useEffect(() => {
		setShowChangelogUpdate(
			user ? user?.has_seen_latest_update === false : false,
		);
	}, [user]);

	return (
		<MenubarMenu>
			<MenubarTrigger className={appHeaderMenuTitle}>
				<span className="mx-auto">Help</span>
				{showChangelogUpdate && (
					<CircleDot size={16} className="ml-2 text-isaac" />
				)}
			</MenubarTrigger>
			<MenubarContent
				side={isBelowMd ? 'left' : 'bottom'}
				align={isBelowMd ? 'start' : 'center'}
			>
				<MenubarLabel>Need help?</MenubarLabel>
				<MenubarItem onClick={() => setFeedbackModalOpen(true)}>
					<Heart size={16} className="mr-3" />
					Give feedback
				</MenubarItem>
				{user?.is_subscribed && (
					<MenubarItem onClick={openIntercom}>
						<MessageSquare size={16} className="mr-3" />
						Support
					</MenubarItem>
				)}
				<MenubarItem
					onClick={() =>
						window.open('https://isaac.productlane.com/changelog', '_blank')
					}
				>
					<Bell size={16} className="mr-3" />
					<span>Updates</span>
					{showChangelogUpdate && (
						<CircleDot size={16} className="ml-2 text-isaac" />
					)}
				</MenubarItem>

				<MenubarItem onClick={() => setProductGuideModalOpen(true)}>
					<HelpCircle size={16} className="mr-3" />
					Product guide
				</MenubarItem>
				<MenubarItem>
					<a
						href={discordInviteLink}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center"
					>
						<Icons.discord size={16} className="mr-3" />
						Join our community
					</a>
				</MenubarItem>
				<MenubarItem>
					<a
						href={twitterLink}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-flex items-center"
					>
						<Twitter size={16} className="mr-3" />
						Follow us
					</a>
				</MenubarItem>
			</MenubarContent>
		</MenubarMenu>
	);
});

export default EditorSettingsMenu;
