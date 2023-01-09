import { Scene } from '@shrimp/scene'
import { World } from '@shrimp/ecs/world'
import { Entity } from '@shrimp/ecs/entity'
import { GameOverScene } from '@game/scenes/gameOverScene'
import { TextStyle } from 'pixi.js'
// graphics
import { SpriteDef } from '@game/graphics/spriteDef'
import { assert } from '@shrimp/utils/assertion'
// system
import { Keyboard } from '@game/system/keyboard'
import { Player as PlayerSystem } from '@game/system/player'
import { Draw } from '@game/system/draw'
import { Collision } from '@game/system/collision'
import { Camera as CameraSystem} from '@game/system/camera'
import { Soil as SoilSystem } from '@game/system/soil'
import { CaptureEnemy as CaptureEnemySystem } from '@game/system/captureEnemy'
import { ChasePlayer as ChasePlayerSystem } from '@game/system/chasePlayer'
import { Purchase } from '@game/system/purchase'
import { AttackToPlayer as AttackToPlayerSystem } from '@game/system/attackToPlayer'
import { Mouse } from '@game/system/mouse'
// component
import { Sprite } from '@game/component/sprite'
import { Transform } from '@game/component/transform'
import { Player } from '@game/component/player'
import { Camera } from '@game/component/camera'
import { Deadable } from '@game/component/deadable'
import { Collider } from '@game/component/collider'
import { Soil } from '@game/component/soil'
import { ChasePlayer } from '@game/component/chasePlayer'
import { HorizontalDirection } from '@game/component/horizontalDirection'
import { Enemy } from '@game/component/enemy'
import { CaptureEnemy}  from '@game/component/captureEnemy'
import { Store } from '@game/component/store'
import { UI } from '@game/component/ui'
import { Text } from '@game/component/text'
import { AttackToPlayer } from '@game/component/attackToPlayer'
import { MouseState } from '@game/component/mouseState'

export class GameScene implements Scene {
  private readonly world: World
  private player: Entity

  public static mapSize = {
      width: 1 + 3 + 5 + 2 + 5 + 3 + 1,
      height: 1 + 3 + 5 + 2 + 5 + 3 + 1 + 12 + 4 - 8
    }

  public constructor() {

    this.world = new World()
    this.world.addSystem(new Keyboard(this.world))
    this.world.addSystem(new ChasePlayerSystem(this.world))
    this.world.addSystem(new Mouse(this.world))
    this.world.addSystem(new AttackToPlayerSystem(this.world))
    this.world.addSystem(new CaptureEnemySystem(this.world))
    this.world.addSystem(new PlayerSystem(this.world))
    this.world.addSystem(new Purchase(this.world))
    this.world.addSystem(new SoilSystem(this.world))
    this.world.addSystem(new Collision(this.world))
    this.world.addSystem(new CameraSystem(this.world))
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
      // [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
      // [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
      // [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
      // [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
      // [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
      // [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
      // [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
      // [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],

      [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,1,2,2,2,2,2,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ]

    // 背景
    SpriteDef.defineSpriteDef('ground', 10,
      new Map([
        ['wall', [0]],
        ['shelf', [1]],
        ['tile', [2]],
        ['nonetulip', [3]],
        ['seedtulip', [4]],
        ['budtulip', [5]],
        ['flowertulip', [6]],
        ['nonemouse', [3]],
        ['seedmouse', [7]],
        ['budmouse', [8]],
        ['flowermouse', [9]],
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
      this.world.addEntity(makeRedLineEntity(16 * (8 + x), 16 * (31 - 8)))
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
    SpriteDef.defineSpriteDef('mouse', 10,
    new Map([
      ['standRight', [0]],
      ['runRight', [{idx: 0, time: 100}, {idx: 1, time: 100}]],
      ['chargeRight', [2]],
      ['attackRight', [3]],
      ['slideRight', [4]],
      ['waitRight', [4]],

      ['standLeft', [5]],
      ['runLeft', [{idx: 5, time: 100}, {idx: 6, time: 100}]],
      ['chargeLeft', [7]],
      ['attackLeft', [8]],
      ['slideLeft', [9]],
      ['waitLeft', [9]],
    ]))

    // UI
    this.world.addEntity(makeHUDEntity())
    SpriteDef.defineSpriteDef('purchaseMenu', 1,
      new Map([
        ['default', [0]]
      ]))
    this.world.addEntity(makePurchaseMenuEntity())

    // カメラ
    this.world.addEntity(makeCameraEntity())
  }

  public exec() {
    this.world.execute()
  }

  public getNextScene(): Scene {
    const player = this.player.getComponent(Player.name) as Player
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
      ground.addComponent(new Sprite(def, 'wall'))
      ground.addComponent(new Collider('Ground', {w: 16, h: 16}))
      break
    case 1:
      ground.addComponent(new Sprite(def, 'shelf'))
      ground.addComponent(new Collider('Ground', {w: 16, h: 16}))
      break
    case 2:
      ground.addComponent(new Sprite(def, 'tile'))
      break
    case 3:
      ground.addComponent(new Sprite(def, 'nonetulip'))
      ground.addComponent(new Collider('Ground', {w: 16, h: 16}))
      ground.addComponent(new Soil())
  }
  return ground
}

const makePlayerEntity = (): Entity => {
  const player = new Entity()
  player.addComponent(new Sprite(SpriteDef.getDef('player'), 'standRight'))
  player.addComponent(new Transform(16 * 9, 16 * (34 - 8)))
  player.addComponent(new Player('stand'))
  player.addComponent(new Deadable(false))
  player.addComponent(new Collider('Movable', {w: 10, h: 15}, {x: 3, y: 1}))
  player.addComponent(new HorizontalDirection('Right'))
  return player
}

const makeCameraEntity = (): Entity => {
  const camera = new Entity()
  camera.addComponent(new Camera())
  camera.addComponent(new Transform(0, 0))
  return camera
}

export const makeEnemyCoreEntity = (): Entity => {
  const enemy = new Entity()
  enemy.addComponent(new Transform(0, 0))
  enemy.addComponent(new Deadable(false))
  enemy.addComponent(new HorizontalDirection('Right'))
  return enemy
}

export const makeTulipEnemyEntity = (enemyCore: Entity): Entity => {
  if (enemyCore.hasComponent(Enemy.name)) {
    const enemy = enemyCore.getComponent(Enemy.name) as Enemy
    if (enemy.seedType === 'tulip') {
      return enemyCore
    }
    enemy.seedType = 'tulip'
  } else {
    enemyCore.addComponent(new Enemy('tulip'))
  }
  if (enemyCore.hasComponent(Sprite.name)) {
    const sprite = enemyCore.getComponent(Sprite.name) as Sprite
    sprite.remomveSprite()
    enemyCore.removeComponent(Sprite.name)
  }
  enemyCore.addComponent(new Sprite(SpriteDef.getDef('tulip'), 'standRight'))

  if (enemyCore.hasComponent(AttackToPlayer.name)) {
    enemyCore.removeComponent(AttackToPlayer.name)
  }

  if (enemyCore.hasComponent(MouseState.name)) {
    enemyCore.removeComponent(MouseState.name)
  }

  if (enemyCore.hasComponent(ChasePlayer.name)) {
    const chasePlayer = enemyCore.getComponent(ChasePlayer.name) as ChasePlayer
    chasePlayer.speed = 0.3
  } else {
    enemyCore.addComponent(new ChasePlayer(0.3))
  }
  if (enemyCore.hasComponent(Collider.name)) {
    const collider = enemyCore.getComponent(Collider.name) as Collider
    collider.size.w = 8
    collider.size.h = 9
    collider.anchor.x = 4
    collider.anchor.y = 7
  } else {
    enemyCore.addComponent(new Collider('Movable',  { w: 8, h: 9 }, { x: 4, y: 7 } ))
  }
  return enemyCore
}

export const makeMouseEnemyEntity = (enemyCore: Entity): Entity => {
  if (enemyCore.hasComponent(Enemy.name)) {
    const enemy = enemyCore.getComponent(Enemy.name) as Enemy
    if (enemy.seedType === 'mouse') {
      return enemyCore
    }
    enemy.seedType = 'mouse'
  } else {
    enemyCore.addComponent(new Enemy('mouse'))
  }

  if (enemyCore.hasComponent(Sprite.name)) {
    const sprite = enemyCore.getComponent(Sprite.name) as Sprite
    sprite.remomveSprite()
    enemyCore.removeComponent(Sprite.name)
  }
  enemyCore.addComponent(new Sprite(SpriteDef.getDef('mouse'), 'standRight'))

  if (enemyCore.hasComponent(ChasePlayer.name)) {
    enemyCore.removeComponent(ChasePlayer.name)
  }

  if (enemyCore.hasComponent(AttackToPlayer.name)) {
    enemyCore.removeComponent(AttackToPlayer.name)
  }

  // seedTypeがmouseでないのでMouseStateは確実に持っていない
  assert(!enemyCore.hasComponent(MouseState.name), 'non mouse entity has MouseState')
  enemyCore.addComponent(new MouseState())

  if (enemyCore.hasComponent(Collider.name)) {
    const collider = enemyCore.getComponent(Collider.name) as Collider
    collider.size.w = 7
    collider.size.h = 9
    collider.anchor.x = 5
    collider.anchor.y = 7
  } else {
    enemyCore.addComponent(new Collider('Movable', {w: 7, h: 9}, {x: 5, y: 7} ))
  }
  return enemyCore

}

const makeRedLineEntity = (x: number, y: number): Entity => {
  const redline = new Entity()
  redline.addComponent(new Sprite(SpriteDef.getDef('redline'), 'default'))
  redline.addComponent(new Transform(x, y))
  redline.addComponent(new CaptureEnemy())
  redline.addComponent(new Collider('Movable', {w: 16, h: 16}, {x: 0, y : 4}))
  return redline
}

const makeSeenManEntity = (): Entity => {
  const seedman = new Entity()
  seedman.addComponent(new Sprite(SpriteDef.getDef('seedman'), 'default'))
  seedman.addComponent(new Transform(7 * 16, (34 - 8) * 16))
  seedman.addComponent(new Store())
  seedman.addComponent(new Collider('Movable', {w: 16, h: 16}))
  return seedman
}

const makeHUDEntity = (): Entity => {
  const seedCountUI = new Entity()
  seedCountUI.addComponent(new Transform(0, 0))
  seedCountUI.addComponent(new UI('hud'))

  const style = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 12,
    fill: ['#FFFFFF'],
  });

  seedCountUI.addComponent(new Text('', style))
  return seedCountUI
}

const makePurchaseMenuEntity = (): Entity => {
  const purchaseMenu = new Entity()
  purchaseMenu.addComponent(new Transform(128, 88))
  purchaseMenu.addComponent(new UI('purchaseMenu'))
  purchaseMenu.addComponent(new Deadable(false))
  purchaseMenu.addComponent(new Sprite(SpriteDef.getDef('purchaseMenu'), 'default'))

  const style = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 12,
    fill: ['#FFFFFF'],
  });

  purchaseMenu.addComponent(new Text('1: $5 small , 2: $15 middle', style, {x: 4, y: 0}))
  return purchaseMenu
}
