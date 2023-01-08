import { application } from '@shrimp/application'
import { Component } from '@shrimp/ecs/component'
import { assert } from '@shrimp/utils/assertion'
import * as PIXI from 'pixi.js'

export class Sprite implements Component
{
  private _sprite: PIXI.AnimatedSprite
  public constructor(
    private sprites: Map<string, PIXI.Texture[] | PIXI.FrameObject[]>,
    private currentAnim: string,
    public anchor: {
      x: number,
      y: number
    } = {x: 0, y: 0}
  ) {
    const defaultAnim = sprites.get(currentAnim)
    assert(defaultAnim, `sprite has no ${currentAnim} animation`)
    this._sprite = new PIXI.AnimatedSprite(defaultAnim)
    this._sprite.play()
    application.stage.addChild(this._sprite)
  }


  public changeAnimation(animName: string, continuePlay = false) {
    if (animName == this.currentAnim) {
      return
    }
    const currentFrame = this.sprite.currentFrame
    const anim = this.sprites.get(animName)
    assert(anim, `sprite has no ${animName} animation`)
    this.sprite.textures = anim
    this.currentAnim = animName
    if (continuePlay) {
      this._sprite.gotoAndPlay(currentFrame)
    } else {
      this._sprite.play()
    }
  }
  
  public get sprite(): PIXI.AnimatedSprite {
    return this._sprite
  }
}
