import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family } from '@shrimp/ecs/family'
import { Transform } from '@game/component/transform'
import { Camera } from '@game/component/camera'
import { Sprite } from '@game/component/sprite'
import { isDead } from '@game/component/deadable'
import { Text } from '@game/component/text'
import { UI } from '@game/component/ui'

export class Draw extends System {
  private spriteFamily = new Family([Transform, Sprite])
  private textFamily = new Family([Transform, Text])
  private cameraFamily = new Family([Transform, Camera])

  public constructor(world: World) {
    super(world)
    this.spriteFamily.init(this.world)
    this.textFamily.init(this.world)
    this.cameraFamily.init(this.world)
  }

  public init(): void {
  }

  public execute(): void {
    const camera = this.cameraFamily.getSingleton()
    const cameraTrans = camera.getComponent(Transform)

    for (const entity of this.spriteFamily.entityIterator)
    {
      const sprite = entity.getComponent(Sprite)
      if (isDead(entity)) {
        sprite.sprite.renderable = false
        continue
      } else {
        sprite.sprite.renderable = true
      }

      const trans = entity.getComponent(Transform)
      if (entity.hasComponent(UI)){
        sprite.sprite.x = trans.x + sprite.anchor.x
        sprite.sprite.y = trans.y + sprite.anchor.y
      } else {
        sprite.sprite.x = trans.x + sprite.anchor.x - cameraTrans.x
        sprite.sprite.y = trans.y + sprite.anchor.y - cameraTrans.y
      }
    }

    for (const entity of this.textFamily.entityIterator)
    {
      const text = entity.getComponent(Text)
      if (isDead(entity)) {
        text.text.renderable = false
        continue
      } else {
        text.text.renderable = true
      }

      const trans = entity.getComponent(Transform)
      if (entity.hasComponent(UI)){
        text.text.x = trans.x + text.anchor.x
        text.text.y = trans.y + text.anchor.y
      } else {
        text.text.x = trans.x + text.anchor.x - cameraTrans.x
        text.text.y = trans.y + text.anchor.y - cameraTrans.y
      }
    }
  }
}
