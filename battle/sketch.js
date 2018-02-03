let t
let depth
let blocks
let mouseDown
let currentColor
let mode
let cnv
let timeSlider, addInfantryModeButton,addCavalryModeButton, selectModeButton, pathModeButton, playModeButton
let epoch
let lastMouse, lastAngle

function setup() {
  cnv = createCanvas(1000,600)
  cnv.mousePressed(recordDown)

  blocks = []
  currentColor = color(255,0,0)

  mouseDown = createVector(-1,0)
  lastMouse = []
  lastAngle = 0
  currentPath = []
  mode = 'addInfantry'

  epoch = [0,1000]
  timeSlider = createSlider(epoch[0],epoch[1],0,1)

  addModeButton = createButton('Add Infantry')
  addModeButton.mousePressed(addInfantryMode)

  addModeButton = createButton('Add Cavalry')
  addModeButton.mousePressed(addCavalryMode)

  selectModeButton = createButton('Select')
  selectModeButton.mousePressed(selectMode)


  pathModeButton = createButton('Path')
  pathModeButton.mousePressed(pathMode)


  pathModeButton = createButton('Delete')
  pathModeButton.mousePressed(deleteSelection)

  playModeButton = createButton('Play')
  playModeButton.mousePressed(playMode)

  pathModeButton = createButton('Red')
  pathModeButton.mousePressed(setRed)

  playModeButton = createButton('Blue')
  playModeButton.mousePressed(setBlue)

}

function setRed() {
  currentColor = color(255,0,0)
}

function setBlue() {
  currentColor = color(0,0,255)
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
  background(100,200,100)
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
    rotate(this.angle)
    fill(this.color)
    if (this.isSelected) {
      fill(this.color.red()-50,this.color.green()-50,this.color.blue()-50)
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

function recordDown() {
  mouseDown = createVector(mouseX,mouseY)
  if (mode == 'path'){
    selects = blocksSelected()
  }
  print(1)
  lastMouse = []
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
      print('add')
      i = new Cavalry(createVector(mouseDown.x,mouseDown.y),angle,size,currentColor)
    }else{
      i = new Infantry(createVector(mouseDown.x,mouseDown.y),angle,size,currentColor)
    }

    append(blocks,i)

  }
}

function recordPath() {
  group = blocksSelected()
  if (t+1<epoch[1] && lastMouse.length>10 && group.length > 0) {
    timeSlider.value(t+1)

    let dMouse = subtract(createVector(mouseX,mouseY),lastMouse[lastMouse.length-1])

    let avgD = dMouse
    for (let i = 0; i<lastMouse.length-1; i++) {
      avgD = add(avgD,subtract(lastMouse[i+1],lastMouse[i]))
    }
    let mag = magnitude(avgD)
    let mouseAng
    if (mag>5) {
      mouseAng = findAngle(createVector(0,0),avgD) + PI
    }else{
      mouseAng = lastAngle
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


    push()
    translate(mouseX,mouseY)
    strokeWeight(2)
    line(0,0,50*cos(mouseAng),50*sin(mouseAng))
    pop()

    lastAngle = mouseAng
    /*
    let dAng = cAng - pAng

    push()
    translate(mouseX,mouseY)
    strokeWeight(2)
    line(0,0,avgD.x,avgD.y)
    stroke(255,0,0)
    line(0,0,avgD2.x,avgD2.y)
    pop()
    //blocks[group[0]].path[t+1] = add(createVector(mouseX,mouseY),relativeNew)

    blocks[group[0]].angles[t+1] = blocks[group[0]].angles[t]
    */
    //blocks[group[0]].angles[t+1] = relativePos[0]

    /*
    cAng = (findAngle(blocks[group[0]].path[t],blocks[group[0]].path[t+1]))%TWO_PI
    pAng = (blocks[group[0]].angles[t])%TWO_PI


    if (cAng == 0) {
      cAng = pAng
    }

    if (pAng-cAng>PI){
      pAng-=TWO_PI
    }else if (cAng-pAng>PI) {
      cAng-=TWO_PI
    }
    dAng = cAng - pAng

    if (abs(dAng)<PI/30) {
      blocks[group[0]].angles[t+1] = blocks[group[0]].angles[t] + dAng

    }else{

      blocks[group[0]].angles[t+1] = blocks[group[0]].angles[t] + dAng/abs(dAng)*PI/30

    }
    */
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
