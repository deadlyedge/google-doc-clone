import { useRef, useState } from "react"
import { FaCaretDown } from "react-icons/fa"
import { useStorage, useMutation } from "@liveblocks/react/suspense"

import {
	DEFAULT_PAGE_MARGIN,
	MIN_PAGE_WIDTH,
	PAGE_WIDTH,
} from "@/constants/page-size"
import { cn } from "@/lib/utils"

const markers = Array.from({ length: 83 }, (_, i) => i)

export const Ruler = () => {
	const leftMargin =
		useStorage((storage) => storage.leftMargin) ?? DEFAULT_PAGE_MARGIN
	const setLeftMargin = useMutation(({ storage }, newLeftMargin) => {
		storage.set("leftMargin", newLeftMargin)
	}, [])
	const rightMargin =
		useStorage((storage) => storage.rightMargin) ?? DEFAULT_PAGE_MARGIN
	const setRightMargin = useMutation(({ storage }, newRightMargin) => {
		storage.set("rightMargin", newRightMargin)
	}, [])

	const [isDraggingLeft, setIsDraggingLeft] = useState(false)
	const [isDraggingRight, setIsDraggingRight] = useState(false)

	const rulerRef = useRef<HTMLDivElement>(null)

	const handleLeftMouseDown = () => {
		setIsDraggingLeft(true)
	}
	const handleRightMouseDown = () => {
		setIsDraggingRight(true)
	}

	const handleMouseMove = (e: React.MouseEvent) => {
		if ((isDraggingLeft || isDraggingRight) && rulerRef.current) {
			const container = rulerRef.current.querySelector("#ruler-container")
			if (container) {
				const containerRect = container.getBoundingClientRect()
				const relativeX = e.clientX - containerRect.left
				const rawPosition = Math.max(0, Math.min(relativeX, PAGE_WIDTH))

				if (isDraggingLeft) {
					const maxLeftPosition = PAGE_WIDTH - rightMargin - MIN_PAGE_WIDTH
					const newLeftPosition = Math.min(rawPosition, maxLeftPosition)
					setLeftMargin(newLeftPosition)
				} else if (isDraggingRight) {
					const maxRightPosition = PAGE_WIDTH - leftMargin - MIN_PAGE_WIDTH
					const newRightPosition = Math.max(PAGE_WIDTH - rawPosition, 0)
					const constrainedRightPosition = Math.min(
						newRightPosition,
						maxRightPosition,
					)
					setRightMargin(constrainedRightPosition)
				}
			}
		}
	}
	const handleMouseUp = () => {
		setIsDraggingLeft(false)
		setIsDraggingRight(false)
	}

	const handleLeftDoubleClick = () => {
		setLeftMargin(DEFAULT_PAGE_MARGIN)
	}
	const handleRightDoubleClick = () => {
		setRightMargin(DEFAULT_PAGE_MARGIN)
	}

	return (
		<div
			ref={rulerRef}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			onMouseLeave={handleMouseUp}
			className={`w-[${PAGE_WIDTH}px] mx-auto h-6 border-b border-gray-300 flex items-end relative select-none print:hidden`}>
			<div id="ruler-container" className="w-full h-full relative">
				<Marker
					position={leftMargin}
					isLeft={true}
					isDragging={isDraggingLeft}
					onMouseDown={handleLeftMouseDown}
					onDoubleClick={handleLeftDoubleClick}
				/>
				<Marker
					position={rightMargin}
					isLeft={false}
					isDragging={isDraggingRight}
					onMouseDown={handleRightMouseDown}
					onDoubleClick={handleRightDoubleClick}
				/>
				<div className="absolute inset-x-0 bottom-0 h-full">
					<div className={`relative h-full w-[${PAGE_WIDTH}px]`}>
						{markers.map((marker) => {
							const position = (marker * PAGE_WIDTH) / 82

							return (
								<div
									key={marker}
									className="absolute bottom-0"
									style={{ left: `${position}px` }}>
									{marker % 10 === 0 && (
										<>
											<div className="absolute bottom-0 h-2 w-[1px] bg-neutral-500" />
											<span className="absolute bottom-2 text-[10px] text-neutral-500 transform -translate-x-1/2">
												{marker / 10 + 1}
											</span>
										</>
									)}
									{marker % 5 === 0 && marker % 10 !== 0 && (
										<div className="absolute bottom-0 h-1.5 w-[1px] bg-neutral-500" />
									)}
									{marker % 5 !== 0 && (
										<div className="absolute bottom-0 h-1 w-[1px] bg-neutral-500" />
									)}
								</div>
							)
						})}
					</div>
				</div>
			</div>
		</div>
	)
}

type MarkerProps = {
	position: number
	isLeft: boolean
	isDragging: boolean
	onMouseDown: () => void
	onDoubleClick: () => void
}

const Marker = ({
	position,
	isLeft,
	isDragging,
	onMouseDown,
	onDoubleClick,
}: MarkerProps) => {
	return (
		<div
			className="absolute top-0 w-4 h-full cursor-ew-resize z-[5] group -ml-2"
			style={{ [isLeft ? "left" : "right"]: `${position}px` }}
			onMouseDown={onMouseDown}
			onDoubleClick={onDoubleClick}>
			<FaCaretDown className="absolute left-1/2 top-0 h-full fill-blue-500 transform -translate-x-1/2" />
			<div
				className={cn(
					"absolute left-1/2 top-4 transform -translate-x-1/2 duration-150 h-[100vh] w-[1px] bg-blue-500",
					isDragging ? "opacity-100" : "opacity-0 group-hover:opacity-100",
				)}
			/>
		</div>
	)
}
