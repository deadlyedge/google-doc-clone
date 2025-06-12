"use client"

import Image from "next/image"
import { useOthers, useSelf } from "@liveblocks/react/suspense"
import { ClientSideSuspense } from "@liveblocks/react"
import { AVATAR_SIZE } from "@/constants/document"

import { Separator } from "@/components/ui/separator"

export const Avatars = () => {
	return (
		<ClientSideSuspense fallback={null}>
			<AvatarStack />
		</ClientSideSuspense>
	)
}

const AvatarStack = () => {
	const users = useOthers()
	const currentUser = useSelf()

	if (users.length === 0) return null

	return (
		<>
			<div className="flex items-center">
				{currentUser && <Avatar src={currentUser.info.avatar} name="You" />}
				<div className="flex">
					{users.map(({ connectionId, info }) => (
						<Avatar key={connectionId} src={info.avatar} name={info.name} />
					))}
				</div>
			</div>
			<Separator orientation="vertical" className="h-6" />
		</>
	)
}

type AvatarProps = {
	src: string
	name: string
}

export const Avatar = ({ src, name }: AvatarProps) => {
	return (
		<div
			style={{ width: AVATAR_SIZE, height: AVATAR_SIZE }}
			className="group -ml-2 flex shrink-0 place-content-center relative border-4 border-white rounded-full bg-gray-400">
			<div className="opacity-0 group-hover:opacity-100 absolute top-full py-1 px-2 text-white text-xs rounded-lg mt-2.5 z-10 bg-black whitespace-nowrap transition-opacity">
				{name}
			</div>
			{/* <img src={src} alt={name} className="rounded-full size-full" /> */}
			<Image
				src={src}
				alt={name}
				width={AVATAR_SIZE}
				height={AVATAR_SIZE}
				className="rounded-full size-full"
			/>
		</div>
	)
}
