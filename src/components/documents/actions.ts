"use server"

import type { SessionClaimsType } from "@/types"
import { auth, clerkClient } from "@clerk/nextjs/server"
import { ConvexHttpClient } from "convex/browser"

import type { Id } from "../../../convex/_generated/dataModel"
import { api } from "../../../convex/_generated/api"

const convex = new ConvexHttpClient(
	process.env.NEXT_PUBLIC_CONVEX_URL as string,
)

export async function getDocuments(ids: Id<"documents">[]) {
	return await convex.query(api.documents.getByIds, { ids })
}

export async function getUsers() {
	const { sessionClaims } = await auth()
	const organizationInfo = sessionClaims as SessionClaimsType
	const clerk = await clerkClient()

	const response = await clerk.users.getUserList({
		organizationId: [organizationInfo.o.id as string],
	})

	const users = response.data.map((user) => ({
		id: user.id,
		name:
			user.fullName ??
			user.username ??
			user.primaryEmailAddress?.emailAddress ??
			"Anonymous",
		avatar: user.imageUrl,
	}))

	return users
}
