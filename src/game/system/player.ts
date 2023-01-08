import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family, FamilyBuilder } from '@shrimp/ecs/family'
import { Transform } from '@game/component/transform'
import { Player as PlayerComponent } from '@game/component/player'
import { Keyboard } from '@game/system/keyboard'

export class Player extends System {
  private family: Family

  public constructor(world: World) {
    super(world)
    this.family = new FamilyBuilder(this.world).include([Transform.name, PlayerComponent.name]).build()
  }

  public init(): void {
  }

  public execute(): void {
    const entity = this.family.getSingleton()
    const trans = entity.getComponent(Transform.name) as Transform
    if (Keyboard.keys.get('ArrowRight')) {
      trans.x += 1
    }
    if (Keyboard.keys.get('ArrowLeft')) {
      trans.x -= 1
    }
    if (Keyboard.keys.get('ArrowUp')) {
      trans.y -= 1
    }
    if (Keyboard.keys.get('ArrowDown')) {
      trans.y += 1
    }
  }
}
