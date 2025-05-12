import { useState } from "react";
import { twMerge } from "tailwind-merge";

export default function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [hovered, setHovered] = useState(false)
  
    const onHover = () => {
      setHovered(true)
    }
  
    const onHoverLoss = () => {
      setHovered(false)
    }
  
  return (
    <button 
      className={twMerge(`border-2 p-1 cursor-pointer ${hovered ? "bg-button-hovered" : "bg-white"}`, className)} 
      onMouseEnter={onHover}
      onMouseLeave={onHoverLoss}
      onFocus={onHover}
      onBlur={onHoverLoss}
      {...props} 
    />
  )
}
