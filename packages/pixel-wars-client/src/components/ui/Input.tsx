import { twMerge } from "tailwind-merge";

export default function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input className={twMerge("border-2 p-1 pl-2 pr-2", className)} {...props} />
  )
}
