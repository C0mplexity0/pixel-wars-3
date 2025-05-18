import { useState, useEffect } from "react"
import type { LocalPixelInventoryUpdatedEvent } from "../../game/player/local-player"
import { getClient } from "../../main"

export default function GameInventory() {
  const game = getClient()
  const [selectedPixel, setSelectedPixel] = useState(game ? game.getPlayer().getSelectedPixel() : 0)
  const [colours, setColours] = useState(game ? game.getPlayer().getPixelInventory() : [])

  useEffect(() => {
    if (!game)
      return

    const callback = (event: LocalPixelInventoryUpdatedEvent) => {
      const pixelInventory = event.getPixelInventory()
      const selectedPixel = event.getSelectedPixel()
      setSelectedPixel(selectedPixel)
      setColours(pixelInventory)
    }

    game.getPlayer().onPixelInventoryUpdated(callback)

    return () => {
      game.getPlayer().offPixelInventoryUpdated(callback)
    }
  })

  if (!game)
    return

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
          className={`size-8 cursor-pointer ${selectedPixel === i ? "scale-110" : ""}`} 
          key={i} 
          style={isTexture ? { backgroundImage: `url(${pixelType.texture})`, backgroundSize: "100% 100%", imageRendering: "pixelated" } : { backgroundColor: pixelType.colour }}
          onClick={() => {
            game.getPlayer().setSelectedPixel(i)
          }}
        ></button>
      })}
    </div>
  )
}
