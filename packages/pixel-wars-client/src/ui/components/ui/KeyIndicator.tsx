import AnimatedImg from "../AnimatedImg";
import shiftKeySpritesheet from "../../assets/img/shift-key-spritesheet.png"

export function ShiftKeyIndicator() {
  return (
    <AnimatedImg 
      spritesheetImgSrc={shiftKeySpritesheet} 
      timings={[500, 500]}
      alt="Left Shift"
      className="w-[66px] h-[20px]"
    />
  )
}
