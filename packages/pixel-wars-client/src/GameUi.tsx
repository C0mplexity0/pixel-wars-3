import { useEffect, useState } from "react";
import Debug from "./debug/Debug";
import { getClient } from "./main";

function Inventory() {
  const game = getClient()
  const [selectedColour, setSelectedColour] = useState(game.getPlayer().getSelectedColour())
  const [colours, setColours] = useState(game.getPlayer().getColourInventory())

  useEffect(() => {
    const callback = (colourInventory: number[], selectedColour: number) => {
      setSelectedColour(selectedColour)
      setColours(colourInventory)
    }

    game.getPlayer().onColourInventoryUpdated(callback)

    return () => {
      game.getPlayer().offColourInventoryUpdated(callback)
    }
  })

  return (
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-primary flex flex-row gap-2 p-2">
      {colours.map((value, i) => {
        const pixelInfo = game.getClientWorld().getPixelTypes()
        const pixelType = pixelInfo[value]

        let isTexture = false

        if (pixelType.texture) {
          isTexture = true
        }

        return <button 
          className={`size-8 cursor-pointer ${selectedColour === i ? "scale-110" : ""}`} 
          key={i} 
          style={isTexture ? { backgroundImage: `url(${pixelType.texture})`, backgroundSize: "100% 100%", imageRendering: "pixelated" } : { backgroundColor: pixelType.colour }}
          onClick={() => {
            game.getPlayer().setSelectedColour(i)
          }}
        ></button>
      })}
    </div>
  )
}

export default function GameUi() {
  const game = getClient()
  const [debugModeEnabled, setDebugModeEnabled] = useState(game.inDebugMode())

  useEffect(() => {
    const callback = (enabled: boolean) => {
      setDebugModeEnabled(enabled)
    }

    game.onDebugModeToggle(callback)

    return () => {
      game.offDebugModeToggle(callback)
    }
  })

  return (
    <div className="relative size-full">
      {
        debugModeEnabled ? <Debug /> : null
      }
      <Inventory />
    </div>
  )
}
