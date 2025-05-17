export default function PixelatedImg({ ...props }: React.ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <img style={{imageRendering: "pixelated"}} {...props} />
  )
}
