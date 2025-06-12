"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { toast } from "sonner"
import {
	ClientSideSuspense,
	LiveblocksProvider,
	RoomProvider,
} from "@liveblocks/react/suspense"

import { FullscreenLoader } from "../fullscreen-loader"
import { getUsers } from "./actions"

type User = {
	id: string
	name: string
	avatar: string
}

export function Room({ children }: { children: React.ReactNode }) {
	const params = useParams()
	const roomId = params.documentId as string

	const [users, setUsers] = useState<User[]>([])

	const fetchUsers = useMemo(
		() => async () => {
			try {
				const list = await getUsers()
				setUsers(list)
			} catch {
				toast.error("Failed to fetch users")
			}
		},
		[],
	)

	useEffect(() => {
		fetchUsers()
	}, [fetchUsers])

	return (
		<LiveblocksProvider
			authEndpoint="/api/liveblocks-auth"
			throttle={16}
			resolveUsers={({ userIds }) => {
				return userIds.map(
					(userId) => users.find((user) => user.id === userId) ?? undefined,
				)
			}}
			resolveMentionSuggestions={({ text }) => {
				let filteredUsers = users
				if (text) {
					filteredUsers = users.filter((user) =>
						user.name.toLowerCase().includes(text.toLowerCase()),
					)
				}
				return filteredUsers.map((user) => user.id)
			}}
			resolveRoomsInfo={() => []}>
			<RoomProvider id={roomId}>
				<ClientSideSuspense
					fallback={<FullscreenLoader label="Room loading..." />}>
					{children}
				</ClientSideSuspense>
			</RoomProvider>
		</LiveblocksProvider>
	)
}
