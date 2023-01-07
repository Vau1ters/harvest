import { Component } from '@shrimp/ecs/component'
import { Entity } from '@shrimp/ecs/entity'

export class Collider implements Component
{
  public currentGridIdx: {x: number, y: number} = {x: -1, y: -1}

  public collided: Set<Entity>

  public constructor(
    public size: {
      w: number,
      h: number
    },
    public anchor: {
      x: number,
      y: number
    } = {x: 0, y: 0}
  ){
    this.collided = new Set<Entity>()
  }

}
