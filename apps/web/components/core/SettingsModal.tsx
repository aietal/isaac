import { Button } from '@components/ui/button';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@components/ui/dialog';
import { Label } from '@components/ui/label';
import { Switch } from '@components/ui/switch';
import { useUser } from '@context/user';
import useRevokeMendeleyToken from '@hooks/api/mendeley/useMendeleyToken.delete';
import { useGetUserIntegration } from '@hooks/api/useUserIntegration.get';
import useRevokeZoteroToken from '@hooks/api/zotero/useZoteroToken.delete';
import { getMendeleyUserAuthorizationUrl } from '@resources/integration/mendeley';
import { useDeleteUser } from '@resources/user';
import axios from 'axios';
import { Settings } from 'lucide-react';
import mixpanel from 'mixpanel-browser';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

export default function SettingsModal() {
	const { user, setUser, userIsLoading } = useUser();

	const router = useRouter();
	const email = user?.email ?? '';
	const id = user?.id ?? '';
	const [openConfirmedModal, setOpenConfirmedModal] = useState<boolean>(false);

	const { data: userIntegration } = useGetUserIntegration();
	const { mutateAsync: mutateDeleteUser } = useDeleteUser({
		onSuccessCb: () => router.push('/'),
	});

	// TODO: Fix subscription
	const loadPortal = async () => {
		const { data } = await axios.get('/api/portal');
		router.push(data.url);
	};

	const { mutateAsync: revokeMendeleyIntegration } = useRevokeMendeleyToken();
	const { mutateAsync: revokeZoteroIntegration } = useRevokeZoteroToken();

	const handleMendeleyIntegrationCheck = (check: boolean) => {
		if (!check) {
			revokeMendeleyIntegration();
		} else {
			toast.loading('Setting up Mendeley integration');
			setTimeout(() => {
				getMendeleyUserAuthorizationUrl('');
			}, 1000);
		}
	};

	const handleZoteroIntegrationCheck = async (check: boolean) => {
		if (!check) {
			revokeZoteroIntegration();
		} else {
			const userId = user?.id;
			window.location.href = `/api/auth/zotero?userId=${userId}`;
		}
	};

	return (
		<>
			<DialogContent className="sm:max-w-[725px]">
				<DialogHeader>
					<DialogTitle>
						<div className="flex items-center gap-2 mb-2">
							{' '}
							<Settings
								className="text-muted-foreground"
								strokeWidth={1.4}
								size={18}
							/>
							<span className="text-muted-foreground">Settings</span>
						</div>{' '}
					</DialogTitle>
				</DialogHeader>

				<div
					style={{
						padding: '15px',
						width: '70%',
						position: 'relative',
					}}
				>
					<div>
						<p>Account</p>
					</div>

					<div style={{ marginTop: '30px' }}>
						<p className=" text-sm font-semibold mt-5 text-neutral-500">
							Email
						</p>
						{!userIsLoading && (
							<span className="text-sm text-muted-foreground"> {email}</span>
						)}

						<p className="mt-2 text-sm font-semibold text-neutral-500">
							Sign up date
						</p>
						{!userIsLoading && (
							<span className="text-sm text-muted-foreground">
								{' '}
								{new Date(user?.created_at).toLocaleDateString()}
							</span>
						)}
					</div>
					<div className="mt-8">
						<p>Your Subscription</p>
						<div>
							{!userIsLoading && (
								<>
									<Button
										onClick={loadPortal}
										className="mt-4"
										type="button"
										variant="outline"
									>
										Open subscription portal
									</Button>
								</>
							)}
						</div>
					</div>
					<div className="mt-8">
						<p
							style={{
								fontSize: '16px',
							}}
						>
							Third Party Integrations
						</p>
						<div className="flex mt-4">
							<div className="flex items-center space-x-2">
								<Switch
									checked={!!userIntegration?.mendeley}
									onCheckedChange={handleMendeleyIntegrationCheck}
									id="airplane-mode"
								/>
								<Label htmlFor="airplane-mode">Mendeley</Label>
							</div>
						</div>
						<div className="flex mt-4">
							<div className="flex items-center space-x-2">
								<Switch
									checked={!!userIntegration?.zotero}
									onCheckedChange={handleZoteroIntegrationCheck}
									id="airplane-mode"
								/>
								<Label htmlFor="airplane-mode">Zotero</Label>
							</div>
						</div>
					</div>
				</div>
			</DialogContent>

			<Dialog open={openConfirmedModal} onOpenChange={setOpenConfirmedModal}>
				<DialogContent>
					<p className="text-neutral-500">
						Are you sure you want to delete your account
					</p>
					<div
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							marginTop: '20px',
						}}
					>
						<Button variant="destructive" onClick={() => mutateDeleteUser(id)}>
							Confirm
						</Button>
						<Button
							variant="outline"
							color="green"
							className="button"
							onClick={() => setOpenConfirmedModal(false)}
						>
							Cancel
						</Button>
					</div>
				</DialogContent>
			</Dialog>
		</>
	);
	mixpanel.track('Opened Settings');
}
