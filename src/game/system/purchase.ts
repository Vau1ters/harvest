import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family, FamilyBuilder } from '@shrimp/ecs/family'
import { Sprite } from '@game/component/sprite'
import { Player } from '@game/component/player'
import { HorizontalDirection } from '@game/component/horizontalDirection'
import { Keyboard } from '@game/system/keyboard'
import { Store } from '@game/component/store'
import { Collider } from '@game/component/collider'
import { SeedType } from '@game/component/soil'
import { assert } from '@shrimp/utils/assertion'

const priceMap:Map<SeedType, number>  = new Map([
  ['tulip', 5],
])

export class Purchase extends System {
  private playerFamily: Family
  private seedmanFamily: Family

  public constructor(world: World) {
    super(world)
    this.playerFamily = new FamilyBuilder(this.world).include([Player.name, Sprite.name, HorizontalDirection.name]).build()
    this.seedmanFamily = new FamilyBuilder(this.world).include([Store.name, Collider.name]).build()
 
  }

  public init(): void {
  }

  public execute(): void {
    const playerEntity = this.playerFamily.getSingleton()
    const seedman = this.seedmanFamily.getSingleton()
    const seedmanCollider = seedman.getComponent(Collider.name) as Collider
    if (!seedmanCollider.collided.has(playerEntity)) {
      return
    }

    const horizontalDirection = playerEntity.getComponent(HorizontalDirection.name) as HorizontalDirection
    if (horizontalDirection.dir !== 'Left') {
      return
    }
    const player = playerEntity.getComponent(Player.name) as Player

    let buySeed: SeedType
    if (Keyboard.keysTrigger.get('1') === 1) {
      buySeed = 'tulip'
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
      console.log(num)
    }
  }
}
