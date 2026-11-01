// Collidable furniture footprints in world coordinates. A character's position
// represents their shoes/feet, not their whole sprite; this preserves sensible
// depth-based walking in front of work surfaces and display plinths.
import {galleryFrames,roomWidth} from './rooms.js';
export const COLLIDERS = Object.freeze({
  lobby: [
    {name:'reception desk', x:1034, y:461, w:304, h:133},
    {name:'lobby sofa', x:325, y:454, w:190, h:102},
    {name:'left planter', x:236, y:508, w:68, h:65},
    {name:'center planter', x:910, y:507, w:65, h:66},
    {name:'right planter', x:1258, y:508, w:64, h:67}
  ],
  workshop: [
    {name:'electronics workbench', x:294, y:480, w:1762, h:123},
    {name:'capstone bench', x:2084, y:480, w:372, h:123},
    {name:'plant', x:182, y:520, w:56, h:56}
  ],
  gallery: [
    // One plinth under each framed project; these follow the gallery layout.
    ...galleryFrames.map(f=>({name:`${f.project.id} plinth`, x:f.cx-131, y:480, w:262, h:124})),
    {name:'left planter', x:275, y:506, w:69, h:64},
    {name:'right planter', x:roomWidth('gallery')-96, y:515, w:66, h:62}
  ]
});

export const PLAYER_HALF_WIDTH=14;
export const PLAYER_FOOT_RADIUS=5;

export function isWalkable(room,x,y){
  const colliders=COLLIDERS[room] || [];
  return colliders.every(area =>
    x+PLAYER_HALF_WIDTH<=area.x ||
    x-PLAYER_HALF_WIDTH>=area.x+area.w ||
    y+PLAYER_FOOT_RADIUS<=area.y ||
    y-PLAYER_FOOT_RADIUS>=area.y+area.h
  );
}

// Separately resolve axes, so approaching an object at an angle naturally
// slides along its edge instead of abruptly stopping both directions.
export function moveWithCollision(room,x,y,dx,dy){
  const nextX=isWalkable(room,x+dx,y)?x+dx:x;
  const nextY=isWalkable(room,nextX,y+dy)?y+dy:y;
  return {x:nextX,y:nextY};
}
