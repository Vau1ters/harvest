import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family, FamilyBuilder } from '@shrimp/ecs/family'
import { Transform } from '@game/component/transform'
import { Sprite } from '@game/component/sprite'
import { Player as PlayerComponent } from '@game/component/player'
import { Keyboard } from '@game/system/keyboard'
import { HorizontalDirection } from '@game/component/horizontalDirection'

export class Player extends System {
  private family: Family

  public constructor(world: World) {
    super(world)
    this.family = new FamilyBuilder(this.world).include([Transform.name, PlayerComponent.name, Sprite.name, HorizontalDirection.name]).build()
  }

  public init(): void {
  }

  public execute(): void {
    const entity = this.family.getSingleton()
    const trans = entity.getComponent(Transform.name) as Transform
    const sprite = entity.getComponent(Sprite.name) as Sprite
    const player = entity.getComponent(PlayerComponent.name) as PlayerComponent
    const horizontalDirection = entity.getComponent(HorizontalDirection.name) as HorizontalDirection

    player.state = 'stand'

    if (Keyboard.keys.get('ArrowRight')) {
      horizontalDirection.dir = 'Right'
      trans.x += 1
      player.state = 'run'
    } 
    if (Keyboard.keys.get('ArrowLeft')) {
      horizontalDirection.dir = 'Left'
      trans.x -= 1
      player.state = 'run'
    }
    if (Keyboard.keys.get('ArrowUp')) {
      trans.y -= 1
      player.state = 'run'
    }
    if (Keyboard.keys.get('ArrowDown')) {
      trans.y += 1
      player.state = 'run'
    }

    sprite.changeAnimation(player.state + horizontalDirection.dir)
  }
}
