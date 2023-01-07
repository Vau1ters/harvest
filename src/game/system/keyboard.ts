import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'

export class Keyboard extends System {
  public static keys  = new Map<string, boolean>()

  public constructor(world: World) {
    super(world)
  }

  public init(): void {
    window.addEventListener('keydown', e => {
      Keyboard.keys.set(e.key, true)
    })
    window.addEventListener('keyup', e => {
      Keyboard.keys.set(e.key, false)
    })
  }

  public execute(): void {
  }
}
