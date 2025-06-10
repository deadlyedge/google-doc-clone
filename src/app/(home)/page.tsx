"use client"

import { useQuery } from "convex/react"

import { Navbar } from "@/components/home/navbar"
import { TemplatesGallery } from "@/components/home/templates-gallery"

import { api } from "../../../convex/_generated/api"

export default function Home() {
	const documents = useQuery(api.documents.get)
	return (
		<div className="flex flex-col min-h-screen">
			<div className="sticky top-0 z-10 left-0 right-0 h-16 bg-white p-4">
				<Navbar />
			</div>
			<div>
				<TemplatesGallery />
				{documents?.map((document) => (
					<div key={document._id}>{document.title}</div>
				))}
			</div>
		</div>
	)
}
