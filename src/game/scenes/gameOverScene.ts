import { Draw } from '@game/system/draw'
import { application, windowSize } from '@shrimp/application'
import { Entity } from '@shrimp/ecs/entity'
import { World } from '@shrimp/ecs/world'
import { Scene } from '@shrimp/scene'
import { Text, TextStyle } from 'pixi.js'

export class GameOverScene implements Scene {
  private readonly world: World

  public constructor(entityIterator: IterableIterator<Entity>) {
    this.world = new World()
    this.world.addSystem(new Draw(this.world))

    for (const entity of entityIterator) {
      this.world.addEntity(entity)
    }

    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 36,
      fill: ['#FFFFFF'],
    });

    const gameOverText = new Text('GAME OVER', style)
    gameOverText.x = (windowSize.width - gameOverText.width) / 2
    gameOverText.y = (windowSize.height - gameOverText.height) / 2
    application.stage.addChild(gameOverText)
  }

  public exec(): void {
    this.world.execute()
  }

  public getNextScene(): Scene {
    return this
  }
}
