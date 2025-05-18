import AnimatedImgButton from "../AnimatedImgButton"

import creativeButtonImg from "../../assets/img/gamemodes/creative-button.png"
import creativeButtonSpritesheet from "../../assets/img/gamemodes/creative-button-spritesheet.png"
import { initSingleplayer } from "../../../main"
import CreativeGamemode from "../../../game/gamemode/creative"
import PixelWarsCore from "pixel-wars-core"

function GamemodeMenuOption({ defaultImgSrc, spritesheetImgSrc, onClick }: { defaultImgSrc: string, spritesheetImgSrc: string, onClick: () => void }) {
  return (
    <AnimatedImgButton 
      defaultImgSrc={defaultImgSrc} 
      spritesheetImgSrc={spritesheetImgSrc} 
      timings={[300, 300, 300, 300, 300, 300]}
      className="w-[504px] h-[72px]"
      onClick={onClick}
    />
  )
}

export default function GamemodeMenu() {
  return (
    <div className="size-full flex flex-col justify-center items-center gap-2">
      <GamemodeMenuOption 
        defaultImgSrc={creativeButtonImg} 
        spritesheetImgSrc={creativeButtonSpritesheet} 
        onClick={() => {
          initSingleplayer(new CreativeGamemode(new PixelWarsCore(false)))
        }}
      />
    </div>
  )
}
