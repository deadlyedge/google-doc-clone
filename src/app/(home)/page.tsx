"use client"

import { usePaginatedQuery } from "convex/react"
import { useSearchParam } from "@/hooks/use-search-param"

import { Navbar } from "@/components/home/navbar"
import { TemplatesGallery } from "@/components/home/templates-gallery"

import { api } from "../../../convex/_generated/api"
import { DocumentsTable } from "@/components/home/documents-table"

export default function Home() {
	const [filter] = useSearchParam("filter")
	const { results, status, loadMore } = usePaginatedQuery(
		api.documents.get,
		{ filter },
		{ initialNumItems: 5 },
	)
	return (
		<div className="flex flex-col min-h-screen">
			<div className="sticky top-0 z-10 left-0 right-0 h-16 bg-white p-4">
				<Navbar />
			</div>
			<div>
				<TemplatesGallery />
				<DocumentsTable
					documents={results}
					loadMore={loadMore}
					status={status}
				/>
			</div>
		</div>
	)
}
