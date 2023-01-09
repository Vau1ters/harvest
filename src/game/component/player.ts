import { Component } from '@shrimp/ecs/component'
import { SeedType } from './soil'

type PlayerState = 'stand' | 'run' | 'knockback'

export class Player implements Component
{
  private _money = 10
  private _maxMoney = 10
  public seed = new Map<SeedType, number>()
  public hp = 10
  public invinsibleTime = 100000000
  public knockbackX = 0
  public knockbackY = 0
  public constructor(
    public state: PlayerState
  ) {
    this.seed.set('tulip', 0)
    this.seed.set('mouse', 0)
  }

  public set money(val: number) {
    if (val > this.maxMoney) {
      this._maxMoney = val
    }
    this._money = val
  }

  public get money(): number {
    return this._money
  }
  public get maxMoney(): number {
    return this._maxMoney
  }
}
