import { Component } from '@shrimp/ecs/component'

type AttackState = 'charge' | 'attack' | 'slide' | 'wait'

const CHARGE_TIME = 60
const ATTACK_TIME = 10
const SLIDE_TIME = 30
const WAIT_TIME = 60

export class AttackToPlayer implements Component
{
  public attackDirX = 0
  public attackDirY = 0
  public state: AttackState = 'charge'
  public count = 0
  public constructor(){ }

  public init() {
    this.state = 'charge'
    this.count = 0
  }

  public stateEnd(): boolean {
    switch(this.state) {
      case 'charge':
        return this.count >= CHARGE_TIME
      case 'attack':
        return this.count >= ATTACK_TIME
      case 'slide':
        return this.count >= SLIDE_TIME
      case 'wait':
        return this.count >= WAIT_TIME
    }
  }

  public updateState() {
    this.count++
    if (this.stateEnd()) {
      switch(this.state) {
        case 'charge':
          this.count = 0
          this.state = 'attack'
          break
        case 'attack':
          this.count = 0
          this.state = 'slide'
          break
        case 'slide':
          this.count = 0
          this.state = 'wait'
          break
        case 'wait':
          // waitは最後なのでどこにも遷移しない
      }
    }
  }
}
