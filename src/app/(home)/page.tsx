import { Navbar } from "@/components/home/navbar"
import { TemplatesGallery } from "@/components/home/templates-gallery"

export default function Home() {
	return (
		<div className="flex flex-col min-h-screen">
			<div className="sticky top-0 z-10 left-0 right-0 h-16 bg-white p-4">
				<Navbar />
			</div>
			<div>
				<TemplatesGallery />
			</div>
		</div>
	)
}
