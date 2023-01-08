import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family, FamilyBuilder } from '@shrimp/ecs/family'
import { Transform } from '@game/component/transform'
import { Sprite } from '@game/component/sprite'
import { incrementSoilState, SeedType, SoilState, Soil as SoilComponent } from '@game/component/soil'
import { assert } from '@shrimp/utils/assertion'
import { EnemyPool } from '@game/entity/enemyPool'

const enemyGrowingTime: Map<SeedType, Map<SoilState, number>> = new Map([
  ['tulip', new Map([['seed', 2], ['bud', 2], ['flower', 2]])]
])

export class Soil extends System {
  private family: Family

  public constructor(world: World) {
    super(world)
    this.family = new FamilyBuilder(this.world).include([Transform.name, SoilComponent.name, Sprite.name]).build()
  }

  public init(): void {
  }

  public execute(): void {
    for (const entity of this.family.entityIterator) {
      const sprite = entity.getComponent(Sprite.name) as Sprite
      const soil = entity.getComponent(SoilComponent.name) as SoilComponent

      if (soil.state === 'none') {
        sprite.changeAnimation(soil.state)
        continue
      }

      const times = enemyGrowingTime.get(soil.seed)
      assert(times, soil.seed)
      const time = times.get(soil.state)
      assert(time, soil.state)

      if (time < soil.time) {
        soil.time = 0
        if (soil.state === 'flower') {
          const trans = entity.getComponent(Transform.name) as Transform
          const enemy = EnemyPool.getEnemy(soil.seed, trans.x, trans.y)
          if (!this.world.hasEntity(enemy)) {
            this.world.addEntity(enemy)
          }
        }
        incrementSoilState(soil)
      }

      soil.time += 1 / 60
      sprite.changeAnimation(soil.state)
    }

  }
}
