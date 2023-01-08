import { Component } from '@shrimp/ecs/component'

type PlayerState = 'stand' | 'run'

export class Player implements Component
{
  public money = 0
  public constructor(
    public state: PlayerState
  ){ }
}
