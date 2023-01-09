import { Player } from '@game/component/player'
import { Draw } from '@game/system/draw'
import { application, windowSize } from '@shrimp/application'
import { Entity } from '@shrimp/ecs/entity'
import { World } from '@shrimp/ecs/world'
import { Scene } from '@shrimp/scene'
import { assert } from '@shrimp/utils/assertion'
import { Text, TextStyle } from 'pixi.js'

export class GameOverScene implements Scene {
  private readonly world: World

  private gameoverCount = 0

  public constructor(entityIterator: IterableIterator<Entity>) {
    this.world = new World()
    this.world.addSystem(new Draw(this.world))

    for (const entity of entityIterator) {
      this.world.addEntity(entity)
    }

  }

  public exec(): void {
    if (this.gameoverCount === 60) {
      let player: Player | undefined = undefined
      for (const entity of this.world.entityIterator) {
        if (entity.hasComponent(Player.name)) {
          player = entity.getComponent(Player.name) as Player
        }
      }
      assert(player, 'player not found')

      const style = new TextStyle({
        fontFamily: 'Arial',
        fontSize: 36,
        fill: ['#FFFFFF'],
      });

      const gameOverText = new Text(`GAME OVER\nScore: ${player.maxMoney}`, style)
      gameOverText.x = (windowSize.width - gameOverText.width) / 2
      gameOverText.y = (windowSize.height - gameOverText.height) / 2
      application.stage.addChild(gameOverText)
    }
    this.gameoverCount++

    this.world.execute()
  }

  public getNextScene(): Scene {
    return this
  }
}
