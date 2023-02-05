import { Collider } from "@game/component/collider"
import { isDead } from "@game/component/deadable"
import { Enemy } from "@game/component/enemy"
import { Transform } from "@game/component/transform"
import { Family } from "@shrimp/ecs/family"
import { System } from "@shrimp/ecs/system"
import { World } from "@shrimp/ecs/world"
import { calcLength } from "@shrimp/math/math"

export class AvoidEnemy extends System {
  private family = new Family([Enemy, Transform, Collider])

  public constructor(world: World) {
    super(world)
    this.family.init(this.world)
  }

  public init(): void {
  }

  public execute(): void {
    for (const entity of this.family.entityIterator) {
      if (isDead(entity)) {
        continue
      }
      const collider = entity.getComponent(Collider)
      for (const collided of collider.collided) {
        if (isDead(collided)) {
          continue
        }
        if (collided.hasComponent(Enemy)) {
          const trans = entity.getComponent(Transform)
          const otherTrans = collided.getComponent(Transform)
          const dirX = trans.x - otherTrans.x
          const dirY = trans.y - otherTrans.y
          const length = calcLength(dirX, dirY)
          trans.x += dirX / length
          trans.y += dirY / length
        }
      }
    }
  }
}
