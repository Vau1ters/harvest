import { Button } from "@game/component/button"
import { ChasePlayer } from "@game/component/chasePlayer"
import { isDead } from "@game/component/deadable"
import { TulipState } from "@game/component/tulipState"
import { Family } from "@shrimp/ecs/family"
import { System } from "@shrimp/ecs/system"
import { World } from "@shrimp/ecs/world"

export class Tulip extends System {
  private family = new Family([TulipState])
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
      const tulipState = entity.getComponent(TulipState)
      switch (tulipState.state) {
        case 'sleep':
          for (const buttonEntity of this.buttonFamily.entityIterator) {
            const button = buttonEntity.getComponent(Button)
            if (button.pressed) {
              tulipState.state = 'chase'
            }
          }
          break
        case 'chase':
          if (!entity.hasComponent(ChasePlayer)) {
            entity.addComponent(tulipState.chasePlayer)
          }
          break
      }
    }
  }
}
