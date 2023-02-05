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
import { Button as ButtonSystem } from '@game/system/button'
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
import { AvoidEnemy } from '@game/system/avoidEnemy'
import { TulipState } from '@game/component/tulipState'
import { Tulip } from '@game/system/tulip'
import { Button } from '@game/component/button'
import { Cursor } from '@game/component/cursor'

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
    this.world.addSystem(new ButtonSystem(this.world))
    this.world.addSystem(new Mouse(this.world))
    this.world.addSystem(new Tulip(this.world))
    this.world.addSystem(new ChasePlayerSystem(this.world))
    this.world.addSystem(new AttackToPlayerSystem(this.world))
    this.world.addSystem(new AvoidEnemy(this.world))
    this.world.addSystem(new CaptureEnemySystem(this.world))
    this.world.addSystem(new PlayerSystem(this.world))
    this.world.addSystem(new Purchase(this.world))
    this.world.addSystem(new SoilSystem(this.world))
    this.world.addSystem(new Collision(this.world))
    this.world.addSystem(new CameraSystem(this.world))
    this.world.addSystem(new Draw(this.world))

    // マップ定義
    const map = [
      [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
      [0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0],
      [0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0],
      [0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0],
      [0,3,3,3,4,4,4,4,4,3,3,4,4,4,4,4,3,3,3,0],
      [0,3,3,3,4,4,4,4,4,3,3,4,4,4,4,4,3,3,3,0],
      [0,3,3,3,4,4,4,4,4,3,3,4,4,4,4,4,3,3,3,0],
      [0,3,3,3,4,4,4,4,4,0,0,4,4,4,4,4,3,3,3,0],
      [0,3,3,3,4,4,4,4,4,1,1,4,4,4,4,4,3,3,3,0],
      [0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0],
      [0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0],
      [0,3,3,3,4,4,4,4,4,3,3,4,4,4,4,4,3,3,3,0],
      [0,3,3,3,4,4,4,4,4,3,3,4,4,4,4,4,3,3,3,0],
      [0,3,3,3,4,4,4,4,4,3,3,4,4,4,4,4,3,3,3,0],
      [0,3,3,3,4,4,4,4,4,3,3,4,4,4,4,4,3,3,3,0],
      [0,3,3,3,4,4,4,4,4,3,3,4,4,4,4,4,3,3,3,0],
      [0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0],
      [0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0],
      [0,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,0],
      [0,0,0,0,0,0,3,3,3,3,3,3,3,3,0,0,0,0,0,0],

      [0,0,0,0,0,0,0,3,3,3,3,3,3,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0],
      // [0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0],
      // [0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0],
      // [0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0],
      // [0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0],
      // [0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0],
      // [0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0],
      // [0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0],
      // [0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0],

      [0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,3,3,3,3,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,2,3,3,3,3,3,0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
    ]

    // 背景
    SpriteDef.defineSpriteDef('ground', 11,
      new Map([
        ['ceil', [0]],
        ['wall', [1]],
        ['shelf', [2]],
        ['tile', [3]],
        ['nonetulip', [4]],
        ['seedtulip', [5]],
        ['budtulip', [6]],
        ['flowertulip', [7]],
        ['nonemouse', [4]],
        ['seedmouse', [8]],
        ['budmouse', [9]],
        ['flowermouse', [10]],
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

    // カーソル
    SpriteDef.defineSpriteDef('cursor', 10,
      new Map([
        ['default', [
          {idx: 0, time: 300},
          {idx: 1, time: 20},
          {idx: 2, time: 20},
          {idx: 3, time: 20},
          {idx: 4, time: 20},
          {idx: 5, time: 300},
          {idx: 6, time: 20},
          {idx: 7, time: 20},
          {idx: 8, time: 20},
          {idx: 9, time: 20},
        ]]
      ]))
    this.world.addEntity(makeCursorEntity())
    

    // ボタン
    SpriteDef.defineSpriteDef('speaker', 4,
      new Map([
        ['default', [0]],
        ['bell', [{idx: 1, time:50}, {idx: 2, time:50}, {idx: 3, time:50}]],
        ]))
    this.world.addEntity(makeButtonEntity())

    // 売店
    SpriteDef.defineSpriteDef('seedman', 1,
      new Map([
        ['default', [0]]
      ]))
    this.world.addEntity(makeSeedManEntity())


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
    SpriteDef.defineSpriteDef('tulip', 6,
    new Map([
      ['standRight', [0]],
      ['runRight', [{idx: 0, time: 100}, {idx: 1, time: 100}]],
      ['standLeft', [2]],
      ['runLeft', [{idx: 2, time: 100}, {idx: 3, time: 100}]],
      ['sleep', [{idx: 4, time: 500}, {idx: 5, time: 500}]]
    ]))
    SpriteDef.defineSpriteDef('mouse', 12,
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
      ['sleep', [{idx: 10, time: 500}, {idx: 11, time: 500}]]
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
    const player = this.player.getComponent(Player)
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
      ground.addComponent(new Sprite(def, 'ceil'))
      ground.addComponent(new Collider('Ground', {w: 16, h: 16}))
      break
    case 1:
      ground.addComponent(new Sprite(def, 'wall'))
      ground.addComponent(new Collider('Ground', {w: 16, h: 16}))
      break
    case 2:
      ground.addComponent(new Sprite(def, 'shelf'))
      ground.addComponent(new Collider('Ground', {w: 16, h: 16}))
      break
    case 3:
      ground.addComponent(new Sprite(def, 'tile'))
      break
    case 4:
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
  if (enemyCore.hasComponent(Enemy)) {
    const enemy = enemyCore.getComponent(Enemy)
    if (enemy.seedType === 'tulip') {
      return enemyCore
    }
    enemy.seedType = 'tulip'
  } else {
    enemyCore.addComponent(new Enemy('tulip'))
  }
  if (enemyCore.hasComponent(Sprite)) {
    const sprite = enemyCore.getComponent(Sprite)
    sprite.remomveSprite()
    enemyCore.removeComponent(Sprite)
  }
  enemyCore.addComponent(new Sprite(SpriteDef.getDef('tulip'), 'sleep'))

  if (enemyCore.hasComponent(ChasePlayer)) {
    enemyCore.removeComponent(ChasePlayer)
  }

  if (enemyCore.hasComponent(AttackToPlayer)) {
    enemyCore.removeComponent(AttackToPlayer)
  }

  if (enemyCore.hasComponent(MouseState)) {
    enemyCore.removeComponent(MouseState)
  }

  // seedTypeがtulipでないのでTulipStateは確実に持っていない
  assert(!enemyCore.hasComponent(TulipState), 'non mouse entity has TulipState')
  enemyCore.addComponent(new TulipState())

  if (enemyCore.hasComponent(Collider)) {
    const collider = enemyCore.getComponent(Collider)
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
  if (enemyCore.hasComponent(Enemy)) {
    const enemy = enemyCore.getComponent(Enemy)
    if (enemy.seedType === 'mouse') {
      return enemyCore
    }
    enemy.seedType = 'mouse'
  } else {
    enemyCore.addComponent(new Enemy('mouse'))
  }

  if (enemyCore.hasComponent(Sprite)) {
    const sprite = enemyCore.getComponent(Sprite)
    sprite.remomveSprite()
    enemyCore.removeComponent(Sprite)
  }
  enemyCore.addComponent(new Sprite(SpriteDef.getDef('mouse'), 'sleep'))

  if (enemyCore.hasComponent(ChasePlayer)) {
    enemyCore.removeComponent(ChasePlayer)
  }

  if (enemyCore.hasComponent(AttackToPlayer)) {
    enemyCore.removeComponent(AttackToPlayer)
  }

  if (enemyCore.hasComponent(TulipState)) {
    enemyCore.removeComponent(TulipState)
  }

  // seedTypeがmouseでないのでMouseStateは確実に持っていない
  assert(!enemyCore.hasComponent(MouseState), 'non mouse entity has MouseState')
  enemyCore.addComponent(new MouseState())

  if (enemyCore.hasComponent(Collider)) {
    const collider = enemyCore.getComponent(Collider)
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

const makeButtonEntity = (): Entity => {
  const button = new Entity()
  button.addComponent(new Sprite(SpriteDef.getDef('speaker'), 'default'))
  button.addComponent(new Transform(152, 8 * 16))
  button.addComponent(new Button())
  button.addComponent(new Collider('Movable', {w: 16, h: 4}, {x: 0, y : 21}))
  return button
}


const makeSeedManEntity = (): Entity => {
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

const makeCursorEntity = (): Entity => {
  const cursor = new Entity()
  cursor.addComponent(new Transform(0, 0))
  cursor.addComponent(new Cursor())
  cursor.addComponent(new Deadable(false))
  cursor.addComponent(new Sprite(SpriteDef.getDef('cursor'), 'default'))
  return cursor
}

const makePurchaseMenuEntity = (): Entity => {
  const purchaseMenu = new Entity()
  purchaseMenu.addComponent(new Transform(80, 76))
  purchaseMenu.addComponent(new UI('purchaseMenu'))
  purchaseMenu.addComponent(new Deadable(false))
  purchaseMenu.addComponent(new Sprite(SpriteDef.getDef('purchaseMenu'), 'default'))

  const style = new TextStyle({
    fontFamily: 'Arial',
    fontSize: 12,
    fill: ['#FFFFFF'],
  });

  purchaseMenu.addComponent(new Text('key 1   $5   small seed\nkey 2 $15 middle seed', style, {x: 4, y: 0}))
  return purchaseMenu
}
