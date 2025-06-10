import type { Metadata } from "next"
import { Noto_Serif } from "next/font/google"
import { NuqsAdapter } from "nuqs/adapters/next/app"
import "./globals.css"
import { ConvexClientProvider } from "@/components/convex-client-provider"

const notoSerif = Noto_Serif({
	subsets: ["latin"],
	variable: "--font-noto-serif",
	weight: ["200", "500", "800"],
})

export const metadata: Metadata = {
	title: "GoogleDocs Clone",
	description: "Some web document editor",
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body className={`${notoSerif.className} antialiased`}>
				<NuqsAdapter>
					<ConvexClientProvider>{children}</ConvexClientProvider>
				</NuqsAdapter>
			</body>
		</html>
	)
}
