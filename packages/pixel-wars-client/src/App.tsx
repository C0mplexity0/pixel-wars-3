import { useEffect, useState } from "react"
import "./App.css"
import GameUi from "./GameUi"
import logoBlack from "./assets/img/pixel-wars-black.png"
import PixelatedImg from "./components/PixelatedImg"
import AnimatedImgButton from "./components/AnimatedImgButton"
import singleplayerButtonDefault from "./assets/img/singleplayer-button-default.png"
import singleplayerButtonSpritesheet from "./assets/img/singleplayer-button-spritesheet.png"
import multiplayerButtonDefault from "./assets/img/multiplayer-button-default.png"
import multiplayerButtonSpritesheet from "./assets/img/multiplayer-button-spritesheet.png"
import { initialised, initSingleplayer, offPixelWarsInit, onPixelWarsInit } from "./main"
import Input from "./components/ui/Input"
import Button from "./components/ui/Button"
import AnimatedImg from "./components/AnimatedImg"
import loadingSpritesheet from "./assets/img/loading.png"

function MultiplayerMenu() {
  const [loading, setLoading] = useState(false)

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
          <span>Connecting to server</span>
          <Button
            className="w-full"
            onClick={() => {
              setLoading(false)
            }}
          >Cancel</Button>
        </div> :
        <>
          <label htmlFor="address">Enter Server IP</label>
          <Input name="address" id="address" type="text" placeholder="example.com" />
          <Button 
            className="mt-2"
            onClick={() => {
              setLoading(true)
            }}
          >Connect</Button>
        </>
      }
    </div>
  )
}

function Menu() {
  const [multiplayerMenuOpen, setMultiplayerMenuOpen] = useState(false)

  return (
    <div className="size-full">
      {
        multiplayerMenuOpen ?
        <button 
          className="absolute z-2 top-2 left-2 cursor-pointer"
          onClick={() => {
            setMultiplayerMenuOpen(false)
          }}
        >Back to Menu</button>
        : null
      }
      <div className="size-full absolute flex items-center justify-center">
        {
          multiplayerMenuOpen ?
          <MultiplayerMenu /> :
          <div className="w-200 flex flex-col items-center justify-center gap-2">
          <PixelatedImg className="w-100 pb-8" src={logoBlack} alt="PIXEL WARS Logo" />

          <AnimatedImgButton 
            defaultImgSrc={singleplayerButtonDefault}
            spritesheetImgSrc={singleplayerButtonSpritesheet}
            timings={[100, 300, 250, 100, 100, 300, 450, 300, 400, 250, 500, 300, 300, 350, 350, 250, 300, 400, 350, 2500]}
            className="w-[504px] h-[72px]"
            alt="Singleplayer Button Image"
            aria-label="Singleplayer Button"
            onClick={() => {
              initSingleplayer()
            }}
          />

          <AnimatedImgButton 
            defaultImgSrc={multiplayerButtonDefault}
            spritesheetImgSrc={multiplayerButtonSpritesheet}
            timings={[100, 400, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 100, 150, 125, 150, 150, 150, 125, 150, 150, 100, 100, 100, 2500]}
            className="w-[504px] h-[72px]"
            alt="Multiplayer Button Image"
            aria-label="Multiplayer Button"
            onClick={() => {
              setMultiplayerMenuOpen(true)
            }}
          />
        </div>
        }
      </div>

      <div className="absolute bottom-2 left-2">
        <a 
          href="https://c0mplexity.com" 
          target="_blank"
          className="underline"
        >By C0mplexity</a>
      </div>
    </div>
  )
}

export default function App() {
  const [gameRunning, setGameRunning] = useState(initialised())

  useEffect(() => {
    if (gameRunning)
      return

    const callback = () => {
      setGameRunning(true)
    }

    onPixelWarsInit(callback)

    return () => {
      offPixelWarsInit(callback)
    }
  })

  return (
    <main className="size-full" style={{imageRendering: "pixelated"}}>
      {
        gameRunning ?
        <GameUi />
        :
        <Menu />
      }
    </main>
  )
}
