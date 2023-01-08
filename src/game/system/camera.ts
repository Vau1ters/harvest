import { System } from '@shrimp/ecs/system'
import { World } from '@shrimp/ecs/world'
import { Family, FamilyBuilder } from '@shrimp/ecs/family'
import { Transform } from '@game/component/transform'
import { Player } from '@game/component/player'
import { Camera as CameraComponent } from '@game/component/camera'
import { windowSize } from '@shrimp/application'

export class Camera extends System {
  private cameraFamily: Family
  private playerFamily: Family

  public constructor(world: World) {
    super(world)
    this.playerFamily = new FamilyBuilder(this.world).include([Transform.name, Player.name]).build()
    this.cameraFamily = new FamilyBuilder(this.world).include([Transform.name, CameraComponent.name]).build()
  }

  public init(): void {
  }

  public execute(): void {
    const player = this.playerFamily.getSingleton()
    const camera = this.cameraFamily.getSingleton()
    const playerTrans = player.getComponent(Transform.name) as Transform
    const cameraTrans = camera.getComponent(Transform.name) as Transform
    cameraTrans.x = playerTrans.x - windowSize.width / 2
    cameraTrans.y = playerTrans.y - windowSize.height / 2
  }
}
