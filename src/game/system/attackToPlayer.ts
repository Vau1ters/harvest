import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family, FamilyBuilder } from '@shrimp/ecs/family'
import { Transform } from '@game/component/transform'
import { Player } from '@game/component/player'
import { calcLength } from '@shrimp/math/math'
import { Sprite } from '@game/component/sprite'
import { AttackToPlayer as AttackToPlayerComponent } from '@game/component/attackToPlayer'
import { HorizontalDirection } from '@game/component/horizontalDirection'
import { isDead } from '@game/component/deadable'

export class AttackToPlayer extends System {
  private family: Family
  private playerFamily: Family

  public constructor(world: World) {
    super(world)
    this.playerFamily = new FamilyBuilder(this.world).include([Transform.name, Player.name]).build()
    this.family = new FamilyBuilder(this.world).include([Transform.name, AttackToPlayerComponent.name]).build()
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
      const attackToPlayer = entity.getComponent(AttackToPlayerComponent.name) as AttackToPlayerComponent
      const trans = entity.getComponent(Transform.name) as Transform
      const dir = entity.getComponent(HorizontalDirection.name) as HorizontalDirection
      const dirX = playerTrans.x - trans.x
      const dirY = playerTrans.y - trans.y
      const length = calcLength(dirX, dirY)
      const count = attackToPlayer.count
      const state = attackToPlayer.state

      switch (state) {
        case 'charge':
          // プレイヤーの方向向く
          if (dirX > 0) {
            dir.dir = 'Right'
          } else {
            dir.dir = 'Left'
          }
          // 震える
          if (count !== 0) {
            if (Math.floor(count / 4) % 2 === 1) {
              trans.x += 0.5
            } else {
              trans.x -= 0.5
            }
          }
          break
        case 'attack':
          // 攻撃方向指定
          if (count === 0) {
            attackToPlayer.attackDirX = dirX / length
            attackToPlayer.attackDirY = dirY / length
            if (dirX > 0) {
              dir.dir = 'Right'
            } else {
              dir.dir = 'Left'
            }
            break
          }

          trans.x += attackToPlayer.attackDirX * 4
          trans.y += attackToPlayer.attackDirY * 4
          break
        case 'slide':
          trans.x += attackToPlayer.attackDirX * 3 / Math.max(count / 2, 1)
          trans.y += attackToPlayer.attackDirY * 3 / Math.max(count / 2, 1)
          break
        case 'wait':
          break
      }

      if (entity.hasComponent(Sprite.name)) {
        const sprite = entity.getComponent(Sprite.name) as Sprite
        sprite.changeAnimation(state + dir.dir, true)
      }

      // 近すぎたり遠すぎたりしたらchargeに移行しないようにする
      if (!(count === 0 && state === 'charge') || (length > 2 && length < 110)) {
        attackToPlayer.updateState()
      }

    }
  }
}
