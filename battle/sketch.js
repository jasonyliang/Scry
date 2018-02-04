let t
let depth
let blocks
let mouseDown
let currentColor
let mode
let cnv
let timeSlider, addInfantryModeButton,addCavalryModeButton, selectModeButton, pathModeButton, saveButton, playModeButton
let epoch
let lastMouse, lastAngle

var img

function preload() {

  img = loadImage('https://upload.wikimedia.org/wikipedia/commons/b/b4/Map_of_Ancient_Rome_260-269_AD-es.svg')
}

function setup() {

  cnv = createCanvas(1400,840)
  cnv.mousePressed(recordDown)

  blocks = []
  currentColor = color(255,0,0)

  mouseDown = createVector(-1,0)
  lastMouse = []
  lastAngle = -100
  currentPath = []
  mode = 'addInfantry'

  epoch = [0,10000]
  timeSlider = createSlider(epoch[0],epoch[1],0,1)

  pathModeButton = createButton('Delete')
  pathModeButton.mousePressed(deleteSelection)

  pathModeButton = createButton('Red')
  pathModeButton.mousePressed(setRed)

  playModeButton = createButton('Blue')
  playModeButton.mousePressed(setBlue)

  killButton = createButton('Kill')
  killButton.mousePressed(kill)

  playModeButton = createButton('Play')
  playModeButton.mousePressed(playMode)

  saveButton = createButton('Save')
  saveButton.mousePressed(saveBlocks)

}

function setRed() {
  currentColor = color(255,0,0)
}

function kill() {
  for(let i = 0;i<blocks.length;i++) {
    if (blocks[i].isSelected){
      for(let j = t; j < epoch[1]; j++) {
        blocks[i].path[j] = createVector(-blocks[i].size,-blocks[i].size)
      }
    }
  }
}

function saveBlocks() {
  saveJSON(convertToJSON(blocks), 'save.json', false)
}

function setBlue() {
  currentColor = color(50,50,255)
}

function playMode() {
  if (mode!='play') {
    mode = 'play'
  } else {
    mode = 'select'
  }
}

function addInfantryMode() {
  mode = 'addInfantry'
}

function addCavalryMode() {
  mode = 'addCavalry'
}

function selectMode() {
  mode = 'select'
}

function pathMode() {
  mode = 'path'
}

function deleteSelection() {
  let i = 0
  while(i<blocks.length) {
    if (blocks[i].isSelected){
      blocks.splice(i,1)
    } else {
      i++
    }
  }
}

function draw() {

  background(img)
  image(img,-500,0,2000,1200)
  for (let i = 0, len = blocks.length; i < len; i++) {
    blocks[i].update()
  }

  t = timeSlider.value()
  strokeWeight(0)
  fill(255)
  text('t = ' + str(t),10,10)

  if (mouseIsPressed && mouseDown.x >= 0) {
    if (mode == 'addInfantry' || mode == 'addCavalry') {
      temp()
    }

    if (mode == 'select') {
      selectBox()
    }
    if (mode == 'path') {
      recordPath()
    }

  }
  if (mode == 'play') {
    timeSlider.value(t+1)
  }

  append(lastMouse,createVector(mouseX,mouseY))
  if (lastMouse.length > 30) {
    lastMouse.splice(0,1)
  }

  /*
  if (blocks.length > 0) {
    c = blocks[blocks.length-1]
    if (mode == 'addInfantry' && c instanceof Infantry && !mouseIsPressed) {
      push()
      translate(mouseX,mouseY)
      rotate(c.angle)
      fill(red(currentColor),green(currentColor),blue(currentColor),50)
      stroke(0)
      strokeWeight(1)
      rect(0,0,c.size,c.size/2)
      line(-c.size/2,-c.size/4,c.size/2,c.size/4)
      line(-c.size/2,c.size/4,c.size/2,-c.size/4)
      pop()
    }
    if (mode == 'addCavalry' && c instanceof Cavalry && !mouseIsPressed) {
      push()
      translate(mouseX,mouseY)
      rotate(c.angle)
      fill(red(currentColor),green(currentColor),blue(currentColor),50)
      stroke(0)
      strokeWeight(1)
      rect(0,0,c.size,c.size/2)
      line(-c.size/2,-c.size/4,c.size/2,c.size/4)
      pop()
    }
  }
  */

  if (mode == 'pathMode') {
    path = true
  }else{
    path = false
  }
}

class Block {
  constructor(pos, angle, size, color) {
    this.size = size
    this.color = color
    this.isSelected = false
    this.path = []
    this.angles =[]
    for (let i = epoch[0]; i <= epoch[1]; i++) {
      append(this.path, pos)
      append(this.angles, angle)
    }
  }

  update() {
    this.pos = this.path[t]

    rectMode(CENTER)
    push()
    translate(this.pos.x,this.pos.y)
    rotate(this.angles[t])
    fill(this.color)
    if (this.isSelected) {
      fill(red(this.color)-50,green(this.color)-50,blue(this.color)-50)
    }
    stroke(0)
    strokeWeight(1)
    rect(0,0,this.size,this.size/2)
    pop()
  }
}

class Infantry extends Block {
  constructor(pos, angle, size, color) {
    super(pos, angle, size, color)
  }

  update() {
    this.pos = this.path[t]
    this.angle = this.angles[t]

    rectMode(CENTER)
    push()
    translate(this.pos.x,this.pos.y)
    rotate(this.angle)
    fill(this.color)
    if (this.isSelected) {
      fill(red(this.color)-100,green(this.color)-100,blue(this.color)-100)
    }
    stroke(0)
    strokeWeight(1)
    rect(0,0,this.size,this.size/2)
    line(-this.size/2,-this.size/4,this.size/2,this.size/4)
    line(-this.size/2,this.size/4,this.size/2,-this.size/4)
    pop()
  }
}

class Cavalry extends Block {
  constructor(pos, angle, size, color) {
    super(pos, angle, size, color)
  }

  update() {
    this.pos = this.path[t]
    this.angle = this.angles[t]

    rectMode(CENTER)
    push()
    translate(this.pos.x,this.pos.y)
    rotate(this.angle)
    fill(this.color)
    if (this.isSelected) {
      fill(red(this.color)-100,green(this.color)-100,blue(this.color)-100)
    }
    stroke(0)
    strokeWeight(1)
    rect(0,0,this.size,this.size/2)
    line(-this.size/2,-this.size/4,this.size/2,this.size/4)
    pop()
  }
}

class City {
  constructor(pos) {
    this.pos = pos
    this.color = currentColor
  }

  update() {
    push()
    translate(this.pos.x,this.pos.y)
    fill(this.color)
    if (this.isSelected) {
      fill(red(this.color)-100,green(this.color)-100,blue(this.color)-100)
    }
    stroke(0)
    strokeWeight(1)
    star(0,0,10,20,5)
    pop()
  }
}

function star(x, y, radius1, radius2, npoints) {
  var angle = TWO_PI / npoints;
  var halfAngle = angle/2.0;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius2;
    var sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a+halfAngle) * radius1;
    sy = y + sin(a+halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function recordDown() {
  mouseDown = createVector(mouseX,mouseY)
  if (mode == 'path'){
    selects = blocksSelected()
  }
  lastMouse = []
  lastAngle = -100
}

function makeBlock(type) {
  let dx = mouseX-mouseDown.x
  let dy = mouseY-mouseDown.y
  let mag = (dx**2+dy**2)**.5

  if (mag >= 3 && mouseDown.x >= 0) {

    let angle = findAngle(mouseDown,createVector(mouseX,mouseY))

    let size = 4*mag/sqrt(5)
    size  = int(map(size,0,200,0,10))
    size = map(size,0,10,0,200)

    let i
    if (type == 'cavalry') {
      i = new Cavalry(createVector(mouseDown.x,mouseDown.y),angle,size,currentColor)
    }else{
      i = new Infantry(createVector(mouseDown.x,mouseDown.y),angle,size,currentColor)
    }

    append(blocks,i)

  }else if (mag<3 && blocks.length>0){
    let i
    let c = blocks[blocks.length-1]
    if (mode == 'addCavalry' && c instanceof Cavalry) {
      i = new Cavalry(createVector(mouseDown.x,mouseDown.y),c.angle,c.size,currentColor)
      append(blocks,i)
    }else if (mode == 'addInfantry' && c instanceof Infantry){
      i = new Infantry(createVector(mouseDown.x,mouseDown.y),c.angle,c.size,currentColor)
      append(blocks,i)
    }

  }
}

function recordPath() {
  group = blocksSelected()
  if (t+1<epoch[1] && lastMouse.length>10 && group.length > 0) {
    timeSlider.value(t+1)

    let dMouse = subtract(createVector(mouseX,mouseY),lastMouse[lastMouse.length-1])

    if (keyIsDown(SHIFT)) {
      if(abs(dMouse.x) > abs(dMouse.y)) {
        for(let i = 0; i < group.length; i++) {
          blocks[group[i]].path[t+1] = createVector(blocks[group[i]].path[t].x + dMouse.x,blocks[group[i]].path[t].y)
          blocks[group[i]].angles[t+1] = blocks[group[i]].angles[t]
        }
      }else if (abs(dMouse.y) > abs(dMouse.x)) {
        for(let i = 0; i < group.length; i++) {
          blocks[group[i]].path[t+1] = createVector(blocks[group[i]].path[t].x,blocks[group[i]].path[t].y+dMouse.y)
          blocks[group[i]].angles[t+1] = blocks[group[i]].angles[t]
        }
      }else{
        for(let i = 0; i < group.length; i++) {
          blocks[group[i]].path[t+1] = createVector(blocks[group[i]].path[t].x,blocks[group[i]].path[t].y)
          blocks[group[i]].angles[t+1] = blocks[group[i]].angles[t]
        }
      }
    }else{

      let avgD = dMouse
      for (let i = 0; i<lastMouse.length-1; i++) {
        avgD = add(avgD,subtract(lastMouse[i+1],lastMouse[i]))
      }
      let mag = magnitude(avgD)
      let mouseAng
      if (mag>5) {
        mouseAng = findAngle(createVector(0,0),avgD)
      }else{
        mouseAng = lastAngle
      }

      if (mouseAng > -100 && lastAngle == -100) {
        lastAngle = mouseAng
      }

      for(let i = 0; i < group.length; i++) {

        let relativePos = subtract(blocks[group[i]].path[t],lastMouse[lastMouse.length-1])
        let relativeAng = findAngle(createVector(mouseX,mouseY),blocks[group[i]].path[t])

        let th = mouseAng - lastAngle

        let disp = magnitude(relativePos)

        let relativeNew = vRotate(relativePos, th)

        if (mag>5) {
          blocks[group[i]].path[t+1] = add(createVector(mouseX,mouseY),relativeNew)
          pAngle = blocks[group[i]].angles[t]
          blocks[group[i]].angles[t+1] = pAngle + th
        }else{
          blocks[group[i]].path[t+1] = blocks[group[i]].path[t]
          blocks[group[i]].angles[t+1] = blocks[group[i]].angles[t]
        }
      }
      lastAngle = mouseAng
    }
  }
}

function vRotate(p1, theta) {
  xp = p1.x*cos(theta) - p1.y*sin(theta)
  yp = p1.x*sin(theta) + p1.y*cos(theta)
  return createVector(xp,yp)
}

function subtract(p2,p1) {
  return createVector(p2.x-p1.x,p2.y-p1.y)
}

function add(p2,p1) {
  return createVector(p2.x+p1.x,p2.y+p1.y)
}

function selectBox() {
  rectMode(CORNER)
  let corner = createVector(mouseX,mouseY)
  if (mouseDown.x < mouseX) {
    corner.x = mouseDown.x
  }
  if (mouseDown.y < mouseY) {
    corner.y = mouseDown.y
  }
  strokeWeight(1)
  stroke(255)
  fill(0, 126, 255, 102)
  rect(corner.x,corner.y,abs(mouseDown.x-mouseX),abs(mouseDown.y-mouseY))
}

function findAngle(p1,p2) {
  let angle

  let dx = p2.x-p1.x
  let dy = p2.y-p1.y
  let mag = (dx**2+dy**2)**.5

  if (mag == 0) {
    return 0
  }
  if (p2.x > p1.x) {
    angle = asin(dy/mag)-PI/2
  } else {
    angle = acos(dy/mag)
  }
  return angle
}

function magnitude(v) {
  return (v.x**2+v.y**2)**.5
}

function temp() {
  let mag = magnitude(subtract(createVector(mouseX,mouseY),mouseDown))

  if (mag >= 3) {
    rectMode(CENTER)
    let angle = findAngle(mouseDown,createVector(mouseX,mouseY))

    push()
    translate(mouseDown.x,mouseDown.y)

    rotate(angle)
    fill(currentColor)
    stroke(0)
    strokeWeight(1)
    let size = 4*mag/sqrt(5)
    size  = int(map(size,0,200,0,10))
    size = map(size,0,10,0,200)

    rect(0,0,size,size/2)
    line(-size/2,-size/4,size/2,size/4)
    if (mode == 'addInfantry') {
      line(-size/2,size/4,size/2,-size/4)
    }
    noFill()
    stroke(250)
    ellipse(0,0,2*mag,2*mag)
    line(0,0,0,mag)

    pop()

  }
}

function mouseReleased() {
  if (mode == 'addInfantry') {
    makeBlock('infantry')
  }

  if (mode == 'addCavalry') {
      makeBlock('cavalry')
  }

  if (mode == 'select') {
    mouse = createVector(mouseX,mouseY)
    for (let i = 0, len = blocks.length; i < len; i++) {
      if (isInRect(blocks[i].pos,mouseDown,mouse)) {
        blocks[i].isSelected = true
      }else{
        blocks[i].isSelected = false
      }
    }
  }

  mouseDown.x = -1
}

function isInRect(p, r0, r1) {
  if (r0.x > r1.x) {
    rtemp = r1.x
    r1.x = r0.x
    r0.x = rtemp
  }
  if (r0.y > r1.y) {
    rtemp = r1.y
    r1.y = r0.y
    r0.y = rtemp
  }
  if (p.x > r0.x && p.x < r1.x && p.y > r0.y && p.y < r1.y) {
    return true
  }
  return false
}

function blocksSelected() {
  selected = []
  for (let i = 0, len = blocks.length; i < len; i++) {
    if (blocks[i].isSelected) {
      append(selected,i)
    }
  }
  return selected
}

function convertToJSON(arr) {
  output = []

  for (let a = 0; a < arr.length; a++) {
    points = []
    for (let i = 0; i < arr[a].path.length; i++) {
      append(points,{x:arr[a].path[i].x,y:arr[a].path[i].y})
    }
    append(output,{path:points,angles:arr[a].angles,color:arr[a].color,size:arr[a].size})
  }
  return output
}
