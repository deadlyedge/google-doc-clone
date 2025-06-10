"use client"

import { cn } from "@/lib/utils"
import {
	type LucideIcon,
	BoldIcon,
	ItalicIcon,
	ListTodoIcon,
	MessageSquarePlusIcon,
	PrinterIcon,
	Redo2Icon,
	RemoveFormattingIcon,
	SpellCheckIcon,
	StrikethroughIcon,
	UnderlineIcon,
	Undo2Icon,
} from "lucide-react"

import { useEditorStore } from "@/store/use-editor-store"

import { Separator } from "@/components/ui/separator"

import {
	FontSizeButton,
	FontFamilyButton,
	ListButton,
	AlignButton,
	LinkButton,
	ImageButton,
	HighlightColorButton,
	TextColorButton,
	HeadingLevelButton,
	LineHeightButton,
} from "./toolbar-tools"

type ToolbarButtonProps = {
	onClick?: () => void
	isActive?: boolean
	notAvailable?: boolean
	Icon: LucideIcon
}

const ToolbarButton = ({
	onClick,
	isActive,
	notAvailable,
	Icon,
}: ToolbarButtonProps) => {
	return (
		<button
			type="button"
			onClick={onClick}
			// disabled={notAvailable}
			className={cn(
				"text-sm h-7 min-w-7 flex items-center justify-center rounded-sm hover:bg-neutral-200/80",
				isActive && "bg-neutral-200/80",
				notAvailable && "opacity-50 cursor-not-allowed",
			)}
		>
			<Icon className="size-4" />
		</button>
	)
}

type ToolbarSections = {
	label: string
	Icon: LucideIcon
	onClick: () => void
	isActive?: boolean
	notAvailable?: boolean
}[][]

export const Toolbar = () => {
	const { editor } = useEditorStore()

	const sections: ToolbarSections = [
		[
			{
				label: "Undo",
				Icon: Undo2Icon,
				onClick: () => editor?.chain().focus().undo().run(),
				notAvailable: !editor?.can().undo(),
			},
			{
				label: "Redo",
				Icon: Redo2Icon,
				onClick: () => editor?.chain().focus().redo().run(),
				notAvailable: !editor?.can().redo(),
			},
			{ label: "Print", Icon: PrinterIcon, onClick: () => window.print() },
			{
				label: "Spell Check",
				Icon: SpellCheckIcon,
				onClick: () => {
					// Toggle spellcheck attribute
					// maybe use an api for this later especially for chinese.
					const current = editor?.view.dom.getAttribute("spellcheck")
					editor?.view.dom.setAttribute(
						"spellcheck",
						current === "false" ? "true" : "false",
					)
				},
				isActive: editor?.view.dom.getAttribute("spellcheck") === "true",
			},
		],
		[
			{
				label: "Bold",
				Icon: BoldIcon,
				onClick: () => editor?.chain().focus().toggleBold().run(),
				isActive: editor?.isActive("bold"),
			},
			{
				label: "Italic",
				Icon: ItalicIcon,
				onClick: () => editor?.chain().focus().toggleItalic().run(),
				isActive: editor?.isActive("italic"),
			},
			{
				label: "Underline",
				Icon: UnderlineIcon,
				onClick: () => editor?.chain().focus().toggleUnderline().run(),
				isActive: editor?.isActive("underline"),
			},
			{
				label: "Strikethrough",
				Icon: StrikethroughIcon,
				onClick: () => editor?.chain().focus().toggleStrike().run(),
				isActive: editor?.isActive("strike"),
			},
		],
		[
			{
				label: "List Todo",
				Icon: ListTodoIcon,
				onClick: () => editor?.chain().focus().toggleTaskList().run(),
				isActive: editor?.isActive("taskList"),
			},
			{
				label: "Comment",
				Icon: MessageSquarePlusIcon,
				onClick: () => {
					// todo: add comment
				},
				isActive: false,
			},
			{
				label: "Remove Formatting",
				Icon: RemoveFormattingIcon,
				onClick: () =>
					editor?.chain().focus().clearNodes().unsetAllMarks().run(),
			},
		],
	]

	return (
		<div className="bg-[#f1f4f9] px-2.5 py-0.5 rounded-[24px] flex items-center gap-x-0.5 min-h-[40px] overflow-x-auto">
			{sections[0].map((section) => (
				<ToolbarButton key={section.label} {...section} />
			))}
			<Separator orientation="vertical" className="bg-neutral-300 h-6" />
			{/* todo: font family, font size, font color, highlight color */}
			<FontFamilyButton />
			<HeadingLevelButton />
			<AlignButton />
			<LineHeightButton />
			<Separator orientation="vertical" className="bg-neutral-300 h-6" />
			<FontSizeButton />
			<Separator orientation="vertical" className="bg-neutral-300 h-6" />
			{sections[1].map((section) => (
				<ToolbarButton key={section.label} {...section} />
			))}
			<TextColorButton />
			<HighlightColorButton />
			<Separator orientation="vertical" className="bg-neutral-300 h-6" />
			<LinkButton />
			<ImageButton />
			<Separator orientation="vertical" className="bg-neutral-300 h-6" />
			<ListButton />
			{sections[2].map((section) => (
				<ToolbarButton key={section.label} {...section} />
			))}
		</div>
	)
}
