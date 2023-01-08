import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family, FamilyBuilder } from '@shrimp/ecs/family'
import { Transform } from '@game/component/transform'
import { Camera } from '@game/component/camera'
import { Sprite } from '@game/component/sprite'

export class Draw extends System {
  private family: Family
  private cameraFamily: Family

  public constructor(world: World) {
    super(world)
    this.family = new FamilyBuilder(this.world).include([Transform.name, Sprite.name]).build()
    this.cameraFamily = new FamilyBuilder(this.world).include([Transform.name, Camera.name]).build()
  }

  public init(): void {
  }

  public execute(): void {
    const camera = this.cameraFamily.getSingleton()
    const cameraTrans = camera.getComponent(Transform.name) as Transform
    for (const entity of this.family.entityIterator)
    {
      const trans = entity.getComponent(Transform.name) as Transform
      const sprite = entity.getComponent(Sprite.name) as Sprite
      sprite.sprite.x = trans.x - cameraTrans.x
      sprite.sprite.y = trans.y - cameraTrans.y
    }
  }
}