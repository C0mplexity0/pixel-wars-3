import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface AnimatedImgButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  defaultImgSrc: string,
  spritesheetImgSrc: string,
  timings: number[],
}

export default function AnimatedImgButton({ defaultImgSrc, spritesheetImgSrc, timings, className, ...props }: AnimatedImgButtonProps) {
  const [hovered, setHovered] = useState(false)
  const [hoverCount, setHoverCount] = useState(0)
  const [frame, setFrame] = useState(0)

  const imgSrc = hovered ? spritesheetImgSrc : defaultImgSrc

  useEffect(() => {
    if (!hovered) {
      setFrame(0)
      return
    }

    if (!timings[frame+1])
      return

    const timeout = setTimeout(() => {
      setFrame(frame+1)
    }, timings[frame])

    return () => {
      clearTimeout(timeout)
    }
  }, [frame, hovered, timings])

  const offset = hovered ? -frame : 0
  
  return (
    <button
      onMouseEnter={() => {
        setHovered(true)
        setHoverCount(hoverCount + 1)
      }}

      onMouseLeave={() => {
        setHovered(false)
      }}

      className={twMerge("relative p-0 block overflow-hidden", className)}

      {...props}
    >
      <img 
        src={imgSrc}
        className="h-full absolute top-0 cursor-pointer block max-w-max"

        style={{left: `${offset * 100}%`, imageRendering: "pixelated"}}
      />
    </button>
  )
}
