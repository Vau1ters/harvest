import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'

export class Keyboard extends System {
  public static keys  = new Map<string, boolean>()
  public static keysTrigger  = new Map<string, number>()

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
    for (const [key, value] of Keyboard.keys) {
      if (value) {
        let num = Keyboard.keysTrigger.get(key)
        if (!num) {
          num = 0
        }
        num++
        Keyboard.keysTrigger.set(key, num)
      } else {
        Keyboard.keysTrigger.set(key, 0)
      }
    }
  }
}
