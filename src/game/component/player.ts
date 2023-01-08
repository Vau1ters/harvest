import { Component } from '@shrimp/ecs/component'

type PlayerState = 'stand' | 'run'

export class Player implements Component
{
  public constructor(
    public state: PlayerState
  ){ }
}
