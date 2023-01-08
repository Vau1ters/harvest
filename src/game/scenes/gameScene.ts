import { Scene } from '@shrimp/scene'
import { BaseTexture, Texture, Rectangle, FrameObject } from 'pixi.js'
import { World } from '@shrimp/ecs/world'
import { Entity } from '@shrimp/ecs/entity'
// system
import { Keyboard } from '@game/system/keyboard'
import { Player } from '@game/system/player'
import { Draw } from '@game/system/draw'
import { Collision } from '@game/system/collision'
import { Camera } from '@game/system/camera'
import { Soil } from '@game/system/soil'
// component
import { Sprite as SpriteComponent } from '@game/component/sprite'
import { Transform } from '@game/component/transform'
import { Player as PlayerComponent } from '@game/component/player'
import { Camera as CameraComponent } from '@game/component/camera'
import { Deadable } from '@game/component/deadable'
import { Collider } from '@game/component/collider'
import { Layer } from '@game/component/layer'
import { Soil as SoilComponent } from '@game/component/soil'
import { ChasePlayer as ChasePlayerComponent } from '@game/component/chasePlayer'
import { assert } from '@shrimp/utils/assertion'
import { HorizontalDirection } from '@game/component/horizontalDirection'
import { ChasePlayer } from '@game/system/chasePlayer'

export class GameScene implements Scene {
  private readonly world: World

  public static mapSize: { width: number, height: number }

  public constructor() {
    GameScene.mapSize = {
      width: 12,
      height: 12
    }
 

    this.world = new World()
    this.world.addSystem(new Keyboard(this.world))
    this.world.addSystem(new ChasePlayer(this.world))
    this.world.addSystem(new Player(this.world))
    this.world.addSystem(new Soil(this.world))
    this.world.addSystem(new Collision(this.world))
    this.world.addSystem(new Camera(this.world))
    this.world.addSystem(new Draw(this.world))

    // マップ定義
    const map = [
      [0,0,0,0,0,0,0,0,0,0,0,0],
      [0,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,2,2,2,2,2,2,1,1,0],
      [0,1,1,2,2,2,2,2,2,1,1,0],
      [0,1,1,2,2,2,2,2,2,1,1,0],
      [0,1,1,2,2,2,2,2,2,1,1,0],
      [0,1,1,2,2,2,2,2,2,1,1,0],
      [0,1,1,2,2,2,2,2,2,1,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,0],
      [0,1,1,1,1,1,1,1,1,1,1,0],
      [0,0,0,0,0,0,0,0,0,0,0,0],
    ]

    // 背景
    SpriteDef.defineSpriteDef('ground', 6,
      new Map([
        ['wall', [0]],
        ['tile', [1]],
        ['none', [2]],
        ['seed', [3]],
        ['bud', [4]],
        ['flower', [5]]
      ]))

    for (let y = 0; y < GameScene.mapSize.height; y++) {
      for (let x = 0; x < GameScene.mapSize.width; x++) {
        const ground = makeGroundEntity(map[y][x], x, y)
        this.world.addEntity(ground)
      }
    }

    // プレイヤー
    SpriteDef.defineSpriteDef('player', 4,
      new Map([
      ['standRight', [0]],
      ['runRight', [{idx: 0, time: 100}, {idx: 1, time: 100}]],
      ['standLeft', [2]],
      ['runLeft', [{idx: 2, time: 100}, {idx: 3, time: 100}]],
      ]))
    this.world.addEntity(makePlayerEntity())

    // 敵
    SpriteDef.defineSpriteDef('tulip', 4,
    new Map([
      ['standRight', [0]],
      ['runRight', [{idx: 0, time: 100}, {idx: 1, time: 100}]],
      ['standLeft', [2]],
      ['runLeft', [{idx: 2, time: 100}, {idx: 3, time: 100}]],
    ]))

    // カメラ
    this.world.addEntity(makeCameraEntity())
  }

  public exec() {
    this.world.execute()
  }

  public getNextScene() {
    return this
  }
}

class SpriteDef {
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

    textures = new Array<Texture>()
    for (let x = 0; x < num; x++) {
      const texture = new Texture(base, new Rectangle(x * 16, 0, 16, 16))
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


const makeGroundEntity = (id: number, x: number, y: number): Entity => {
  const ground = new Entity()
  ground.addComponent(new Transform(x * 16, y * 16))
  ground.addComponent(new Layer('Ground'))

  const def = SpriteDef.getDef('ground')

  switch (id) {
    case 0:
      ground.addComponent(new SpriteComponent(def, 'wall'))
      ground.addComponent(new Collider({w: 16, h: 16}))
      break
    case 1:
      ground.addComponent(new SpriteComponent(def, 'tile'))
      break
    case 2:
      ground.addComponent(new SpriteComponent(def, 'none'))
      ground.addComponent(new SoilComponent())

      {
        const a = ground.getComponent(SoilComponent.name) as SoilComponent
        a.state = 'seed'
      }
  }
  return ground
}

const makePlayerEntity = (): Entity => {
  const player = new Entity()
  player.addComponent(new SpriteComponent(SpriteDef.getDef('player'), 'standRight'))
  player.addComponent(new Transform(16, 16))
  player.addComponent(new PlayerComponent('stand'))
  player.addComponent(new Deadable(false))
  player.addComponent(new Collider({w: 16, h: 16}))
  player.addComponent(new Layer('Movable'))
  player.addComponent(new HorizontalDirection('Right'))
  return player
}

const makeCameraEntity = (): Entity => {
  const camera = new Entity()
  camera.addComponent(new CameraComponent())
  camera.addComponent(new Transform(0, 0))
  return camera
}

export const makeEnemyCoreEntity = (): Entity => {
  const enemy = new Entity()
  enemy.addComponent(new Transform(0, 0))
  enemy.addComponent(new Deadable(false))
  enemy.addComponent(new Collider( {w: 16, h: 16} ))
  enemy.addComponent(new Layer('Movable'))
  return enemy
}

export const makeTulipEnemyEntity = (): Entity => {
  const tulipEnemy = makeEnemyCoreEntity()
  tulipEnemy.addComponent(new SpriteComponent(SpriteDef.getDef('tulip'), 'standRight'))
  tulipEnemy.addComponent(new ChasePlayerComponent(0.5))
  tulipEnemy.addComponent(new HorizontalDirection('Right'))
  return tulipEnemy
}
