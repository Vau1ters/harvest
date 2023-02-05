import { AttackToPlayer } from "@game/component/attackToPlayer"
import { Button } from "@game/component/button"
import { ChasePlayer } from "@game/component/chasePlayer"
import { isDead } from "@game/component/deadable"
import { MouseState } from "@game/component/mouseState"
import { Family } from "@shrimp/ecs/family"
import { System } from "@shrimp/ecs/system"
import { World } from "@shrimp/ecs/world"

export class Mouse extends System {
  private family = new Family([MouseState])
  private buttonFamily = new Family([Button])

  public constructor(world: World) {
    super(world)
    this.family.init(this.world)
    this.buttonFamily.init(this.world)
  }

  public init(): void {
  }

  public execute(): void {
    for (const entity of this.family.entityIterator) {
      if (isDead(entity)) {
        continue
      }
      const mouseState = entity.getComponent(MouseState)
      switch (mouseState.state) {
        case 'sleep':
          for (const buttonEntity of this.buttonFamily.entityIterator) {
            const button = buttonEntity.getComponent(Button)
            if (button.pressed) {
              mouseState.state = 'chase'
            }
          }
          break
        case 'chase':
          if (!entity.hasComponent(ChasePlayer)) {
            entity.addComponent(mouseState.chasePlayer)
            mouseState.count = 0
          }
          mouseState.count++
          if (mouseState.count > 60) {
            mouseState.state = 'attack'
            entity.removeComponent(ChasePlayer)
          }
          break
        case 'attack':
          if (!entity.hasComponent(AttackToPlayer)) {
            entity.addComponent(mouseState.attackToPlayer)
            mouseState.attackToPlayer.init()
          }
          {
            const attackToPlayer = entity.getComponent(AttackToPlayer)
            if (attackToPlayer.state === 'wait' && attackToPlayer.stateEnd()) {
              mouseState.state = 'chase'
              entity.removeComponent(AttackToPlayer)
            }
          }
          break
      }
    }
  }
}
