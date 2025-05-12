import { twMerge } from "tailwind-merge";

export default function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {

  return (
    <button 
      className={twMerge("border-2 p-1 cursor-pointer bg-white hover:bg-button-hovered", className)} 
      {...props} 
    />
  )
}
