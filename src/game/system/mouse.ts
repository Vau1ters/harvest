import { AttackToPlayer } from "@game/component/attackToPlayer"
import { ChasePlayer } from "@game/component/chasePlayer"
import { isDead } from "@game/component/deadable"
import { MouseState } from "@game/component/mouseState"
import { Family, FamilyBuilder } from "@shrimp/ecs/family"
import { System } from "@shrimp/ecs/system"
import { World } from "@shrimp/ecs/world"

export class Mouse extends System {
  private family: Family

  public constructor(world: World) {
    super(world)
    this.family = new FamilyBuilder(this.world).include([MouseState.name]).build()
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
