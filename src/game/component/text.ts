import { application } from '@shrimp/application'
import { Component } from '@shrimp/ecs/component'
import * as PIXI from 'pixi.js'

export class Text implements Component
{
  private _text: PIXI.Text
  public constructor(
    text: string,
    style: Partial<PIXI.ITextStyle> | PIXI.TextStyle | undefined = undefined,
    public anchor: {
      x: number,
      y: number
    } = {x: 0, y: 0}
  ) {
    this._text = new PIXI.Text(text, style)
    application.stage.addChild(this._text)
  }


  public changeText(text: string) {
    this._text.text = text
  }
  
  public get text(): PIXI.Text {
    return this._text
  }
}
