import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"
import AnimatedImg from "../../components/AnimatedImg"
import loadingSpritesheet from "../../assets/img/loading.png"
import { useState, useRef, useEffect } from "react"
import { onMultiplayerConnectionMessage, offMultiplayerConnectionMessage, initMultiplayer, onMultiplayerConnectionFailure, offMultiplayerConnectionFailure } from "../../main"

export default function MultiplayerMenu() {
  const [loading, setLoading] = useState(false)
  const [errorScreen, setErrorScreen] = useState<string>()
  const [connectingMessage, setConnectingMessage] = useState("Connecting to server...")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const connectionMessageListener = (message: string) => {
      setConnectingMessage(message)
    }

    const connectionFailedListener = (message: string) => {
      setLoading(false)
      setErrorScreen(message)
    }

    onMultiplayerConnectionMessage(connectionMessageListener)
    onMultiplayerConnectionFailure(connectionFailedListener)

    return () => {
      offMultiplayerConnectionMessage(connectionMessageListener)
      offMultiplayerConnectionFailure(connectionFailedListener)
    }
  })

  return (
    <div className="flex flex-col text-center w-75">
      {
        loading ?
        <div className="size-full flex flex-col justify-center items-center gap-4">
          <AnimatedImg
            spritesheetImgSrc={loadingSpritesheet}
            timings={[100, 100, 100, 100, 100, 100, 100, 100]}
            className="w-12 h-12"
            alt="Loading spinner"
          />
          <span>{connectingMessage}</span>
          <Button
            className="w-full"
            onClick={() => {
              setLoading(false)
            }}
          >Cancel</Button>
        </div> :
        errorScreen ?
        <div className="size-full flex flex-col justify-center items-center gap-4">
          <span>{errorScreen}</span>
          <Button
            className="w-full"
            onClick={() => {
              setErrorScreen(undefined)
            }}
          >Return</Button>
        </div>  :
        <>
          <label htmlFor="address">Enter Server IP</label>
          <Input 
            name="address" 
            id="address" 
            type="text" 
            placeholder="pw.example.com"
            ref={inputRef}
          />
          <Button 
            className="mt-2"
            onClick={() => {
              setLoading(true)
              if (inputRef.current)
                initMultiplayer(inputRef.current.value)
            }}
          >Connect</Button>
        </>
      }
    </div>
  )
}
