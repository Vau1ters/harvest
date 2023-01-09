import { Component } from '@shrimp/ecs/component'
import { ChasePlayer } from '@game/component/chasePlayer'

type tulipState = 'sleep' | 'chase'

export class TulipState implements Component
{
  public readonly chasePlayer: ChasePlayer

  public state: tulipState = 'sleep'
  
  public constructor(){
    this.chasePlayer = new ChasePlayer(0.5)
  }

  public init() {
    this.state = 'sleep'
  }
}
