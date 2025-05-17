#!/usr/bin/env node

import fs from "node:fs"
import { Command } from "commander"

const CHUNK_SIZE = 16

const BLOCKS = ["#000", "#474747", "#878787", "#bababa", "#E53935", "#B71C1C", "#F57F17", "#5A3D23", "#FFEB3B", "#95de16", "#37de16", "#1da811", "#33691E", "#18c7b8", "#18a7c7", "#1884c7",  "#0D47A1", "#6c18c7", "#b218c7", "#c718a1", "#F06292"]

function getPixelTypes() {
  const types = [
    {
      colour: "#ffffff"
    }
  ]

  for (let i=0;i<BLOCKS.length;i++) {
    types.push({
      colour: BLOCKS[i]
    })
  }

  return types
}

function getPixels() {
  const pixels = []
  const pixelTypes = getPixelTypes()
  for (let i=0;i<pixelTypes.length;i++) {
    if (i === 0) {
      pixels.push({
        typeId: 0,
        playerCanWalk: true
      })
    } else {
      pixels.push({
        typeId: i
      })
    }
  }

  return pixels
}

function getChunkPosFromOldChunkId(oldChunkId) {
  if (!(typeof oldChunkId == "string"))
    return

  const sections = oldChunkId.split("y")
  sections[0] = sections[0].replace("x", "")

  const x = parseInt(sections[0])
  const y = parseInt(sections[1])

  return [x, y]
}

function getNewChunkId(oldChunkId) {
  const [x, y] = getChunkPosFromOldChunkId(oldChunkId)

  return `${x},${y}`
}

function getOldChunkIdFromPos(x, y) {
  return `x${x}y${y}`
}

const cmd = new Command()

cmd
  .name("convert-pixel-wars-world")
  .description("A simple CLI tool for converting PIXEL WARS 2 worlds to PIXEL WARS 3")
  .version("3.0.0")

cmd
  .command("convert <path>")
  .description("Convert a PIXEL WARS 2 world to PIXEL WARS 3")
  .option("-o, --out <path>", "File to export the new world file to")
  .action((path, options) => {
    const version = "3.0.0"
    const out = options.out ? options.out : "converted-world.json"

    fs.readFile(path, "utf8", (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      
      const json = JSON.parse(data)

      const info = {
        validPixelWarsWorldFile: true,
        version,
        chunkSize: CHUNK_SIZE,
        pixelTypes: getPixelTypes(),
        pixels: getPixels()
      }

      const chunks = {}

      for (const oldChunkId in json) {
        const newChunkId = getNewChunkId(oldChunkId)
        const oldChunk = json[oldChunkId]
        const newChunk = []
        const [chunkX, chunkY] = getChunkPosFromOldChunkId(oldChunkId)

        for (let y=0;y<CHUNK_SIZE;y++) {
          for (let x=0;x<CHUNK_SIZE;x++) {
            const xBroken = chunkX < 0 && x === 0
            const yBroken = chunkY < 0 && y === 0

            let chunk = oldChunk

            if (xBroken && yBroken) {
              const chunkId = getOldChunkIdFromPos(chunkX - 1, chunkY - 1)
              chunk = json[chunkId]
            } else if (xBroken) {
              const chunkId = getOldChunkIdFromPos(chunkX - 1, chunkY)
              chunk = json[chunkId]
            } else if (yBroken) {
              const chunkId = getOldChunkIdFromPos(chunkX, chunkY - 1)
              chunk = json[chunkId]
            }

            if (chunk === undefined) {
              chunk = [
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
              ]
            }

            const pixel = chunk[y][x]
            
            if (pixel < getPixelTypes().length && pixel >= 0) {
              newChunk.push(pixel)
            } else {
              newChunk.push(0)
            }
          }
        }

        chunks[newChunkId] = newChunk
      }

      const newJson = {
        info,
        chunks
      }

      const fileContent = JSON.stringify(newJson)

      fs.writeFile(out, fileContent, err => {
        if (err) {
          console.error(err);
        } else {
          console.log("Wrote to " + out)
        }
      });
    });
  })

cmd.parse(process.argv)
