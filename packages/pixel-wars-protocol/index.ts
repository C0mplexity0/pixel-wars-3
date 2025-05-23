import PacketInJoin from "./definitions/packets/in/join";
import PacketInPlacePixel from "./definitions/packets/in/place-pixel";
import PacketOutConnected from "./definitions/packets/out/connected";
import PacketOutSetPixelInventory from "./definitions/packets/out/set-colour-inventory";
import PacketOutSetPixel from "./definitions/packets/out/set-pixel";
import PacketOutSetPixelTypes from "./definitions/packets/out/set-pixel-types";

export default {
  PacketOutConnected,
  PacketOutSetPixelInventory,
  PacketOutSetPixelTypes,
  PacketOutSetPixel,

  PacketInJoin,
  PacketInPlacePixel,
}
