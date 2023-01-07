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
// component
import { Sprite as SpriteComponent } from '@game/component/sprite'
import { Transform } from '@game/component/transform'
import { Player as PlayerComponent } from '@game/component/player'
import { Deadable } from '@game/component/deadable'
import { Collider } from '@game/component/collider'
import { Layer } from '@game/component/layer'

export class GameScene implements Scene {
  private readonly world: World

  public static mapSize: { width: number, height: number }
 
  private getBaseTexture(name: string): BaseTexture {
    const { default: url } = require(`/res/${name}.png`) // eslint-disable-line  @typescript-eslint/no-var-requires
    return BaseTexture.from(url)
  }

  public constructor() {
    GameScene.mapSize = {
      width: 10,
      height: 10
    }

    this.world = new World()
    this.world.addSystem(new Keyboard(this.world))
    this.world.addSystem(new Player(this.world))
    this.world.addSystem(new Collision(this.world))
    this.world.addSystem(new Draw(this.world))

    // 背景
    const baseGround = this.getBaseTexture('ground')

    const groundNum = 2
    const groundTextures = new Array<Texture>()
    for (let x = 0; x < groundNum; x++) {
      const texture = new Texture(baseGround, new Rectangle(x * 16, 0, 16, 16))
      groundTextures.push(texture)
    }

    for (let y = 0; y < GameScene.mapSize.height; y++) {
      for (let x = 0; x < GameScene.mapSize.width; x++) {
        const ground = new Entity()
        const sprite = new Sprite(groundTextures[0])
        ground.addComponent(new SpriteComponent(sprite))
        application.stage.addChild(sprite)
        ground.addComponent(new Transform(x * 16, y * 16))
        if (x == 2) {
          ground.addComponent(new Collider({w: 16, h: 16}))
        }
        ground.addComponent(new Layer('Ground'))
        this.world.addEntity(ground)
      }
    }

    // プレイヤー
    const basePlayer = this.getBaseTexture('player')

    const player = new Entity()
    const sprite = new Sprite(new Texture(basePlayer, new Rectangle(0, 0, 16, 16)))
    player.addComponent(new SpriteComponent(sprite))
    application.stage.addChild(sprite)
    player.addComponent(new Transform(16, 16))
    player.addComponent(new PlayerComponent())
    player.addComponent(new Deadable(false))
    player.addComponent(new Collider({w: 16, h: 16}))
    player.addComponent(new Layer('Movable'))
    this.world.addEntity(player)
  }

  public exec() {
    this.world.execute()
  }

  public getNextScene() {
    return this
  }
}
