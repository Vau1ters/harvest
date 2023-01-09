import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family, FamilyBuilder } from '@shrimp/ecs/family'
import { Transform } from '@game/component/transform'
import { Player } from '@game/component/player'
import { ChasePlayer as ChasePlayerComponent } from '@game/component/chasePlayer'
import { calcLength } from '@shrimp/math/math'
import { Sprite } from '@game/component/sprite'
import { HorizontalDirection } from '@game/component/horizontalDirection'
import { isDead } from '@game/component/deadable'

export class ChasePlayer extends System {
  private family: Family
  private playerFamily: Family

  public constructor(world: World) {
    super(world)
    this.playerFamily = new FamilyBuilder(this.world).include([Transform.name, Player.name]).build()
    this.family = new FamilyBuilder(this.world).include([Transform.name, ChasePlayerComponent.name]).build()
  }

  public init(): void {
  }

  public execute(): void {
    const player = this.playerFamily.getSingleton()
    const playerTrans = player.getComponent(Transform.name) as Transform
    for (const entity of this.family.entityIterator) {
      if (isDead(entity)) {
        continue
      }
      const trans = entity.getComponent(Transform.name) as Transform
      const chasePlayer = entity.getComponent(ChasePlayerComponent.name) as ChasePlayerComponent
      const dirX = playerTrans.x - trans.x
      const dirY = playerTrans.y - trans.y
      const length = calcLength(dirX, dirY)
      const speed = chasePlayer.speed

      // 近すぎても遠すぎても追わない
      if (length > 2 && length < 110) {
        trans.x += dirX * speed / length
        trans.y += dirY * speed / length

        if (entity.hasComponent(Sprite.name)) {
          const sprite = entity.getComponent(Sprite.name) as Sprite
          if (entity.hasComponent(HorizontalDirection.name)) {
            const dir = entity.getComponent(HorizontalDirection.name) as HorizontalDirection
            if (dirX > 0) {
              dir.dir = 'Right'
            } else {
              dir.dir = 'Left'
            }
            sprite.changeAnimation('run' + dir.dir, true)
          }
        }
      } else {
        if (entity.hasComponent(Sprite.name)) {
          const sprite = entity.getComponent(Sprite.name) as Sprite
          if (entity.hasComponent(HorizontalDirection.name)) {
            const dir = entity.getComponent(HorizontalDirection.name) as HorizontalDirection
            sprite.changeAnimation('stand' + dir.dir, true)
          }
        }
      }
    }
  }
}
