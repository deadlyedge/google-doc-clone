import { Editor } from "@/components/documents/editor"
import { Navbar } from "@/components/documents/navbar"
import { Room } from "@/components/documents/room"
import { Toolbar } from "@/components/documents/toolbar"

type PageProps = {
	params: Promise<{ documentId: string }>
}

export default async function Page({ params }: PageProps) {
	// const { documentId } = await params

	return (
		<Room>
			<div className="min-h-screen bg-[#fafbfd]">
				{/* xdream use sticky */}
				<div className="flex flex-col px-4 pt-2 gap-y-2 sticky top-0 left-0 right-0 z-10 bg-[#fafbfd] print:hidden">
					<Navbar />
					<Toolbar />
				</div>
				<Editor />
			</div>
		</Room>
	)
}
