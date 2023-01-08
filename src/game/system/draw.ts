import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family, FamilyBuilder } from '@shrimp/ecs/family'
import { Transform } from '@game/component/transform'
import { Camera } from '@game/component/camera'
import { Sprite } from '@game/component/sprite'
import { isDead } from '@game/component/deadable'
import { Text } from '@game/component/text'
import { UI } from '@game/component/ui'

export class Draw extends System {
  private spriteFamily: Family
  private textFamily: Family
  private cameraFamily: Family

  public constructor(world: World) {
    super(world)
    this.spriteFamily = new FamilyBuilder(this.world).include([Transform.name, Sprite.name]).build()
    this.textFamily = new FamilyBuilder(this.world).include([Transform.name, Text.name]).build()
    this.cameraFamily = new FamilyBuilder(this.world).include([Transform.name, Camera.name]).build()
  }

  public init(): void {
  }

  public execute(): void {
    const camera = this.cameraFamily.getSingleton()
    const cameraTrans = camera.getComponent(Transform.name) as Transform

    for (const entity of this.spriteFamily.entityIterator)
    {
      const sprite = entity.getComponent(Sprite.name) as Sprite
      if (isDead(entity)) {
        sprite.sprite.renderable = false
        continue
      } else {
        sprite.sprite.renderable = true
      }

      const trans = entity.getComponent(Transform.name) as Transform
      if (entity.hasComponent(UI.name)){
        sprite.sprite.x = trans.x + sprite.anchor.x
        sprite.sprite.y = trans.y + sprite.anchor.y
      } else {
        sprite.sprite.x = trans.x + sprite.anchor.x - cameraTrans.x
        sprite.sprite.y = trans.y + sprite.anchor.y - cameraTrans.y
      }
    }

    for (const entity of this.textFamily.entityIterator)
    {
      const text = entity.getComponent(Text.name) as Text
      if (isDead(entity)) {
        text.text.renderable = false
        continue
      } else {
        text.text.renderable = true
      }

      const trans = entity.getComponent(Transform.name) as Transform
      if (entity.hasComponent(UI.name)){
        text.text.x = trans.x + text.anchor.x
        text.text.y = trans.y + text.anchor.y
      } else {
        text.text.x = trans.x + text.anchor.x - cameraTrans.x
        text.text.y = trans.y + text.anchor.y - cameraTrans.y
      }
    }
  }
}
