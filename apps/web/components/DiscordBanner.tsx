import { Profile } from '@context/user';
import useToggleUsersField from '@hooks/api/admin/useToggleUsersField';
import { User } from '@supabase/supabase-js';
import { Icons } from 'components/landing/icons';
import { discordInviteLink } from 'data/externalLinks';
import { X } from 'lucide-react';
import { useState } from 'react';

export default function DiscordBanner({
	user,
}: {
	user: User & Partial<Profile>;
}) {
	const [isVisible, setIsVisible] = useState(true);
	const { mutateAsync: updateSeenCommunityBanner } = useToggleUsersField();

	const setBannerSeen = async () => {
		setIsVisible(false);
		await updateSeenCommunityBanner({
			profileId: user?.id,
			toUpdateField: 'has_seen_community_banner',
			bool: true,
		});
	};

	if (!isVisible) {
		return null;
	}

	return (
		<div className="flex absolute top-0 left-0 right-0 items-center gap-x-6 bg-isaac px-6 py-2.5 sm:px-3.5 sm:before:flex-1 z-[999999999]">
			<p className="text-sm leading-6 text-white flex items-center">
				<Icons.discord size={16} className="mr-3" />
				<a href={discordInviteLink} target="_blank" rel="noreferrer">
					<strong className="font-semibold">Discord</strong>
					<svg
						viewBox="0 0 2 2"
						className="mx-2 inline h-0.5 w-0.5 fill-current"
						aria-hidden="true"
					>
						<circle cx={1} cy={1} r={1} />
					</svg>
					Join our Discord community to get the latest updates and support&nbsp;
					<span aria-hidden="true">&rarr;</span>
				</a>
			</p>
			<div className="flex flex-1 justify-end">
				<button
					type="button"
					className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
					onClick={setBannerSeen}
				>
					<span className="sr-only">Dismiss</span>
					<X className="h-5 w-5 text-white" aria-hidden="true" />
				</button>
			</div>
		</div>
	);
}
