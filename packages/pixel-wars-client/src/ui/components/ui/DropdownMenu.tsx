import { useState } from "react"
import Button from "./Button"
import Icon from "./Icon"
import menuIcon from "../../assets/img/icon/menu.png"
import closeIcon from "../../assets/img/icon/close.png"
import { twMerge } from "tailwind-merge"

export default function DropdownMenu({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  const [open, setOpen] = useState(false)
  
  return (
    <div {...props}>
      <Button
        onClick={() => {
          setOpen(!open)
        }}
      >
        {
          open ?
          null :
          <Icon src={menuIcon} />
        }
        {
          open ?
          <Icon src={closeIcon} /> :
          null
        }
      </Button>
      {open ? children : null}
    </div>
  )
}

export function DropdownMenuContent({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge("border-2 mt-2", className)} {...props}>
      {children}
    </div>
  )
}

export function DropdownMenuButton({ className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button 
      className={twMerge("w-full border-none", className)} 
      {...props}>
      <div className="w-full flex flex-row gap-1 items-center">
        {children}
      </div>
    </Button>
  )
}
