"use client"

import { ClerkProvider, SignIn, useAuth } from "@clerk/nextjs"
import { ConvexProviderWithClerk } from "convex/react-clerk"

import {
	AuthLoading,
	Authenticated,
	ConvexReactClient,
	Unauthenticated,
} from "convex/react"
import { FullscreenLoader } from "./fullscreen-loader"

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
	throw new Error("Missing NEXT_PUBLIC_CONVEX_URL in your .env file")
}

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL)

export default function ConvexClientProvider({
	children,
}: { children: React.ReactNode }) {
	return (
		<ClerkProvider>
			<ConvexProviderWithClerk client={convex} useAuth={useAuth}>
				<Authenticated>{children}</Authenticated>
				<Unauthenticated>
					<div className="flex min-h-screen items-center justify-center">
						<SignIn routing="hash" />
					</div>
				</Unauthenticated>
				<AuthLoading>
					<FullscreenLoader label="Auth Loading..." />
				</AuthLoading>
			</ConvexProviderWithClerk>
		</ClerkProvider>
	)
}
