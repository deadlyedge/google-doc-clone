"use client"

import { Editor } from "@/components/documents/editor"
import { Navbar } from "@/components/documents/navbar"
import { Room } from "@/components/documents/room"
import { Toolbar } from "@/components/documents/toolbar"
import { usePreloadedQuery, type Preloaded } from "convex/react"
import type { api } from "../../../convex/_generated/api"

type DocumentProps = {
	preloadedDocument: Preloaded<typeof api.documents.getById>
}

export const Document = ({ preloadedDocument }: DocumentProps) => {
	const document = usePreloadedQuery(preloadedDocument)

	return (
		<Room>
			<div className="min-h-screen bg-[#fafbfd]">
				{/* xdream use sticky */}
				<div className="flex flex-col px-4 pt-2 gap-y-2 sticky top-0 left-0 right-0 z-10 bg-[#fafbfd] print:hidden">
					<Navbar data={document} />
					<Toolbar />
				</div>
				<Editor initialContent={document.initialContent} />
			</div>
		</Room>
	)
}
