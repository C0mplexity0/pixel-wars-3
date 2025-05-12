import { useState } from "react";
import { twMerge } from "tailwind-merge";
import AnimatedImg from "./AnimatedImg";

interface AnimatedImgButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  defaultImgSrc: string,
  spritesheetImgSrc: string,
  timings: number[],
  alt?: string,
}

export default function AnimatedImgButton({ defaultImgSrc, spritesheetImgSrc, timings, alt, className, ...props }: AnimatedImgButtonProps) {
  const [hovered, setHovered] = useState(false)

  const onHover = () => {
    setHovered(true)
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
      <AnimatedImg
        alt={alt} 
        spritesheetImgSrc={spritesheetImgSrc} 
        timings={timings}
        className="size-full"
        style={{opacity: hovered ? "1" : "0"}}
        playing={hovered}
      />
      <img 
        alt={alt}
        src={defaultImgSrc}
        className="h-full absolute top-0 cursor-pointer block max-w-max"
        style={{opacity: hovered ? "0" : "1"}}
      />
    </button>
  )
}
