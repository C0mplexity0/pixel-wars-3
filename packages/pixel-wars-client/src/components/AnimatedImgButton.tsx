import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface AnimatedImgButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  defaultImgSrc: string,
  spritesheetImgSrc: string,
  timings: number[],
  alt?: string,
}

export default function AnimatedImgButton({ defaultImgSrc, spritesheetImgSrc, timings, alt, className, ...props }: AnimatedImgButtonProps) {
  const [hovered, setHovered] = useState(false)
  const [hoverCount, setHoverCount] = useState(0)
  const [frame, setFrame] = useState(0)

  const preloadImg = new Image()
  preloadImg.src = spritesheetImgSrc // Preload spritesheet

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

  const onHover = () => {
    setHovered(true)
    setHoverCount(hoverCount + 1)
  }

  const onHoverLoss = () => {
    setHovered(false)
  }
  
  return (
    <button
      onMouseEnter={onHover}

      onMouseLeave={onHoverLoss}

      onFocus={onHover}

      onBlur={onHoverLoss}

      className={twMerge("relative p-0 block overflow-hidden", className)}

      {...props}
    >
      <img 
        alt={alt}
        src={imgSrc}
        className="h-full absolute top-0 cursor-pointer block max-w-max"

        style={{left: `${offset * 100}%`, imageRendering: "pixelated"}}
      />
    </button>
  )
}
