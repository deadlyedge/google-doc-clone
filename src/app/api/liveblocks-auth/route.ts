import { auth, currentUser } from "@clerk/nextjs/server"
import { Liveblocks } from "@liveblocks/node"
import { ConvexHttpClient } from "convex/browser"
import { api } from "../../../../convex/_generated/api"

import type { SessionClaimsType } from "@/types"

const convex = new ConvexHttpClient(
	process.env.NEXT_PUBLIC_CONVEX_URL as string,
)

const liveblocks = new Liveblocks({
	secret: process.env.LIVEBLOCKS_SECRET_KEY as string,
})

export async function POST(request: Request) {
	const { sessionClaims } = await auth()

	const organizationInfo = sessionClaims as SessionClaimsType

	if (!sessionClaims) {
		return new Response("Unauthorized", { status: 401 })
	}

	// console.log("sessionClaims", sessionClaims)

	const user = await currentUser()
	if (!user) {
		return new Response("Unauthorized", { status: 401 })
	}

	const { room } = await request.json()
	const document = await convex.query(api.documents.getById, { id: room })
	if (!document) {
		return new Response("Document not found", { status: 404 })
	}

	const isOwner = document.ownerId === user.id
	const isOrganizationMember = !!(
		document.organizationId && document.organizationId === organizationInfo.o.id
	)
	// const isAdmin = organizationInfo.o.rol === "admin" // TODO: Add this check

	if (!isOwner && !isOrganizationMember) {
		return new Response("Unauthorized", { status: 401 })
	}

	const name =
		user.fullName ??
		user.username ??
		user.primaryEmailAddress?.emailAddress ??
		"Anonymous"
	const nameToNumber = name
		.split("")
		.reduce((acc, char) => acc + char.charCodeAt(0), 0)
	const hue = nameToNumber % 360
	const color = `hsl(${hue}, 80%, 40%)`

	const session = liveblocks.prepareSession(user.id, {
		userInfo: {
			name,
			avatar: user.imageUrl,
			color,
		},
	})
	session.allow(room, session.FULL_ACCESS)
	const { status, body } = await session.authorize()

	return new Response(body, { status })
}
