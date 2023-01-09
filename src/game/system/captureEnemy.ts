import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family, FamilyBuilder } from '@shrimp/ecs/family'
import { Collider } from '@game/component/collider'
// import { Sprite } from '@game/component/sprite'
// import { assert } from '@shrimp/utils/assertion'
import { EnemyPool } from '@game/entity/enemyPool'
import { CaptureEnemy as CaptureEnemyComponent} from '@game/component/captureEnemy'
import { Enemy } from '@game/component/enemy'
import { Deadable } from '@game/component/deadable'
import { Player } from '@game/component/player'
import { assert } from '@shrimp/utils/assertion'

export class CaptureEnemy extends System {
  private family: Family
  private playerFamily: Family
  public constructor(world: World) {
    super(world)
    this.family = new FamilyBuilder(this.world).include([Collider.name, CaptureEnemyComponent.name]).build()
    this.playerFamily = new FamilyBuilder(this.world).include([Player.name]).build()
  }

  public init(): void {
  }

  public execute(): void {
    for (const line of this.family.entityIterator) {
      const collider = line.getComponent(Collider.name) as Collider
      for (const maybeEnemy of collider.collided) {
        if (!maybeEnemy.hasComponents([Enemy.name, Deadable.name])) {
          continue
        }

        const deadable = maybeEnemy.getComponent(Deadable.name) as Deadable
        if (deadable.isDead){
          continue
        }

        const enemy = maybeEnemy.getComponent(Enemy.name) as Enemy
        const player = this.playerFamily.getSingleton().getComponent(Player.name) as Player
        switch (enemy.seedType) {
          case 'tulip':
            player.money += 10
            break
          case 'mouse':
            player.money += 50
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
