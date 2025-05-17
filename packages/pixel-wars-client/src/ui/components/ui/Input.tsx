import React from "react";
import { twMerge } from "tailwind-merge";

const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(({ className, ...props }, ref) => {
  return (
    <input 
      className={twMerge("border-2 p-1 pl-2 pr-2", className)} 
      ref={ref}
      {...props} 
    />
  )
})

export default Input