import { twMerge } from "tailwind-merge";

export default function Button({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {

  return (
    <button 
      className={twMerge("border-2 p-1 cursor-pointer bg-white hover:bg-button-hovered flex flex-row gap-1 justify-center items-center", className)} 
      {...props} 
    />
  )
}
