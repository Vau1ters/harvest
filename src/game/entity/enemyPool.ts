import { Transform } from '@game/component/transform'
import { Entity } from '@shrimp/ecs/entity'
import { SeedType } from '@game/component/soil'
import { makeEnemyCoreEntity, makeMouseEnemyEntity, makeTulipEnemyEntity } from '@game/scenes/gameScene'
import { Deadable } from '@game/component/deadable'

export class EnemyPool {
  private static pool: Array<Entity>
  private static topIdx: number

  public static getEnemy(seedType: SeedType, x: number, y: number): Entity {
    if (!EnemyPool.pool) {
      EnemyPool.pool = []
      EnemyPool.topIdx = 0
    }

    let enemy: Entity
    if (EnemyPool.topIdx < EnemyPool.pool.length) {
      enemy = EnemyPool.pool[EnemyPool.topIdx++]
    } else {
      enemy = makeEnemyCoreEntity()
    }

    switch (seedType) {
      case 'tulip':
        // tulip用処理
        enemy = makeTulipEnemyEntity(enemy)
        break
      case 'mouse':
        enemy = makeMouseEnemyEntity(enemy)
        break
    }

    const trans = enemy.getComponent(Transform)
    trans.x = x
    trans.y = y

    const deadable = enemy.getComponent(Deadable)
    deadable.isDead = false

    return enemy
  }

  public static removeEnemy(enemy: Entity) {
    const deadable = enemy.getComponent(Deadable)
    deadable.isDead = true

    for(let i = 0; i < EnemyPool.topIdx; i++) {
      if (EnemyPool.pool[i].id === enemy.id) {
        EnemyPool.pool[i] = EnemyPool.pool[EnemyPool.topIdx]
        EnemyPool.pool[EnemyPool.topIdx] = enemy
        EnemyPool.topIdx--
        return
      }
    }
  }

}

