import { Component } from '@shrimp/ecs/component'
import { SeedType } from './soil';

export class Enemy implements Component
{
  public constructor(
    public seedType: SeedType
  ){ }
}
