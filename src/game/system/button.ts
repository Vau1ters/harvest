import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family, FamilyBuilder } from '@shrimp/ecs/family'
import { Player } from '@game/component/player'
import { Button as ButtonComponent } from '@game/component/button'
import { Collider } from '@game/component/collider'
import { Sprite } from '@game/component/sprite'

export class Button extends System {
  private family: Family

  public constructor(world: World) {
    super(world)
    this.family = new FamilyBuilder(this.world).include([ButtonComponent.name, Collider.name, Sprite.name]).build()
  }

  public init(): void {
  }

  public execute(): void {
    for (const entity of this.family.entityIterator) {
      const button = entity.getComponent(ButtonComponent.name) as ButtonComponent
      button.pressed = false
      const collider = entity.getComponent(Collider.name) as Collider
      for (const collided of collider.collided) {
        if (collided.hasComponent(Player.name)) {
          button.pressed = true
        }
      }

      const sprite = entity.getComponent(Sprite.name) as Sprite
      if (button.pressed) {
        sprite.changeAnimation('bell')
      } else {
        sprite.changeAnimation('default')
      }
    }
  }
}
