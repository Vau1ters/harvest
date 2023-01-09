import { Button } from "@game/component/button"
import { ChasePlayer } from "@game/component/chasePlayer"
import { isDead } from "@game/component/deadable"
import { TulipState } from "@game/component/tulipState"
import { Family, FamilyBuilder } from "@shrimp/ecs/family"
import { System } from "@shrimp/ecs/system"
import { World } from "@shrimp/ecs/world"

export class Tulip extends System {
  private family: Family
  private buttonFamily: Family

  public constructor(world: World) {
    super(world)
    this.family = new FamilyBuilder(this.world).include([TulipState.name]).build()
    this.buttonFamily = new FamilyBuilder(this.world).include([Button.name]).build()
  }

  public init(): void {
  }

  public execute(): void {
    for (const entity of this.family.entityIterator) {
      if (isDead(entity)) {
        continue
      }
      const tulipState = entity.getComponent(TulipState.name) as TulipState
      switch (tulipState.state) {
        case 'sleep':
          for (const buttonEntity of this.buttonFamily.entityIterator) {
            const button = buttonEntity.getComponent(Button.name) as Button
            if (button.pressed) {
              tulipState.state = 'chase'
            }
          }
          break
        case 'chase':
          if (!entity.hasComponent(ChasePlayer.name)) {
            entity.addComponent(tulipState.chasePlayer)
          }
          break
      }
    }
  }
}
