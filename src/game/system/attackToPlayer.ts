import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family } from '@shrimp/ecs/family'
import { Transform } from '@game/component/transform'
import { Player } from '@game/component/player'
import { calcLength } from '@shrimp/math/math'
import { Sprite } from '@game/component/sprite'
import { AttackToPlayer as AttackToPlayerComponent } from '@game/component/attackToPlayer'
import { HorizontalDirection } from '@game/component/horizontalDirection'
import { isDead } from '@game/component/deadable'
import { Keyboard } from './keyboard'

export class AttackToPlayer extends System {
  private playerFamily = new Family([Transform, Player])
  private family = new Family([Transform, AttackToPlayerComponent])

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
      const attackToPlayer = entity.getComponent(AttackToPlayerComponent)
      const trans = entity.getComponent(Transform)
      const dir = entity.getComponent(HorizontalDirection)
      // 移動方向予想付き
      const dirX = playerTrans.x - trans.x + this.playerMoveDirX() * 16
      const dirY = playerTrans.y - trans.y + this.playerMoveDirY() * 16
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

      if (entity.hasComponent(Sprite)) {
        const sprite = entity.getComponent(Sprite)
        sprite.changeAnimation(state + dir.dir, true)
      }

      attackToPlayer.updateState()
    }
  }

  private playerMoveDirX(): number {
      if (Keyboard.keys.get('ArrowRight')) {
        return 1
      } 
      if (Keyboard.keys.get('ArrowLeft')) {
        return -1
      }
    return 0
  }

  private playerMoveDirY(): number {
      if (Keyboard.keys.get('ArrowUp')) {
        return -1
      }
      if (Keyboard.keys.get('ArrowDown')) {
        return 1
      }
    return 0
  }
}
