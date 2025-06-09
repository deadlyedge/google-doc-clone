import { Editor } from "@/components/documents/editor"
import { Toolbar } from "@/components/documents/toolbar"

type PageProps = {
	params: Promise<{ documentId: string }>
}

export default async function Page({ params }: PageProps) {
	const { documentId } = await params
  
	return (
		<div className="min-h-screen bg-[#fafbfd]">
			<Toolbar />
			<Editor />
		</div>
	)
}
