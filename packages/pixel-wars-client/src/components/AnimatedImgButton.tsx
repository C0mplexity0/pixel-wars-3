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

  const preloadImg = new Image()
  preloadImg.src = spritesheetImgSrc // Preload spritesheet

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
      {
        hovered ?
        <AnimatedImg
          alt={alt} 
          spritesheetImgSrc={spritesheetImgSrc} 
          timings={timings}
          className="size-full"
        /> :
        <img 
          alt={alt}
          src={defaultImgSrc}
          className="h-full absolute top-0 cursor-pointer block max-w-max"
        />
      }
    </button>
  )
}
