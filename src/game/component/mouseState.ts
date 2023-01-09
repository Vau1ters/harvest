import { Component } from '@shrimp/ecs/component'
import { AttackToPlayer } from '@game/component/attackToPlayer'
import { ChasePlayer } from '@game/component/chasePlayer'

type mouseState = 'chase' | 'attack'

export class MouseState implements Component
{
  public readonly attackToPlayer: AttackToPlayer
  public readonly chasePlayer: ChasePlayer

  public state: mouseState = 'chase'
  public count = 0
  
  public constructor(){
    this.attackToPlayer = new AttackToPlayer()
    this.chasePlayer = new ChasePlayer(0.5)
  }

  public init() {
    this.state = 'chase'
    this.count = 0
  }
}
