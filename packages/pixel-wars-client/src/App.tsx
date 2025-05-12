import { useEffect, useState } from "react"
import "./App.css"
import GameUi from "./GameUi"
import logoBlack from "./assets/img/pixel-wars-black.webp"
import PixelatedImg from "./components/PixelatedImg"
import AnimatedImgButton from "./components/AnimatedImgButton"
import singleplayerButtonDefault from "./assets/img/singleplayer-button-default.webp"
import singleplayerButtonSpritesheet from "./assets/img/singleplayer-button-spritesheet.webp"
import multiplayerButtonDefault from "./assets/img/multiplayer-button-default.webp"
import multiplayerButtonSpritesheet from "./assets/img/multiplayer-button-spritesheet.webp"
import { initialised, initSingleplayer, offPixelWarsInit, onPixelWarsInit } from "./main"

function Menu() {
  return (
    <div className="size-full">
      <div className="size-full absolute flex items-center justify-center">
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
              
            }}
          />
        </div>
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
    <main className="size-full">
      {
        gameRunning ?
        <GameUi />
        :
        <Menu />
      }
    </main>
  )
}
