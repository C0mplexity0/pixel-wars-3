import { useState, useEffect } from "react"
import type { LocalPixelInventoryUpdatedEvent } from "../../game/player/local-player"
import { getClient } from "../../main"
import Button from "../components/ui/Button"
import Icon from "../components/ui/Icon"
import ellipsisLargeIcon from "../assets/img/icon/ellipsis-large.png"

function GameInventoryExtraMenu({ colours }: { colours: number[] }) {
  const game = getClient()
  
  if (!game)
    return
  
  return (
    <div className="left-0 border-2 bg-white p-2 flex flex-wrap gap-2 w-103">
      {colours.map((value, i) => {
        if (i < 9)
          return

        const pixelInfo = game.getClientWorld().getPixelTypes()
        const pixelType = pixelInfo[value]

        let isTexture = false

        if (pixelType.texture) {
          isTexture = true
        }

        return (
          <Button 
            className="size-8 cursor-pointer border-none"
            key={i} 
            style={isTexture ? { backgroundImage: `url(${pixelType.texture})`, backgroundSize: "100% 100%" } : { backgroundColor: pixelType.colour }}
            onClick={() => {
              const player = game.getPlayer()
              const newInv = [...player.getPixelInventory()]
              const id = newInv[i]
              newInv.splice(i, 1)
              newInv.unshift(id)

              player.setPixelInventory(newInv)
              player.setSelectedPixel(0)
            }}
          ></Button>
        )
      })}
    </div>
  )
}

export default function GameInventory() {
  const game = getClient()
  const [selectedPixel, setSelectedPixel] = useState(game ? game.getPlayer().getSelectedPixel() : 0)
  const [colours, setColours] = useState(game ? game.getPlayer().getPixelInventory() : [])
  const [extraMenuOpen, setExtraMenuOpen] = useState(false)

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
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex flex-col-reverse gap-1">
      <div className="bg-white border-2 flex flex-row gap-2 p-2">
        {colours.map((value, i) => {
          if (i >= 9)
            return

          const pixelInfo = game.getClientWorld().getPixelTypes()
          const pixelType = pixelInfo[value]

          let isTexture = false

          if (pixelType.texture) {
            isTexture = true
          }

          return <Button 
            className={`size-8 cursor-pointer ${selectedPixel === i ? "border-2 scale-110" : "border-none"}`} 
            key={i} 
            style={isTexture ? { backgroundImage: `url(${pixelType.texture})`, backgroundSize: "100% 100%" } : { backgroundColor: pixelType.colour }}
            onClick={() => {
              game.getPlayer().setSelectedPixel(i)
            }}
          ></Button>
        })}
        {
          colours.length >= 9 ?
          <Button 
            className="size-8 p-0 cursor-pointer"
            onClick={() => {
              setExtraMenuOpen(!extraMenuOpen)
            }}
          >
            <Icon src={ellipsisLargeIcon} className="size-6" />
          </Button>
          : null
        }
      </div>
      {
        extraMenuOpen ?
        <GameInventoryExtraMenu colours={colours} /> : null
      }
    </div>
  )
}
