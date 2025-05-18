import { endGame, getClient } from "../../main"
import DropdownMenu, { DropdownMenuButton, DropdownMenuContent } from "../components/ui/DropdownMenu";
import downloadIcon from "../assets/img/icon/download.png"
import uploadIcon from "../assets/img/icon/upload.png"
import homeIcon from "../assets/img/icon/home.png"
import Icon from "../components/ui/Icon";
import fileDownload from "js-file-download";
import WorldUtils from "pixel-wars-core/world/utils";
import { launchFilePrompt } from "../../util/file-prompt";
import type { SettingsUpdatedEvent } from "pixel-wars-core";
import { useState, useEffect } from "react";

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

export default function GameDropdownMenu() {
  return (
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
  )
}
