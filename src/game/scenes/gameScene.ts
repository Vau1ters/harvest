import { Scene } from '@shrimp/scene'
import { World } from '@shrimp/ecs/world'
import { Entity } from '@shrimp/ecs/entity'
// graphics
import { SpriteDef } from '@game/graphics/spriteDef'
// system
import { Keyboard } from '@game/system/keyboard'
import { Player } from '@game/system/player'
import { Draw } from '@game/system/draw'
import { Collision } from '@game/system/collision'
import { Camera } from '@game/system/camera'
import { Soil } from '@game/system/soil'
import { CaptureEnemy } from '@game/system/captureEnemy'
// component
import { Sprite as SpriteComponent } from '@game/component/sprite'
import { Transform } from '@game/component/transform'
import { Player as PlayerComponent } from '@game/component/player'
import { Camera as CameraComponent } from '@game/component/camera'
import { Deadable } from '@game/component/deadable'
import { Collider } from '@game/component/collider'
import { Soil as SoilComponent } from '@game/component/soil'
import { ChasePlayer as ChasePlayerComponent } from '@game/component/chasePlayer'
import { HorizontalDirection } from '@game/component/horizontalDirection'
import { ChasePlayer } from '@game/system/chasePlayer'
import { Enemy } from '@game/component/enemy'
import { CaptureEnemy as CaptureEnemyComponent} from '@game/component/captureEnemy'
import { Store } from '@game/component/store'
import { Purchase } from '@game/system/purchase'
import { GameOverScene } from '@game/scenes/gameOverScene'

export class GameScene implements Scene {
  private readonly world: World
  private player: Entity

  public static mapSize = {
      width: 1 + 3 + 5 + 2 + 5 + 3 + 1,
      height: 1 + 3 + 5 + 2 + 5 + 3 + 1 + 12 + 4
    }

  public constructor() {

    this.world = new World()
    this.world.addSystem(new Keyboard(this.world))
    this.world.addSystem(new ChasePlayer(this.world))
    this.world.addSystem(new CaptureEnemy(this.world))
    this.world.addSystem(new Player(this.world))
    this.world.addSystem(new Purchase(this.world))
    this.world.addSystem(new Soil(this.world))
    this.world.addSystem(new Collision(this.world))
    this.world.addSystem(new Camera(this.world))
    this.world.addSystem(new Draw(this.world))

    // マップ定義
    const map = [
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
      [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
      [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
      [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
      [0,2,2,2,3,3,3,3,3,2,2,3,3,3,3,3,2,2,2,0],
      [0,2,2,2,3,3,3,3,3,2,2,3,3,3,3,3,2,2,2,0],
      [0,2,2,2,3,3,3,3,3,2,2,3,3,3,3,3,2,2,2,0],
      [0,2,2,2,3,3,3,3,3,2,2,3,3,3,3,3,2,2,2,0],
      [0,2,2,2,3,3,3,3,3,2,2,3,3,3,3,3,2,2,2,0],
      [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
      [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
      [0,2,2,2,3,3,3,3,3,2,2,3,3,3,3,3,2,2,2,0],
      [0,2,2,2,3,3,3,3,3,2,2,3,3,3,3,3,2,2,2,0],
      [0,2,2,2,3,3,3,3,3,2,2,3,3,3,3,3,2,2,2,0],
      [0,2,2,2,3,3,3,3,3,2,2,3,3,3,3,3,2,2,2,0],
      [0,2,2,2,3,3,3,3,3,2,2,3,3,3,3,3,2,2,2,0],
      [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
      [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
      [0,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,0],
      [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],

      [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],

      [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,1,2,2,2,2,2,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ]

    // 背景
    SpriteDef.defineSpriteDef('ground', 7,
      new Map([
        ['wall', [0]],
        ['shelf', [1]],
        ['tile', [2]],
        ['none', [3]],
        ['seed', [4]],
        ['bud', [5]],
        ['flower', [6]]
      ]))

    for (let y = 0; y < GameScene.mapSize.height; y++) {
      for (let x = 0; x < GameScene.mapSize.width; x++) {
        const ground = makeGroundEntity(map[y][x], x, y)
        this.world.addEntity(ground)
      }
    }

    // 赤線
    SpriteDef.defineSpriteDef('redline', 1,
      new Map([
        ['default', [0]]
      ]))
    for (let x = 0; x < 4; x++) {
      this.world.addEntity(makeRedLineEntity(16 * (8 + x), 16 * 31))
    }

    // 売店
    SpriteDef.defineSpriteDef('seedman', 1,
      new Map([
        ['default', [0]]
      ]))
    this.world.addEntity(makeSeenManEntity())


    // プレイヤー
    SpriteDef.defineSpriteDef('player', 4,
      new Map([
      ['standRight', [0]],
      ['runRight', [{idx: 0, time: 100}, {idx: 1, time: 100}]],
      ['standLeft', [2]],
      ['runLeft', [{idx: 2, time: 100}, {idx: 3, time: 100}]],
      ['knockbackRight', [1]],
      ['knockbackLeft', [2]],
      ]))
    this.player = makePlayerEntity()
    this.world.addEntity(this.player)

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

  public getNextScene(): Scene {
    const player = this.player.getComponent(PlayerComponent.name) as PlayerComponent
    if (player.hp === 0) {
      return new GameOverScene(this.world.entityIterator)
    } else {
      return this
    }
  }
}


const makeGroundEntity = (id: number, x: number, y: number): Entity => {
  const ground = new Entity()
  ground.addComponent(new Transform(x * 16, y * 16))

  const def = SpriteDef.getDef('ground')

  switch (id) {
    case 0:
      ground.addComponent(new SpriteComponent(def, 'wall'))
      ground.addComponent(new Collider('Ground', {w: 16, h: 16}))
      break
    case 1:
      ground.addComponent(new SpriteComponent(def, 'shelf'))
      ground.addComponent(new Collider('Ground', {w: 16, h: 16}))
      break
    case 2:
      ground.addComponent(new SpriteComponent(def, 'tile'))
      break
    case 3:
      ground.addComponent(new SpriteComponent(def, 'none'))
      ground.addComponent(new Collider('Ground', {w: 16, h: 16}))
      ground.addComponent(new SoilComponent())
  }
  return ground
}

const makePlayerEntity = (): Entity => {
  const player = new Entity()
  player.addComponent(new SpriteComponent(SpriteDef.getDef('player'), 'standRight'))
  player.addComponent(new Transform(16 * 9, 16 * 34))
  player.addComponent(new PlayerComponent('stand'))
  player.addComponent(new Deadable(false))
  player.addComponent(new Collider('Movable', {w: 10, h: 15}, {x: 3, y: 1}))
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
  return enemy
}

export const makeTulipEnemyEntity = (): Entity => {
  const tulipEnemy = makeEnemyCoreEntity()
  tulipEnemy.addComponent(new SpriteComponent(SpriteDef.getDef('tulip'), 'standRight'))
  tulipEnemy.addComponent(new ChasePlayerComponent(0.3))
  tulipEnemy.addComponent(new HorizontalDirection('Right'))
  tulipEnemy.addComponent(new Collider('Movable',  { w: 9, h: 15 }, { x: 4, y: 1 } ))
  tulipEnemy.addComponent(new Enemy('tulip'))
  return tulipEnemy
}

const makeRedLineEntity = (x: number, y: number): Entity => {
  const redline = new Entity()
  redline.addComponent(new SpriteComponent(SpriteDef.getDef('redline'), 'default'))
  redline.addComponent(new Transform(x, y))
  redline.addComponent(new CaptureEnemyComponent())
  redline.addComponent(new Collider('Movable', {w: 16, h: 16}, {x: 0, y : 4}))
  return redline
}

const makeSeenManEntity = (): Entity => {
  const seedman = new Entity()
  seedman.addComponent(new SpriteComponent(SpriteDef.getDef('seedman'), 'default'))
  seedman.addComponent(new Transform(7 * 16, 34 * 16))
  seedman.addComponent(new Store())
  seedman.addComponent(new Collider('Movable', {w: 16, h: 16}))
  return seedman
}

