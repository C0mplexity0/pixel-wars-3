import { useEffect, useState } from "react";
import Debug from "./debug/Debug";
import { endGame, getClient } from "../main";
import { ShiftKeyIndicator } from "./components/ui/KeyIndicator";
import type { PixelInventoryUpdatedEvent } from "pixel-wars-core/player";
import type { DebugModeToggleEvent } from "../game";
import DropdownMenu, { DropdownMenuButton, DropdownMenuContent } from "./components/ui/DropdownMenu";
import downloadIcon from "./assets/img/icon/download.png"
import uploadIcon from "./assets/img/icon/upload.png"
import homeIcon from "./assets/img/icon/home.png"
import Icon from "./components/ui/Icon";
import fileDownload from "js-file-download";
import WorldUtils from "pixel-wars-core/world/utils";
import { launchFilePrompt } from "../util/file-prompt";
import type { SettingsUpdatedEvent } from "pixel-wars-core";

function Inventory() {
  const game = getClient()
  const [selectedColour, setSelectedColour] = useState(game ? game.getPlayer().getSelectedColour() : 0)
  const [colours, setColours] = useState(game ? game.getPlayer().getPixelInventory() : [])

  useEffect(() => {
    if (!game)
      return

    const callback = (event: PixelInventoryUpdatedEvent) => {
      const pixelInventory = event.getPixelInventory()
      const selectedColour = event.getSelectedColour()
      setSelectedColour(selectedColour)
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

function BuildKeyTip() {
  return (
    <div className="absolute flex flex-row gap-1 left-2 bottom-2 p-1 bg-white">
      <span>TIP: Hold</span>
      <ShiftKeyIndicator />
      <span>to build </span>
    </div>
  )
}

function DropdownMenuDownloadImportButtons() {
  const game = getClient()
  const [gameSettings, setGameSettings] = useState(game?.getSettings())

  useEffect(() => {
    if (!game)
      return

    const callback = (event: SettingsUpdatedEvent) => {
      setGameSettings(event.getNewSettings())
    }

    game.onSettingsUpdated(callback)

    return () => {
      game.offSettingsUpdated(callback)
    }
  })

  if (!game) {
    return (
      <>
      </>
    )
  }

  return (
    <>
      {
        gameSettings?.downloadingEnabled ?
        <DropdownMenuButton
        onClick={() => {
          fileDownload(JSON.stringify(game.getClientWorld().getFileContent()), "world.json")
        }}
        >
          <Icon src={downloadIcon} /> <span className="h-5">Save World</span>
        </DropdownMenuButton> : null
      }
      {
        gameSettings?.importingEnabled ?
        <DropdownMenuButton
          onClick={() => {
            const core = game.getSingleplayerCore()
            if (!core)
              return

            launchFilePrompt((content) => {
              const core = game.getSingleplayerCore()
              if (!core)
                return

              WorldUtils.importFile(core, content)
            })
          }}
        >
          <Icon src={uploadIcon} /> <span className="h-5">Import World</span>
        </DropdownMenuButton> : null
      }
    </>
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
      <Inventory />
      {
        buildKeyTipEnabled ? <BuildKeyTip /> : null
      }
      <DropdownMenu className="absolute top-2 left-2">
        <DropdownMenuContent>
          <DropdownMenuButton
            onClick={() => {
              endGame()
            }}
          >
            <Icon src={homeIcon} /> <span className="h-5">Home</span>
          </DropdownMenuButton>
          <DropdownMenuDownloadImportButtons />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
