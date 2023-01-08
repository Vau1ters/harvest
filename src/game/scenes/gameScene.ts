import { Scene } from '@shrimp/scene'
import { application } from'@shrimp/application'
import { BaseTexture, Texture, Rectangle, Sprite } from 'pixi.js'
import { World } from '@shrimp/ecs/world'
import { Entity } from '@shrimp/ecs/entity'
// system
import { Keyboard } from '@game/system/keyboard'
import { Player } from '@game/system/player'
import { Draw } from '@game/system/draw'
import { Collision } from '@game/system/collision'
import { Camera } from '@game/system/camera'
// component
import { Sprite as SpriteComponent } from '@game/component/sprite'
import { Transform } from '@game/component/transform'
import { Player as PlayerComponent } from '@game/component/player'
import { Camera as CameraComponent } from '@game/component/camera'
import { Deadable } from '@game/component/deadable'
import { Collider } from '@game/component/collider'
import { Layer } from '@game/component/layer'

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
    this.world.addSystem(new Player(this.world))
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
    const baseGround = getBaseTexture('ground')

    const groundNum = 4
    const groundTextures = new Array<Texture>()
    for (let x = 0; x < groundNum; x++) {
      const texture = new Texture(baseGround, new Rectangle(x * 16, 0, 16, 16))
      groundTextures.push(texture)
    }

    for (let y = 0; y < GameScene.mapSize.height; y++) {
      for (let x = 0; x < GameScene.mapSize.width; x++) {
        const ground = makeGroundEntity(map[y][x], x, y, groundTextures)
        this.world.addEntity(ground)
      }
    }

    // プレイヤー
    this.world.addEntity(makePlayerEntity())

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

const getBaseTexture = (name: string): BaseTexture => {
    const { default: url } = require(`/res/${name}.png`) // eslint-disable-line  @typescript-eslint/no-var-requires
    return BaseTexture.from(url)
  }

const makeGroundEntity = (id: number, x: number, y: number, groundTextures: Array<Texture>): Entity => {
  const ground = new Entity()
  const sprite = new Sprite(groundTextures[id])
  ground.addComponent(new SpriteComponent(sprite))
  application.stage.addChild(sprite)
  ground.addComponent(new Transform(x * 16, y * 16))
  if (id == 0) {
    ground.addComponent(new Collider({w: 16, h: 16}))
  }
  ground.addComponent(new Layer('Ground'))
  return ground
}

const makePlayerEntity = (): Entity => {
  const basePlayer = getBaseTexture('player')

  const player = new Entity()
  const sprite = new Sprite(new Texture(basePlayer, new Rectangle(0, 0, 16, 16)))
  player.addComponent(new SpriteComponent(sprite))
  application.stage.addChild(sprite)
  player.addComponent(new Transform(16, 16))
  player.addComponent(new PlayerComponent())
  player.addComponent(new Deadable(false))
  player.addComponent(new Collider({w: 16, h: 16}))
  player.addComponent(new Layer('Movable'))
  return player
}

const makeCameraEntity = (): Entity => {
  const camera = new Entity()
  camera.addComponent(new CameraComponent())
  camera.addComponent(new Transform(0, 0))
  return camera
}
