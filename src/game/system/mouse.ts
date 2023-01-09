import { AttackToPlayer } from "@game/component/attackToPlayer"
import { Button } from "@game/component/button"
import { ChasePlayer } from "@game/component/chasePlayer"
import { isDead } from "@game/component/deadable"
import { MouseState } from "@game/component/mouseState"
import { Family, FamilyBuilder } from "@shrimp/ecs/family"
import { System } from "@shrimp/ecs/system"
import { World } from "@shrimp/ecs/world"

export class Mouse extends System {
  private family: Family
  private buttonFamily: Family

  public constructor(world: World) {
    super(world)
    this.family = new FamilyBuilder(this.world).include([MouseState.name]).build()
    this.buttonFamily = new FamilyBuilder(this.world).include([Button.name]).build()
  }

  public init(): void {
  }

  public execute(): void {
    for (const entity of this.family.entityIterator) {
      if (isDead(entity)) {
        continue
      }
      const mouseState = entity.getComponent(MouseState.name) as MouseState
      switch (mouseState.state) {
        case 'sleep':
          for (const buttonEntity of this.buttonFamily.entityIterator) {
            const button = buttonEntity.getComponent(Button.name) as Button
            if (button.pressed) {
              mouseState.state = 'chase'
            }
          }
          break
        case 'chase':
          if (!entity.hasComponent(ChasePlayer.name)) {
            entity.addComponent(mouseState.chasePlayer)
            mouseState.count = 0
          }
          mouseState.count++
          if (mouseState.count > 60) {
            mouseState.state = 'attack'
            entity.removeComponent(ChasePlayer.name)
          }
          break
        case 'attack':
          if (!entity.hasComponent(AttackToPlayer.name)) {
            entity.addComponent(mouseState.attackToPlayer)
            mouseState.attackToPlayer.init()
          }
          {
            const attackToPlayer = entity.getComponent(AttackToPlayer.name) as AttackToPlayer
            if (attackToPlayer.state === 'wait' && attackToPlayer.stateEnd()) {
              mouseState.state = 'chase'
              entity.removeComponent(AttackToPlayer.name)
            }
          }
          break
      }
    }
  }
}
