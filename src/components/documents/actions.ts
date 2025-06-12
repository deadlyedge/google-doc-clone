"use server"

import type { SessionClaimsType } from "@/types"
import { auth, clerkClient } from "@clerk/nextjs/server"

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
