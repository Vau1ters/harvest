import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family } from '@shrimp/ecs/family'
import { Transform } from '@game/component/transform'
import { Sprite } from '@game/component/sprite'
import { Player as PlayerComponent } from '@game/component/player'
import { Keyboard } from '@game/system/keyboard'
import { HorizontalDirection } from '@game/component/horizontalDirection'
import { Collider } from '@game/component/collider'
import { Enemy } from '@game/component/enemy'
import { Text } from '@game/component/text'
import { calcLength, calcLengthSq } from '@shrimp/math/math'
import { SeedType, Soil } from '@game/component/soil'
import { Entity } from '@shrimp/ecs/entity'
import { assert } from '@shrimp/utils/assertion'
import { UI } from '@game/component/ui'
import { Cursor } from '@game/component/cursor'
import { Deadable } from '@game/component/deadable'

const INVINSIBLE_TIME = 60
const KNOCKBACK_TIME = 5

export class Player extends System {
  private family = new Family([Transform, PlayerComponent, Sprite, HorizontalDirection, Collider])
  private hudFamily = new Family([Transform, UI, Text])
  private cursorFamily = new Family([Transform, Cursor])

  public constructor(world: World) {
    super(world)
    this.family.init(this.world)
    this.hudFamily.init(this.world)
    this.cursorFamily.init(this.world)
  }

  public init(): void {
  }

  public execute(): void {
    const entity = this.family.getSingleton()
    const trans = entity.getComponent(Transform)
    const sprite = entity.getComponent(Sprite)
    const player = entity.getComponent(PlayerComponent)
    const horizontalDirection = entity.getComponent(HorizontalDirection)

    player.state = 'stand'

    const collider = entity.getComponent(Collider)
    let nearestSoil: Entity | undefined = undefined
    let nearestSoilLengthSq = 12 * 12
    for (const collided of collider.collided) {
      // 敵との衝突
      if (collided.hasComponent(Enemy) && player.invinsibleTime > INVINSIBLE_TIME) {
        player.hp--
        player.invinsibleTime = 0

        const enemyTrans = collided.getComponent(Transform)
        player.knockbackX = trans.x - enemyTrans.x
        player.knockbackY = trans.y - enemyTrans.y
        const length = calcLength(player.knockbackX, player.knockbackY)
        player.knockbackX /= length
        player.knockbackY /= length
        if (player.knockbackX > 0) {
          horizontalDirection.dir = 'Left'
        } else {
          horizontalDirection.dir = 'Right'
        }
        break
      }

      // 土との衝突
      if (collided.hasComponent(Soil)) {
        const soilTrans = collided.getComponent(Transform)
        const lengthSq = calcLengthSq(soilTrans.x - trans.x, soilTrans.y - trans.y)
        if (lengthSq < nearestSoilLengthSq) {
          nearestSoil = collided
          nearestSoilLengthSq = lengthSq
        }
      }
    }
    const cursorEntity = this.cursorFamily.getSingleton()
    const cursorDeadable = cursorEntity.getComponent(Deadable)
    if (nearestSoil) {
      const soil = nearestSoil.getComponent(Soil)
      let seedType: SeedType | undefined = undefined
      if (Keyboard.keys.get('1')) {
        seedType = 'tulip'
      } else if (Keyboard.keys.get('2')) {
        seedType = 'mouse'
      }

      if (seedType !== undefined) {
        const seedNum = player.seed.get(seedType)
        assert(seedNum !== undefined, 'seed num undefined')
        if (soil.state === 'none' && seedNum > 0) {
          soil.state = 'seed'
          soil.seed = seedType
          player.seed.set(seedType, seedNum - 1)
        }
      }

      // カーソル表示
      cursorDeadable.isDead = false
      const cursorTrans = cursorEntity.getComponent(Transform)
      const soilTrans = nearestSoil.getComponent(Transform)
      cursorTrans.x = soilTrans.x
      cursorTrans.y = soilTrans.y
    } else {
      // カーソル非表示
      cursorDeadable.isDead = true
    }

    if (player.invinsibleTime > KNOCKBACK_TIME) {
      if (Keyboard.keys.get('ArrowRight')) {
        horizontalDirection.dir = 'Right'
        trans.x += 1
        player.state = 'run'
      } 
      if (Keyboard.keys.get('ArrowLeft')) {
        horizontalDirection.dir = 'Left'
        trans.x -= 1
        player.state = 'run'
      }
      if (Keyboard.keys.get('ArrowUp')) {
        trans.y -= 1
        player.state = 'run'
      }
      if (Keyboard.keys.get('ArrowDown')) {
        trans.y += 1
        player.state = 'run'
      }
    }

    if (player.invinsibleTime < KNOCKBACK_TIME) {
      player.state = 'knockback'
      trans.x += player.knockbackX * 4
      trans.y += player.knockbackY * 4
    }

    if (player.invinsibleTime < INVINSIBLE_TIME) {
      sprite.sprite.visible = Math.floor(player.invinsibleTime / 2) % 2 === 0
    } else {
      sprite.sprite.visible = true
    }
    player.invinsibleTime++

    sprite.changeAnimation(player.state + horizontalDirection.dir, true)

    for (const hud of this.hudFamily.entityIterator) {
      const ui = hud.getComponent(UI)
      if (ui.uiType === 'hud') {
        const text = hud.getComponent(Text)
        const tulipNum = player.seed.get('tulip')
        assert(tulipNum !== undefined, 'seed num undefined')
        const mouseNum = player.seed.get('mouse')
        assert(mouseNum !== undefined, 'seed num undefined')
        if (nearestSoil) {
        text.changeText(`life ${player.hp}\nmoney $${player.money}\nsmall ${tulipNum}\nmiddle ${mouseNum}\nkey 1 plant small\nkey 2 plant middle`)
        } else {
        text.changeText(`life ${player.hp}\nmoney $${player.money}\nsmall ${tulipNum}\nmiddle ${mouseNum}`)
        }
        break
      }
    }
  }
}
