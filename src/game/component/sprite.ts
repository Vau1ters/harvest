import { Component } from '@shrimp/ecs/component'
import * as PIXI from 'pixi.js'

export class Sprite implements Component
{
  public constructor(
    public sprite: PIXI.Sprite,
    public anchor: {
      x: number,
      y: number
    } = {x: 0, y: 0}
  ) { }
}
