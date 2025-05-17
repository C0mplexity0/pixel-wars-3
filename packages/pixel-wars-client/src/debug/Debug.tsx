import { useState, useEffect } from "react"
import { getClient } from "../main"
import type { UpdateEvent } from "../game"
import WorldUtils from "pixel-wars-core/world/utils"

export default function Debug() {
  const [fps, setFps] = useState(0)
  const [coordinates, setCoordinates] = useState([0, 0])

  const chunkCoordinates = WorldUtils.getChunkFromPixelPos(coordinates[0], coordinates[1])
  
  useEffect(() => {
    const game = getClient()

    if (!game)
      return

    const callback = (event: UpdateEvent) => {
      const deltaTime = event.getDeltaTime()
      setFps(Math.floor(1000/deltaTime))
      setCoordinates(game.getPlayer().getPosition())
    }

    game.onUpdate(callback)

    return () => {
      game.offUpdate(callback)
    }
  })

  return (
    <div className="size-full flex flex-col">
      <span>{`FPS: ${fps}`}</span>
      <span>{`Position: ${coordinates[0]}, ${coordinates[1]}`}</span>
      <span>{`Chunk: ${chunkCoordinates[0]}, ${chunkCoordinates[1]}`}</span>
    </div>
  )
}