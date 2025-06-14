"use client"

import {
	FloatingToolbar,
	useLiveblocksExtension,
} from "@liveblocks/react-tiptap"
import { useStorage } from "@liveblocks/react/suspense"

import Color from "@tiptap/extension-color"
// import Strike from "@tiptap/extension-strike"
import FontFamily from "@tiptap/extension-font-family"
import Highlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import Table from "@tiptap/extension-table"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import TextAlign from "@tiptap/extension-text-align"
import TextStyle from "@tiptap/extension-text-style"
import Underline from "@tiptap/extension-underline"
import { EditorContent, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
// import Image from "@tiptap/extension-image"
import ImageResize from "tiptap-extension-resize-image"

import { FontSizeExtension } from "@/extensions/font-size"
import { LineHeightExtension } from "@/extensions/line-height"
import { useEditorStore } from "@/store/use-editor-store"

import { Ruler } from "./ruler"
import { Threads } from "./threads"
import {
	DEFAULT_PAGE_MARGIN,
	PAGE_WIDTH,
} from "@/constants/page-size"

type EditorProps = {
	initialContent?: string | undefined
}

export const Editor = ({ initialContent }: EditorProps) => {
	const leftMargin = useStorage((root) => root.leftMargin)
	const rightMargin = useStorage((root) => root.rightMargin)

	const liveblocks = useLiveblocksExtension({
		initialContent,
		offlineSupport_experimental: true,
	})
	const { setEditor } = useEditorStore()

	const editor = useEditor({
		immediatelyRender: false,
		// Set the editor instance on all relevant events
		onCreate({ editor }) {
			setEditor(editor)
		},
		onDestroy() {
			setEditor(null)
		},
		onUpdate({ editor }) {
			setEditor(editor)
		},
		onSelectionUpdate({ editor }) {
			setEditor(editor)
		},
		onTransaction({ editor }) {
			setEditor(editor)
		},
		onFocus({ editor }) {
			setEditor(editor)
		},
		onBlur({ editor }) {
			setEditor(editor)
		},
		onContentError({ editor }) {
			setEditor(editor)
		},
		editorProps: {
			attributes: {
				style: `padding-left: ${leftMargin ?? DEFAULT_PAGE_MARGIN}px; padding-right: ${rightMargin ?? DEFAULT_PAGE_MARGIN}px;`,
				class: `focus:outline-none print:border-0 bg-white border border-[#c7c7c7] flex flex-col min-h-[1056px] w-[${PAGE_WIDTH}px] pt-10 pr-14 pb-10 cursor-text`,
			},
		},
		extensions: [
			liveblocks,
			StarterKit.configure({
				history: false,
			}),
			FontFamily,
			TextStyle,
			// Strike,
			Underline,
			Color,
			Highlight.configure({ multicolor: true }),
			Link.configure({
				openOnClick: false,
				autolink: true,
				defaultProtocol: "https",
			}),
			TextAlign.configure({ types: ["heading", "paragraph"] }),
			Placeholder.configure({
				placeholder: "Type something...",
			}),
			TaskList,
			TaskItem.configure({ nested: true }),
			Table.configure({
				resizable: true,
			}),
			TableRow,
			TableHeader,
			TableCell,
			// Image,
			ImageResize,
			FontSizeExtension,
			LineHeightExtension.configure({
				types: ["paragraph", "heading"],
				defaultLineHeight: "normal",
			}),
		],
	})
	return (
		<div className="size-full overflow-x-auto bg-[#f9fbfd] px-4 print:p-0 print:bg-white print:overflow-visible">
			<Ruler />
			<div
				className={`min-w-max flex justify-center w-[${PAGE_WIDTH}px] py-4 print:py-0 mx-auto print:w-full print:min-w-0`}>
				<EditorContent editor={editor} />
				<FloatingToolbar editor={editor} />
				<Threads editor={editor} />
			</div>
		</div>
	)
}
