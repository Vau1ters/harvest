import { application, initializeApplication } from '@shrimp/application'
import { Scene } from '@shrimp/scene'
import { GameScene } from '@game/scenes/gameScene'

export class Main {
  public static async init(): Promise<void> {
    initializeApplication()
    let scene: Scene = new GameScene()
    application.ticker.add(() => {
      scene.exec()
      scene = scene.getNextScene()
    })
  }
}
Main.init()
