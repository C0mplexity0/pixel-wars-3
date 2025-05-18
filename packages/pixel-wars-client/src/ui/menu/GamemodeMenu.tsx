import AnimatedImgButton from "../components/AnimatedImgButton"
import { initSingleplayer } from "../../main"
import CreativeGamemode from "../../game/gamemode/creative"
import PixelWarsCore from "pixel-wars-core"
import { nodeEnvDevelopment } from "../../util/node"
import DebugGamemode from "../../game/gamemode/debug"
import creativeButtonImg from "../assets/img/gamemodes/creative-button.png"
import creativeButtonSpritesheet from "../assets/img/gamemodes/creative-button-spritesheet.png"
import debugButtonImg from "../assets/img/gamemodes/debug-button.png"
import debugButtonSpritesheet from "../assets/img/gamemodes/debug-button-spritesheet.png"
import DucksGamemode from "../../game/gamemode/ducks"

function GamemodeMenuOption({ defaultImgSrc, spritesheetImgSrc, onClick, timings }: { defaultImgSrc: string, spritesheetImgSrc: string, onClick: () => void, timings: number[] }) {
  return (
    <AnimatedImgButton 
      defaultImgSrc={defaultImgSrc} 
      spritesheetImgSrc={spritesheetImgSrc} 
      className="w-[504px] h-[72px]"
      onClick={onClick}
      timings={timings}
    />
  )
}

export default function GamemodeMenu() {
  return (
    <div className="size-full flex flex-col justify-center items-center gap-2">
      <GamemodeMenuOption 
        defaultImgSrc={creativeButtonImg} 
        spritesheetImgSrc={creativeButtonSpritesheet} 
        timings={[300, 300, 300, 300, 300, 300]}
        onClick={() => {
          initSingleplayer(new CreativeGamemode(new PixelWarsCore(false)))
        }}
      />
      <GamemodeMenuOption 
        defaultImgSrc={creativeButtonImg} 
        spritesheetImgSrc={creativeButtonSpritesheet} 
        timings={[300, 300, 300, 300, 300, 300]}
        onClick={() => {
          initSingleplayer(new DucksGamemode(new PixelWarsCore(false)))
        }}
      />
      {
        nodeEnvDevelopment() ?
        <GamemodeMenuOption 
          defaultImgSrc={debugButtonImg} 
          spritesheetImgSrc={debugButtonSpritesheet} 
          onClick={() => {
            initSingleplayer(new DebugGamemode(new PixelWarsCore(false)))
          }}
          timings={[1000]}
        /> : null
      }
    </div>
  )
}
