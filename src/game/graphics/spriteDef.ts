import { assert } from '@shrimp/utils/assertion'
import { BaseTexture, FrameObject, Rectangle, Texture } from 'pixi.js'

export class SpriteDef {
  private static texturePool: Map<string, Array<Texture>>
  private static defs: Map<string, Map<string, Texture[] | FrameObject[]>>

  private static getTextures = (name: string, num: number): Array<Texture> => {
    if (!SpriteDef.texturePool) {
      SpriteDef.texturePool = new Map()
    }

    let textures = SpriteDef.texturePool.get(name)
    if (textures) {
      return textures
    }

    const { default: url } = require(`/res/${name}.png`) // eslint-disable-line  @typescript-eslint/no-var-requires
    const base = BaseTexture.from(url)

    const width = base.width / num
    const height = base.height

    textures = new Array<Texture>()
    for (let x = 0; x < num; x++) {
      const texture = new Texture(base, new Rectangle(x * width, 0, width, height))
      textures.push(texture)
    }
    SpriteDef.texturePool.set(name, textures)
    return textures
  }

  private static isNumArray(arr: number[] | {idx: number, time: number}[]): arr is number[] {
    return arr.length === 0 || typeof arr[0] === 'number'
  }

  public static defineSpriteDef(name: string, num: number, def: Map<string, number[] | {idx: number, time: number}[]>) {
    if (!SpriteDef.defs) {
      SpriteDef.defs = new Map()
    }
    const textures = SpriteDef.getTextures(name, num)

    const def2 = new Map<string, Texture[] | FrameObject[]>()
    for (const [key, value] of def.entries()) {
      if (SpriteDef.isNumArray(value)) {
        def2.set(key, value.map ((idx: number): Texture => textures[idx]))
      } else {
        def2.set(key, value.map ((id: {idx: number, time: number}): FrameObject => {
          return { texture: textures[id.idx], time: id.time }
        }))
      }
    }
    SpriteDef.defs.set(name, def2)
  }

  public static getDef(name: string): Map<string, Texture[] | FrameObject[]> {
    const def = SpriteDef.defs.get(name)
    assert(def, `definition of ${name} is undefined`)
    return def
  }
}

