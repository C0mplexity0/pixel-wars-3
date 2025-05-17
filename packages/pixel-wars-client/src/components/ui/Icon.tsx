import { twMerge } from "tailwind-merge";

export default function Icon({ className, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img className={twMerge("w-4 h-4", className)} {...props} />
  )
}
