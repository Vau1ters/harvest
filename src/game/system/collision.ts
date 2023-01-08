import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Entity } from '@shrimp/ecs/entity'
import { Family, FamilyBuilder } from '@shrimp/ecs/family'
import { Transform } from '@game/component/transform'
import { Collider } from '@game/component/collider'
import { GameScene } from '@game/scenes/gameScene'
import { assert } from '@shrimp/utils/assertion'
import { clamp } from '@shrimp/math/math'
import { isDead } from '@game/component/deadable'
import { Soil } from '@game/component/soil'

export class Collision extends System {
  private family: Family

  private groundGrid: Array<Array<Entity | null>>
  private movableGrid: Array<Array<Set<Entity>>>

  private onEntityAdded(entity: Entity) {
    const trans = entity.getComponent(Transform.name) as Transform
    const collider = entity.getComponent(Collider.name) as Collider
    const x = div16X(trans.x + collider.anchor.x)
    const y = div16Y(trans.y + collider.anchor.y)

    switch(collider.layer)
    {
      case 'Ground':
        this.groundGrid[y][x] = entity
        break
      case 'Movable':
        this.addMovableEntityToGrid(entity)
        break
    }
  }


  private onEntityRemoved(entity: Entity) {
    const collider = entity.getComponent(Collider.name) as Collider

    switch (collider.layer)
    {
      case 'Ground':
        assert(false, 'ground don\'t remove')
        break
      case 'Movable':
        this.removeMovableEntityFromGrid(entity)
        break
    }
  }


  private moveEntity(entity: Entity) {
    this.removeMovableEntityFromGrid(entity)
    this.addMovableEntityToGrid(entity)

  }

  private addMovableEntityToGrid(entity: Entity) {
    const trans = entity.getComponent(Transform.name) as Transform
    const collider = entity.getComponent(Collider.name) as Collider
    const x = div16X(trans.x + collider.anchor.x)
    const y = div16Y(trans.y + collider.anchor.y)

    this.movableGrid[y][x].add(entity)
    collider.currentGridIdx.x = x
    collider.currentGridIdx.y = y
  }

  private removeMovableEntityFromGrid(entity: Entity) {
    const collider = entity.getComponent(Collider.name) as Collider
    assert(collider.currentGridIdx.x != -1, 'this entity not belong to layer')
    assert(collider.currentGridIdx.y != -1, 'this entity not belong to layer')
    this.movableGrid[collider.currentGridIdx.y][collider.currentGridIdx.x].delete(entity)
    collider.currentGridIdx.x = -1
    collider.currentGridIdx.y = -1
  }

  public constructor(world: World) {
    super(world)

    this.groundGrid = new Array<Array<Entity>>()
    for (let y = 0; y < GameScene.mapSize.height; y++) {
      this.groundGrid[y] = new Array<Entity>()
      for (let x = 0; x < GameScene.mapSize.width; x++) {
        this.groundGrid[y][x] = null
      }
    }
    this.movableGrid = new Array<Array<Set<Entity>>>()
    for ( let y = 0; y < GameScene.mapSize.height; y++) {
      this.movableGrid[y] = new Array<Set<Entity>>()
      for (let x = 0; x < GameScene.mapSize.width; x++) {
        this.movableGrid[y][x] = new Set<Entity>()
      }
    }

    this.family = new FamilyBuilder(this.world).include([Transform.name, Collider.name]).build()
    this.family.entityAddedEvent.addObserver(entity => this.onEntityAdded(entity))
    this.family.entityRemovedEvent.addObserver(entity => this.onEntityRemoved(entity))
  }

  public init(): void {
  }

  public execute(): void {
    // 初期化
    for (const entity of this.family.entityIterator) {
      const collider = entity.getComponent(Collider.name) as Collider
      collider.collided.clear()
    }

    // 衝突判定
    for (const entity of this.family.entityIterator) {
      if (isDead(entity)) {
        continue
      }
      const collider = entity.getComponent(Collider.name) as Collider
      const trans = entity.getComponent(Transform.name) as Transform

      const cellX = div16X(trans.x + collider.anchor.x)
      const cellY = div16Y(trans.y + collider.anchor.y)

      switch(collider.layer) {
        case 'Ground':
          break
        case 'Movable':
          // 現在位置に移動
          {
            const currentGridIdx = collider.currentGridIdx
            if (currentGridIdx.x != cellX || currentGridIdx.y != cellY) {
              this.moveEntity(entity)
            }
          }

          // Groundとの衝突判定
          for (let y = -1; y <= 1; y++) {
            for (let x = -1; x <= 1; x++) {
              const ground = this.groundGrid[clampMapY(cellY + y)][clampMapX(cellX + x)]
              if (ground === null) {
                continue
              }
              const transGround = ground.getComponent(Transform.name) as Transform
              const colliderGround = ground.getComponent(Collider.name) as Collider
              if (!hitCheck(transGround, colliderGround, trans, collider)) {
                continue
              }

              // 土はぶつかっても衝突解決しない
              if (ground.hasComponent(Soil.name)) {
                collider.collided.add(ground)
                continue
              }

              const w2 = collider.size.w / 2
              const h2 = collider.size.h / 2
              const gw2 = colliderGround.size.w / 2
              const gh2 = colliderGround.size.h / 2
              const centorX = trans.x + collider.anchor.x + w2
              const centorY = trans.y + collider.anchor.y + h2
              const gCentorX = transGround.x + colliderGround.anchor.x + gw2
              const gCentorY = transGround.y + colliderGround.anchor.y + gh2
              const vx =  centorX - gCentorX
              const vy =  centorY - gCentorY
              const buriedW = w2 + gw2 - Math.abs(vx)
              const buriedH = h2 + gh2 - Math.abs(vy)
              if (buriedW / buriedH < 1) {
                if (vx > 0) {
                  trans.x += buriedW
                } else {
                  trans.x -= buriedW
                }
              } else {
                if (vy > 0) {
                  trans.y += buriedH
                } else {
                  trans.y -= buriedH
                }
              }
            }
          }

          // Movableとの衝突判定
          for (let y = -1; y <= 1; y++) {
            for (let x = -1; x <= 1; x++) {
              const grid = this.movableGrid[clampMapY(cellY + y)][clampMapX(cellX + x)]
              for (const other of grid) {
                if (isDead(other)) {
                  continue
                }

                if (collider.collided.has(other)) {
                  continue
                }

                const transOther = other.getComponent(Transform.name) as Transform
                const colliderOther = other.getComponent(Collider.name) as Collider
                if (!hitCheck(transOther, colliderOther, trans, collider)) {
                  continue
                }
                collider.collided.add(other)
                colliderOther.collided.add(entity)
              }
            }
          }
          break
      }
    }
  }
}
const hitCheck = (transA: Transform, colliderA: Collider, transB: Transform, colliderB: Collider): boolean => {
  const ax = transA.x + colliderA.anchor.x
  const ay = transA.y + colliderA.anchor.y
  const bx = transB.x + colliderB.anchor.x
  const by = transB.y + colliderB.anchor.y

  const ax2 = ax + colliderA.size.w
  const ay2 = ay + colliderA.size.h
  const bx2 = bx + colliderB.size.w
  const by2 = by + colliderB.size.h

  if (ax > bx2 || bx > ax2
    || ay > by2 || by > ay2) {
    return false
  }

  // 角を削る
  const threshold = 2
  return (bx2 - ax > threshold && ax2 - bx > threshold)
      || (by2 - ay > threshold && ay2 - by > threshold)
}

const clampMapX = (x: number): number => {
  return clamp(Math.floor(x), 0, GameScene.mapSize.width - 1)
}

const clampMapY = (y: number): number => {
  return clamp(Math.floor(y), 0, GameScene.mapSize.height - 1)
}

const div16X = (x: number): number => {
  return Math.floor(clampMapX(x / 16))
}
const div16Y = (y: number): number => {
  return Math.floor(clampMapY(y / 16))
}
