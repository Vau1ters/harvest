import { Component } from '@shrimp/ecs/component'

type HorizontalDirectionType = 'Left' | 'Right'

export class HorizontalDirection implements Component
{
  public constructor(
    public dir: HorizontalDirectionType
  ){ }
}
