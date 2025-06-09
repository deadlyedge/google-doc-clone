import type { Metadata } from "next"
import { Noto_Serif } from "next/font/google"
import "./globals.css"

const notoSerif = Noto_Serif({
	subsets: ["latin"],
	variable: "--font-noto-serif",
	weight: ["300", "500", "700"],
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
			<body className={`${notoSerif.className} antialiased`}>{children}</body>
		</html>
	)
}
