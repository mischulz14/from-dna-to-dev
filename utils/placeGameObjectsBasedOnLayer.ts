import * as Phaser from 'phaser';

import { IEventTriggerData } from '../api/eventTriggerDataObj';
import EventTrigger from '../gameObjects/EventTrigger';
import InteractiveGameObject from '../gameObjects/InteractiveGameObject';

interface IPlaceGameObjectBasedOnLayer {
  scene: Phaser.Scene;
  layer: Phaser.Tilemaps.TilemapLayer;
  classType: any;
  data: IEventTriggerData;
}

export function placeGameObjectBasedOnLayer(
  scene: Phaser.Scene,
  layer: Phaser.Tilemaps.TilemapLayer,
  classType: typeof EventTrigger | typeof InteractiveGameObject,
  key: string,
  data: IEventTriggerData,
  pixelX: number,
  pixelY: number,
  playAnimation: boolean,
) {
  layer.forEachTile((tile) => {
    // find the one that doesnt have -1 as index
    if (tile.index !== -1) {
      const gameObject = new classType(
        scene,
        tile.pixelX + pixelX,
        tile.pixelY + pixelY,
        key,
        'E',
        'Interact',
        data.dialogueNodesObj,
        data.triggerEventWhenDialogueEnds,
        data.updateDialogueNodeBasedOnPlayerState,
      );

      if (playAnimation) {
        gameObject.play(key);
      }
    }
  });
}
