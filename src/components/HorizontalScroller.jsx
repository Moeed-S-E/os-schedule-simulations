import { useId, useRef } from 'react'

function HorizontalScroller({ children, className = '', contentClassName = '' }) {
  const contentId = useId()
  const contentRef = useRef(null)

  const scroll = (direction) => {
    contentRef.current?.scrollBy({
      left: direction * Math.max(contentRef.current.clientWidth * 0.75, 180),
      behavior: 'smooth',
    })
  }

  return (
    <div className={`flex min-w-0 items-center gap-2 ${className}`}>
      <button
        type="button"
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface text-app shadow-raised transition-shadow hover:shadow-inset focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label="Scroll left"
        aria-controls={contentId}
        onClick={() => scroll(-1)}
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5 fill-none stroke-current stroke-2">
          <path d="m12.5 4.5-5 5.5 5 5.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <div
        id={contentId}
        ref={contentRef}
        tabIndex={0}
        className={`min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${contentClassName}`}
      >
        {children}
      </div>
      <button
        type="button"
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-surface text-app shadow-raised transition-shadow hover:shadow-inset focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        aria-label="Scroll right"
        aria-controls={contentId}
        onClick={() => scroll(1)}
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" className="size-5 fill-none stroke-current stroke-2">
          <path d="m7.5 4.5 5 5.5-5 5.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}

export default HorizontalScroller
