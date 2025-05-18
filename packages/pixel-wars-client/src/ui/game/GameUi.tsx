import { useEffect, useState } from "react";
import Debug from "../debug/Debug";
import { getClient } from "../../main";
import { ShiftKeyIndicator } from "../components/ui/KeyIndicator";
import type { DebugModeToggleEvent } from "../../game";
import GameInventory from "./Inventory";
import GameDropdownMenu from "./DropdownMenu";

function BuildKeyTip() {
  return (
    <div className="absolute flex flex-row gap-1 left-2 bottom-2 p-1 bg-white">
      <span>TIP: Hold</span>
      <ShiftKeyIndicator />
      <span>to build </span>
    </div>
  )
}

export default function GameUi() {
  const game = getClient()
  const [debugModeEnabled, setDebugModeEnabled] = useState(game ? game.inDebugMode() : false)
  const [buildKeyTipEnabled, setBuildKeyTipEnabled] = useState(true)

  useEffect(() => {
    if (!game)
      return

    const debugModeToggleCallback = (event: DebugModeToggleEvent) => {
      setDebugModeEnabled(event.debugModeEnabled())
    }

    game.onDebugModeToggle(debugModeToggleCallback)

    const keyDownCallback = (event: KeyboardEvent) => {
      if (event.key === "Shift")
        setBuildKeyTipEnabled(false)
    }

    if (buildKeyTipEnabled) {
      window.addEventListener("keyup", keyDownCallback)
    }

    return () => {
      game.offDebugModeToggle(debugModeToggleCallback)
      window.removeEventListener("keyup", keyDownCallback)
    }
  })

  if (!game)
    return

  return (
    <div className="relative size-full">
      {
        debugModeEnabled ? <Debug /> : null
      }
      <GameInventory />
      {
        buildKeyTipEnabled ? <BuildKeyTip /> : null
      }
      <GameDropdownMenu />
    </div>
  )
}
