import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family } from '@shrimp/ecs/family'
import { Collider } from '@game/component/collider'
import { EnemyPool } from '@game/entity/enemyPool'
import { CaptureEnemy as CaptureEnemyComponent} from '@game/component/captureEnemy'
import { Enemy } from '@game/component/enemy'
import { Deadable } from '@game/component/deadable'
import { Player } from '@game/component/player'
import { assert } from '@shrimp/utils/assertion'

export class CaptureEnemy extends System {
  private family = new Family([Collider, CaptureEnemyComponent])
  private playerFamily = new Family([Player])
  public constructor(world: World) {
    super(world)
    this.family.init(this.world)
    this.playerFamily.init(this.world)
  }

  public init(): void {
  }

  public execute(): void {
    for (const line of this.family.entityIterator) {
      const collider = line.getComponent(Collider)
      for (const maybeEnemy of collider.collided) {
        if (!maybeEnemy.hasComponents([Enemy, Deadable])) {
          continue
        }

        const deadable = maybeEnemy.getComponent(Deadable)
        if (deadable.isDead){
          continue
        }

        const enemy = maybeEnemy.getComponent(Enemy)
        const player = this.playerFamily.getSingleton().getComponent(Player)
        switch (enemy.seedType) {
          case 'tulip':
            player.money += 10
            break
          case 'mouse':
            player.money += 40
            break
          default:
            assert(false, 'money undefined')
            break
        }

        EnemyPool.removeEnemy(maybeEnemy)
      }
    }
  }
}
