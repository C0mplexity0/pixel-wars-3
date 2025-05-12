import { useEffect, useState } from "react";
import { twMerge } from "tailwind-merge";

interface AnimatedImgProps extends React.HTMLAttributes<HTMLDivElement> {
  spritesheetImgSrc: string,
  timings: number[],
  alt?: string,
}

export default function AnimatedImg({ spritesheetImgSrc, timings, alt, className, ...props }: AnimatedImgProps) {
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    let nextFrame = frame + 1

    if (!timings[nextFrame])
      nextFrame = 0

    const timeout = setTimeout(() => {
      setFrame(nextFrame)
    }, timings[frame])

    return () => {
      clearTimeout(timeout)
    }
  })
  
  return (
    <div className={twMerge("relative overflow-hidden", className)} {...props}>
      <img 
        alt={alt} 
        src={spritesheetImgSrc}
        style={{left: `${frame*-100}%`}}
        className={"h-full w-fit max-w-max absolute"}
      />
    </div>
  )
}
