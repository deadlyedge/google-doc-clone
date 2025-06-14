"use client"

import { ClientSideSuspense } from "@liveblocks/react"
import { useInboxNotifications } from "@liveblocks/react/suspense"
import { InboxNotification, InboxNotificationList } from "@liveblocks/react-ui"

import { BellIcon } from "lucide-react"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Separator } from "../ui/separator"

export const Inbox = () => {
	return (
		<ClientSideSuspense
			fallback={
				<>
					<Button variant="ghost" size="icon" className="relative" disabled>
						<BellIcon className="size-5" />
					</Button>
					<Separator orientation="vertical" className="h-6" />
				</>
			}>
			<InboxMenu />
		</ClientSideSuspense>
	)
}

const InboxMenu = () => {
	const { inboxNotifications } = useInboxNotifications()
	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="ghost" size="icon" className="relative">
						<BellIcon className="size-5" />
						{inboxNotifications.length > 0 && (
							<span className="absolute size-4 -top-1 -right-1 rounded-full bg-blue-500 text-xs text-white flex items-center justify-center">
								{inboxNotifications.length}
							</span>
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end" className="w-auto">
					{inboxNotifications.length > 0 ? (
						<InboxNotificationList>
							{inboxNotifications.map((inboxNotification) => (
								<InboxNotification
									key={inboxNotification.id}
									inboxNotification={inboxNotification}
								/>
							))}
						</InboxNotificationList>
					) : (
						<div className="p-2 w-[400px] text-center text-sm text-muted-foreground">
							No notifications
						</div>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
			<Separator orientation="vertical" className="h-6" />
		</>
	)
}
