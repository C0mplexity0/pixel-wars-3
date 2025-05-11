import { useEffect, useState } from "react"
import "./App.css"
import GameUi from "./GameUi"
import logoBlack from "./assets/img/pixel-wars-black.png"
import PixelatedImg from "./components/PixelatedImg"
import AnimatedImgButton from "./components/AnimatedImgButton"
import singleplayerButtonDefault from "./assets/img/singleplayer-button-default.png"
import singleplayerButtonSpritesheet from "./assets/img/singleplayer-button-spritesheet.png"
import { initialised, initSingleplayer, offPixelWarsInit, onPixelWarsInit } from "./main"

function Menu() {
  return (
    <div className="size-full flex items-center justify-center">
      <div className="w-200 flex flex-col items-center justify-center">
        <PixelatedImg className="w-100 p-8 m-2" src={logoBlack} />

        <AnimatedImgButton 
          defaultImgSrc={singleplayerButtonDefault}
          spritesheetImgSrc={singleplayerButtonSpritesheet}
          timings={[100, 300, 250, 100, 100, 300, 450, 300, 400, 250, 500, 300, 300, 350, 350, 250, 300, 400, 350, 2500]}
          className="w-[504px] h-[72px]"
          onClick={() => {
            initSingleplayer()
          }}
        />

        <span className="p-3">Multiplayer coming soon</span>
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
