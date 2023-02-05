import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family } from '@shrimp/ecs/family'
import { Sprite } from '@game/component/sprite'
import { Player } from '@game/component/player'
import { HorizontalDirection } from '@game/component/horizontalDirection'
import { Keyboard } from '@game/system/keyboard'
import { Store } from '@game/component/store'
import { Collider } from '@game/component/collider'
import { SeedType } from '@game/component/soil'
import { assert } from '@shrimp/utils/assertion'
import { UI } from '@game/component/ui'
import { Transform } from '@game/component/transform'
import { Entity } from '@shrimp/ecs/entity'
import { Deadable } from '@game/component/deadable'

const priceMap:Map<SeedType, number>  = new Map([
  ['tulip', 5],
  ['mouse', 15],
])

export class Purchase extends System {
  private playerFamily = new Family([Player, Sprite, HorizontalDirection])
  private seedmanFamily = new Family([Store, Collider])
  private purchaseMenuFamily = new Family([UI, Transform])
  private purchaseMenu: Entity | undefined = undefined

  public constructor(world: World) {
    super(world)
    this.playerFamily.init(this.world)
    this.seedmanFamily.init(this.world)
    this.purchaseMenuFamily.init(this.world)
 
  }

  public init(): void {
  }

  public execute(): void {
    if (!this.purchaseMenu) {
      for (const purchaseMenu of this.purchaseMenuFamily.entityIterator) {
        const ui = purchaseMenu.getComponent(UI)
        if (ui.uiType === 'purchaseMenu') {
          this.purchaseMenu = purchaseMenu
          break
        }
      }
    }

    const playerEntity = this.playerFamily.getSingleton()
    const seedman = this.seedmanFamily.getSingleton()
    const seedmanCollider = seedman.getComponent(Collider)
    if (!seedmanCollider.collided.has(playerEntity)) {
      if (this.purchaseMenu) {
        const deadable = this.purchaseMenu.getComponent(Deadable)
        deadable.isDead = true
      }
      return
    }
    if (this.purchaseMenu) {
      const deadable = this.purchaseMenu.getComponent(Deadable)
      deadable.isDead = false
    }
    const player = playerEntity.getComponent(Player)

    let buySeed: SeedType
    const key1 = Keyboard.keysTrigger.get('1')
    const key2 = Keyboard.keysTrigger.get('2')
    if (key1 !== undefined && (key1 === 1 || key1 > 30)) {
      buySeed = 'tulip'
    } else if (key2 !== undefined && (key2 === 1 || key2 > 30)) {
      buySeed = 'mouse'
    } else {
      return
    }


    const price = priceMap.get(buySeed)
    assert(price, 'undefined seed type')
    if (player.money >= price) {
      player.money -= price
      let num = player.seed.get(buySeed)
      if (!num) {
        num = 0
      }
      num++
      player.seed.set(buySeed, num)
    }
  }
}
