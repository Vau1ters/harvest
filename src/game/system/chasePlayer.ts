import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family } from '@shrimp/ecs/family'
import { Transform } from '@game/component/transform'
import { Player } from '@game/component/player'
import { ChasePlayer as ChasePlayerComponent } from '@game/component/chasePlayer'
import { calcLength } from '@shrimp/math/math'
import { Sprite } from '@game/component/sprite'
import { HorizontalDirection } from '@game/component/horizontalDirection'
import { isDead } from '@game/component/deadable'

export class ChasePlayer extends System {
  private family = new Family([Transform, ChasePlayerComponent])
  private playerFamily = new Family([Transform, Player])

  public constructor(world: World) {
    super(world)
    this.playerFamily.init(this.world)
    this.family.init(this.world)
  }

  public init(): void {
  }

  public execute(): void {
    const player = this.playerFamily.getSingleton()
    const playerTrans = player.getComponent(Transform)
    for (const entity of this.family.entityIterator) {
      if (isDead(entity)) {
        continue
      }
      const trans = entity.getComponent(Transform)
      const chasePlayer = entity.getComponent(ChasePlayerComponent)
      const dirX = playerTrans.x - trans.x
      const dirY = playerTrans.y - trans.y
      const length = calcLength(dirX, dirY)
      const speed = chasePlayer.speed

      // 近すぎても遠すぎても追わない
      trans.x += dirX * speed / length
      trans.y += dirY * speed / length

      if (entity.hasComponent(Sprite)) {
        const sprite = entity.getComponent(Sprite)
        if (entity.hasComponent(HorizontalDirection)) {
          const dir = entity.getComponent(HorizontalDirection)
          if (dirX > 0) {
            dir.dir = 'Right'
          } else {
            dir.dir = 'Left'
          }
          sprite.changeAnimation('run' + dir.dir, true)
        }
      }
    }
  }
}
