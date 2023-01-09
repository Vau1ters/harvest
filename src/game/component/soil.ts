import { Component } from '@shrimp/ecs/component'

export type SoilState = 'none' | 'seed' | 'bud' | 'flower'
export type SeedType = 'tulip' | 'mouse'

export const incrementSoilState = (soil: Soil) => {
  switch (soil.state) {
    case 'none':
      soil.state = 'seed'
      break
    case 'seed':
      soil.state = 'bud'
      break
    case 'bud':
      soil.state = 'flower'
      break
    case 'flower':
      soil.state = 'none'
      break
  }
}

export class Soil implements Component
{
  public time = 0
  public state: SoilState
  public seed: SeedType
  public constructor(){
    this.state = 'none'
    this.seed = 'tulip'
  }
}
