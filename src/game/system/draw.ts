import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family, FamilyBuilder } from '@shrimp/ecs/family'
import { Transform } from '@game/component/transform'
import { Sprite } from '@game/component/sprite'

export class Draw extends System {
  private family: Family

  public constructor(world: World) {
    super(world)
    this.family = new FamilyBuilder(this.world).include([Transform.name, Sprite.name]).build()
  }

  public init(): void {
  }

  public execute(): void {
    for (const entity of this.family.entityIterator)
    {
      const trans = entity.getComponent(Transform.name) as Transform
      const sprite = entity.getComponent(Sprite.name) as Sprite
      sprite.sprite.x = trans.x
      sprite.sprite.y = trans.y
    }
  }
}
