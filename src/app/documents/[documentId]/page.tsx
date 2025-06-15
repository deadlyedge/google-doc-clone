import { auth } from "@clerk/nextjs/server"
import { preloadQuery } from "convex/nextjs"

import { Document } from "@/components/documents/document"
import { api } from "../../../../convex/_generated/api"
import type { Id } from "../../../../convex/_generated/dataModel"

type PageProps = {
	params: Promise<{ documentId: Id<"documents"> }>
}

export default async function Page({ params }: PageProps) {
	const { documentId } = await params

	const { getToken } = await auth()
	const token = (await getToken({ template: "convex" })) ?? undefined

	if (!token) throw new Error("Unauthorized")

	const preloadedDocument = await preloadQuery(
		api.documents.getById,
		{ id: documentId },
		{ token },
	)

	if (!preloadedDocument) throw new Error("Document not found")

	return <Document preloadedDocument={preloadedDocument} />
}
