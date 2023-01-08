import { Component } from '@shrimp/ecs/component'
import { Entity } from '@shrimp/ecs/entity'

export class Deadable implements Component
{

  public constructor(
    public isDead: boolean
  ){ }

}

export const isDead = (entity: Entity): boolean => {
  if (!entity.hasComponent(Deadable.name)) {
    return false
  }
  const deadable = entity.getComponent(Deadable.name) as Deadable
  return deadable.isDead
}
