import { Component } from '@shrimp/ecs/component'

export class Deadable implements Component
{

  public constructor(
    public isDead: boolean
  ){ }

}

