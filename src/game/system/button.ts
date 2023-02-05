import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family } from '@shrimp/ecs/family'
import { Player } from '@game/component/player'
import { Button as ButtonComponent } from '@game/component/button'
import { Collider } from '@game/component/collider'
import { Sprite } from '@game/component/sprite'

export class Button extends System {
  private family = new Family([ButtonComponent, Collider, Sprite])

  public constructor(world: World) {
    super(world)
    this.family.init(this.world)
  }

  public init(): void {
  }

  public execute(): void {
    for (const entity of this.family.entityIterator) {
      const button = entity.getComponent(ButtonComponent)
      button.pressed = false
      const collider = entity.getComponent(Collider)
      for (const collided of collider.collided) {
        if (collided.hasComponent(Player)) {
          button.pressed = true
        }
      }

      const sprite = entity.getComponent(Sprite)
      if (button.pressed) {
        sprite.changeAnimation('bell')
      } else {
        sprite.changeAnimation('default')
      }
    }
  }
}
