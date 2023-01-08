import { Component } from '@shrimp/ecs/component'

export class ChasePlayer implements Component
{
  public constructor(
    public speed: number
  ){ }
}
