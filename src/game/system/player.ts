import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family, FamilyBuilder } from '@shrimp/ecs/family'
import { Transform } from '@game/component/transform'
import { Sprite } from '@game/component/sprite'
import { Player as PlayerComponent } from '@game/component/player'
import { Keyboard } from '@game/system/keyboard'
import { HorizontalDirection } from '@game/component/horizontalDirection'
import { Collider } from '@game/component/collider'
import { Enemy } from '@game/component/enemy'
import { Text } from '@game/component/text'
import { calcLength, calcLengthSq } from '@shrimp/math/math'
import { Soil } from '@game/component/soil'
import { Entity } from '@shrimp/ecs/entity'
import { assert } from '@shrimp/utils/assertion'
import { UI } from '@game/component/ui'

const INVINSIBLE_TIME = 30
const KNOCKBACK_TIME = 5

export class Player extends System {
  private family: Family
  private hudFamily: Family

  public constructor(world: World) {
    super(world)
    this.family = new FamilyBuilder(this.world).include([Transform.name, PlayerComponent.name, Sprite.name, HorizontalDirection.name, Collider.name]).build()
    this.hudFamily = new FamilyBuilder(this.world).include([Transform.name, UI.name, Text.name]).build()
  }

  public init(): void {
  }

  public execute(): void {
    const entity = this.family.getSingleton()
    const trans = entity.getComponent(Transform.name) as Transform
    const sprite = entity.getComponent(Sprite.name) as Sprite
    const player = entity.getComponent(PlayerComponent.name) as PlayerComponent
    const horizontalDirection = entity.getComponent(HorizontalDirection.name) as HorizontalDirection

    player.state = 'stand'

    const collider = entity.getComponent(Collider.name) as Collider
    let nearestSoil: Entity | undefined = undefined
    let nearestSoilLengthSq = 8 * 8
    for (const collided of collider.collided) {
      // 敵との衝突
      if (collided.hasComponent(Enemy.name) && player.invinsibleTime > INVINSIBLE_TIME) {
        player.hp--
        player.invinsibleTime = 0

        const enemyTrans = collided.getComponent(Transform.name) as Transform
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
      if (collided.hasComponent(Soil.name)) {
        const soilTrans = collided.getComponent(Transform.name) as Transform
        const lengthSq = calcLengthSq(soilTrans.x - trans.x, soilTrans.y - trans.y)
        if (lengthSq < nearestSoilLengthSq) {
          nearestSoil = collided
          nearestSoilLengthSq = lengthSq
        }
      }
    }
    if (nearestSoil) {
      const soil = nearestSoil.getComponent(Soil.name) as Soil
      if (Keyboard.keysTrigger.get('1') === 1) {
        const seedNum = player.seed.get('tulip')
        assert(seedNum !== undefined, 'seed num undefined')
        if (soil.state === 'none' && seedNum > 0) {
          soil.state = 'seed'
          soil.seed = 'tulip'
          player.seed.set('tulip', seedNum - 1)
        }
      }
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
      const ui = hud.getComponent(UI.name) as UI
      if (ui.uiType === 'hud') {
        const text = hud.getComponent(Text.name) as Text
        const seedNum = player.seed.get('tulip')
        assert(seedNum !== undefined, 'seed num undefined')
        text.changeText(`money: $${player.money}, seed num: ${seedNum}, life: ${player.hp}`)
        break
      }
    }
  }
}
