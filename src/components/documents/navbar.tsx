"use client"

import { OrganizationSwitcher, UserButton } from "@clerk/nextjs"
import { useMutation } from "convex/react"
import { useRouter } from "next/navigation"

import {
	BoldIcon,
	FileJsonIcon,
	FilePenIcon,
	FilePlusIcon,
	FileTextIcon,
	GlobeIcon,
	ItalicIcon,
	PrinterIcon,
	Redo2Icon,
	RemoveFormattingIcon,
	SaveIcon,
	StrikethroughIcon,
	TextIcon,
	TrashIcon,
	UnderlineIcon,
	Undo2Icon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { BsFilePdf } from "react-icons/bs"

import {
	Menubar,
	MenubarContent,
	MenubarItem,
	MenubarMenu,
	MenubarSeparator,
	MenubarShortcut,
	MenubarSub,
	MenubarSubContent,
	MenubarSubTrigger,
	MenubarTrigger,
} from "@/components/ui/menubar"

import { useEditorStore } from "@/store/use-editor-store"

import { DocumentInput } from "./document-input"
import { Avatars } from "./avatars"
import { Inbox } from "./inbox"
import { RenameDialog } from "../rename-dialog"
import { RemoveDialog } from "../remove-dialog"

import type { Doc } from "../../../convex/_generated/dataModel"
import { api } from "../../../convex/_generated/api"
import { toast } from "sonner"

type NavbarProps = {
	data: Doc<"documents">
}

export const Navbar = ({ data }: NavbarProps) => {
	const router = useRouter()
	const { editor } = useEditorStore()

	const createDocument = useMutation(api.documents.create)

	const handleNewDocument = () => {
		createDocument({
			title: "Untitled Document",
			initialContent: "",
		})
			.catch((error) => {
				toast.error(`Failed to create document: ${error}`)
			})
			.then((newDocument) => {
				toast.success("Document created successfully")
				router.push(`/documents/${newDocument}`)
			})
	}

	const insertTable = ({ rows, cols }: { rows: number; cols: number }) => {
		editor
			?.chain()
			.focus()
			.insertTable({ rows, cols, withHeaderRow: false })
			.run()
	}

	const handleDownload = (blob: Blob, filename: string) => {
		const url = URL.createObjectURL(blob)
		const a = document.createElement("a")
		a.href = url
		a.download = filename
		a.click()
	}

	const handleSaveAsJson = () => {
		if (!editor) return
		const json = editor.getJSON()
		const blob = new Blob([JSON.stringify(json, null, 2)], {
			type: "application/json",
		})
		handleDownload(blob, `${data.title}.json`)
	}

	const handleSaveAsHtml = () => {
		if (!editor) return
		const html = editor.getHTML()
		const blob = new Blob([html], { type: "text/html" })
		handleDownload(blob, `${data.title}.html`)
	}
	const handleSaveAsText = () => {
		if (!editor) return
		const text = editor.getText()
		const blob = new Blob([text], { type: "text/plain" })
		handleDownload(blob, `${data.title}.txt`)
	}
	return (
		<nav className="flex items-center justify-between">
			<div className="flex gap-2 items-center">
				<Link href="/">
					<Image src="/logo.svg" alt="Logo" width={100} height={50} />
				</Link>
				<div className="flex flex-col">
					<DocumentInput title={data.title} id={data._id} />

					{/* MenuBar */}
					<div className="flex">
						<Menubar className="border-none bg-transparent shadow-none h-auto p-0 hover:bg-muted">
							<MenubarMenu>
								<MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-amber-300 h-auto">
									File
								</MenubarTrigger>
								<MenubarContent className="print:hidden">
									<MenubarSub>
										<MenubarSubTrigger>
											<SaveIcon className="size-4 mr-4" />
											Save
										</MenubarSubTrigger>
										<MenubarSubContent>
											<MenubarItem onClick={handleSaveAsJson}>
												<FileJsonIcon className="size-4 mr-2" />
												as JSON
											</MenubarItem>
											<MenubarItem onClick={handleSaveAsHtml}>
												<GlobeIcon className="size-4 mr-2" />
												as HTML
											</MenubarItem>
											<MenubarItem onClick={() => window.print()}>
												<BsFilePdf className="size-4 mr-2" />
												as PDF
											</MenubarItem>
											<MenubarItem onClick={handleSaveAsText}>
												<FileTextIcon className="size-4 mr-2" />
												as Text
											</MenubarItem>
										</MenubarSubContent>
									</MenubarSub>
									<MenubarItem onClick={handleNewDocument}>
										<FilePlusIcon className="size-4 mr-2" />
										New Document
									</MenubarItem>

									<MenubarSeparator />

									<RenameDialog documentId={data._id} initialTitle={data.title}>
										<MenubarItem
											onClick={(e) => e.stopPropagation()}
											onSelect={(e) => e.preventDefault()}>
											<FilePenIcon className="size-4 mr-2" />
											Rename
										</MenubarItem>
									</RenameDialog>

									<RemoveDialog documentId={data._id}>
										<MenubarItem
											onClick={(e) => e.stopPropagation()}
											onSelect={(e) => e.preventDefault()}>
											<TrashIcon className="size-4 mr-2" />
											Remove
										</MenubarItem>
									</RemoveDialog>

									<MenubarSeparator />
									<MenubarItem onClick={() => window.print()}>
										<PrinterIcon className="size-4 mr-2" />
										Print <MenubarShortcut>⌘P</MenubarShortcut>
									</MenubarItem>
								</MenubarContent>
							</MenubarMenu>
							<MenubarMenu>
								<MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-amber-300 h-auto">
									Edit
								</MenubarTrigger>
								<MenubarContent>
									<MenubarItem
										onClick={() => editor?.chain().focus().undo().run()}
										disabled={!editor?.can().undo()}>
										<Undo2Icon className="size-4 mr-2" />
										Undo <MenubarShortcut>⌘Z</MenubarShortcut>
									</MenubarItem>
									<MenubarItem
										onClick={() => editor?.chain().focus().redo().run()}
										disabled={!editor?.can().redo()}>
										<Redo2Icon className="size-4 mr-2" />
										Redo <MenubarShortcut>⌘⇧Z or ⌘Y</MenubarShortcut>
									</MenubarItem>
								</MenubarContent>
							</MenubarMenu>
							<MenubarMenu>
								<MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-amber-300 h-auto">
									Insert
								</MenubarTrigger>
								<MenubarContent>
									<MenubarSub>
										<MenubarSubTrigger>Table</MenubarSubTrigger>
										<MenubarSubContent>
											<MenubarItem
												onClick={() => insertTable({ rows: 1, cols: 1 })}>
												1 x 1
											</MenubarItem>
											<MenubarItem
												onClick={() => insertTable({ rows: 2, cols: 2 })}>
												2 x 2
											</MenubarItem>
											<MenubarItem
												onClick={() => insertTable({ rows: 3, cols: 3 })}>
												3 x 3
											</MenubarItem>
											<MenubarItem
												onClick={() => insertTable({ rows: 4, cols: 4 })}>
												4 x 4
											</MenubarItem>
										</MenubarSubContent>
									</MenubarSub>
								</MenubarContent>
							</MenubarMenu>
							<MenubarMenu>
								<MenubarTrigger className="text-sm font-normal py-0.5 px-[7px] rounded-sm hover:bg-amber-300 h-auto">
									Format
								</MenubarTrigger>
								<MenubarContent>
									<MenubarSub>
										<MenubarSubTrigger>
											<TextIcon className="size-4 mr-2" />
											Text
										</MenubarSubTrigger>
										<MenubarSubContent>
											<MenubarItem
												onClick={() =>
													editor?.chain().focus().toggleBold().run()
												}>
												<BoldIcon className="size-4 mr-2" />
												Bold
												<MenubarShortcut>
													⌘<code className="text-base">B</code>
												</MenubarShortcut>
											</MenubarItem>
											<MenubarItem
												onClick={() =>
													editor?.chain().focus().toggleItalic().run()
												}>
												<ItalicIcon className="size-4 mr-2" />
												Italic
												<MenubarShortcut>
													⌘<code className="text-base">I</code>
												</MenubarShortcut>
											</MenubarItem>
											<MenubarItem
												onClick={() =>
													editor?.chain().focus().toggleUnderline().run()
												}>
												<UnderlineIcon className="size-4 mr-2" />
												Underline
												<MenubarShortcut>
													⌘<code className="text-base">U</code>
												</MenubarShortcut>
											</MenubarItem>
											<MenubarItem
												onClick={() =>
													editor?.chain().focus().toggleStrike().run()
												}>
												<StrikethroughIcon className="size-4 mr-2" />
												Strikethrough
												<MenubarShortcut>
													⌘<code className="text-base">S</code>
												</MenubarShortcut>
											</MenubarItem>
										</MenubarSubContent>
									</MenubarSub>
									<MenubarItem
										onClick={() =>
											editor?.chain().focus().clearNodes().unsetAllMarks().run()
										}>
										<RemoveFormattingIcon className="size-4" />
										Clear formatting<MenubarShortcut>⌘\</MenubarShortcut>
									</MenubarItem>
								</MenubarContent>
							</MenubarMenu>
						</Menubar>
					</div>
				</div>
			</div>
			<div className="flex gap-3 items-center pl-6">
				<Avatars />
				<Inbox />
				<OrganizationSwitcher
					afterCreateOrganizationUrl="/"
					afterSelectOrganizationUrl="/"
					afterLeaveOrganizationUrl="/"
					afterSelectPersonalUrl="/"
				/>
				<UserButton />
			</div>
		</nav>
	)
}
