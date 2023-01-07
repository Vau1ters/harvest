import { Component } from '@shrimp/ecs/component'

export type LayerType = 'Ground' | 'Movable'

export class Layer implements Component
{
  public constructor(
    public layer: LayerType
  ){ }

}

