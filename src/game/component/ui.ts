import { Component } from '@shrimp/ecs/component'
type UIType = 'hud' | 'purchaseMenu'
export class UI implements Component
{
  public constructor(
    public readonly uiType: UIType
  ){ }
}
