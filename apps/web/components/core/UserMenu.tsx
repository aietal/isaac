import { Avatar, AvatarFallback, AvatarImage } from '@components/ui/avatar';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import axios from 'axios';
import { CreditCard, LogOut } from 'lucide-react';
import { useRouter } from 'next/router';

const UserMenu = ({ email = '', logout, avatarUrl }) => {
	const router = useRouter();

	const loadPortal = async () => {
		const { data } = await axios.get('/api/portal');
		router.push(data.url);
	};

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<div className="relative flex items-center justify-start gap-2 w-text-popover-foreground w-full cursor-pointer hover:text-muted-foreground">
						<Avatar className="h-10 w-10 rounded-md">
							<AvatarImage src={avatarUrl} alt="user-pp" />
							<AvatarFallback className="rounded-md ">
								{email?.slice(0, 2).toUpperCase()}
							</AvatarFallback>
						</Avatar>
					</div>
				</DropdownMenuTrigger>
				<DropdownMenuContent
					className="w-56 mt-2"
					sideOffset={10}
					align="end"
					forceMount
					side="right"
				>
					<DropdownMenuLabel className="font-normal">
						<div className="flex flex-col space-y-1">
							<p className="text-sm font-medium leading-none">{email}</p>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuGroup>
						<DropdownMenuItem onClick={loadPortal}>
							<CreditCard className="mr-2 h-4 w-4" />
							<span>Billing</span>
							{/* <DropdownMenuShortcut>⌘B</DropdownMenuShortcut> */}
						</DropdownMenuItem>
					</DropdownMenuGroup>
					<DropdownMenuSeparator />
					<DropdownMenuItem onClick={logout}>
						<LogOut className="mr-2 h-4 w-4" />
						<span>Sign out</span>
						{/* <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut> */}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</>
	);
};

export default UserMenu;
