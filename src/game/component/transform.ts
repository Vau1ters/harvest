import { Component } from '@shrimp/ecs/component'

export class Transform implements Component
{

  public constructor(
    public x: number,
    public y: number
  ){ }

}
