// part 2 : https://youtu.be/EaZxUCWAjb0 -- adding obstacles
//right now, its going out of memory
cols = 6
rows = 6
var openSet = []
var closedSet = []
var w,h
var start, end
var grid = new Array(cols)
stop = true

function heuristic(a, b){
  //return dist(a.i, a.j, b.i, b.j)  // Euclidean distance -- not useful since we can only walk horizontally and vertically
  //TODO: Change this. We are getting corner paths everytime
  //TODO: Include obstacles
  //TODO: Where on the page is canvas displayed
  // TODO: Change where the input text is placed
  return abs(b.i-a.i) + abs(b.j-a.j) // Manhattan distance
}

function Spot(i, j){
  this.i = i
  this.j = j
  this.f  = 0
  this.g  = 0
  this.h  = 0
  this.neighbors = []
  this.previous = undefined
  
  this.addNeightbors = function(){
    if(i<cols-1){      this.neighbors.push(grid[this.i+1][j])
                }
    if(j<rows-1){
    this.neighbors.push(grid[this.i][j+1])
    }
    if(i>0){
  this.neighbors.push(grid[this.i-1][j])
    }
    if(j>0){
    this.neighbors.push(grid[this.i][j-1])
    }
  
  }

  this.show = function(color){
    fill(color)
    stroke(0)
    rect(this.i*(w-1), this.j*(h-1), w-1, h-1)
  }
}

function start_drawing(){
  stop = false
  loop()
}

function pause_drawing(){
  stop = true
  noLoop()
}

function setup() {
  createCanvas(400, 400);
  noLoop()

  input = createInput('Enter width here..');
  input.position(0, height + 100);

  input = createInput('Enter height here..');
  input.position(0, height + 130);

  button = createButton('Submit Values');
  button.position(0,height + 160);
  button.mousePressed(drawGrid);

  button = createButton('Resume/Start');
  button.position(0,height + 190);
  button.mousePressed(start_drawing);

  button = createButton('Pause');
  button.position(0,height+220);
  button.mousePressed(pause_drawing);
  
}

function drawGrid(){
  noLoop()
  openSet = []
  closedSet = []
  w  = width / cols
  h = height / rows
  for(var i=0 ;i < cols; i++){
    grid[i] = new Array(rows)
  }
  
  for(var i=0;i< cols; i++){
    for(var j=0;j<rows;j++){
      grid[i][j] = new Spot(i,j);
    }
  }
  
  for(var i=0;i< cols; i++){
    for(var j=0;j<rows;j++){
      grid[i][j].addNeightbors()
    }
  }
  
  start = grid[0][0]
  end = grid[cols-1][rows-1]
  
  openSet.push(start)

  for(var i=0;i< cols; i++){
    for(var j=0;j<rows;j++){
      grid[i][j].show(color(0,0,0))
    }
  }
}

function draw() {
  if(stop) {
    return
  }
  debugger;
  background(220);
  path = []
  if(openSet.length > 0){
    //Keep going
    var shortestPathNode = 0;
    for(var i=0; i < openSet.length; i++){
      if(openSet[i].f < openSet[shortestPathNode].f){
        shortestPathNode = i
      }
    }
    
    if (openSet[shortestPathNode] === end){
      //Here we can retrace the path back from end -> end.previous -> ....
      node = end
      while(node != start){
        path.push(node)
        node = node.previous
      }
      path.push(start)
      console.log('done!')
      noLoop()
    }
    var current = openSet[shortestPathNode]
    
    closedSet.push(current)
    openSet.splice(shortestPathNode, 1)
    for (var idx in current.neighbors){
      nbr = current.neighbors[idx]
      if (closedSet.indexOf(nbr) != -1){
        continue
      }
      if(openSet.indexOf(nbr) != -1 &&  nbr.g < current.g + 1){
        continue}
      if(openSet.indexOf(nbr) != -1 &&  nbr.g >= current.g + 1){
        nbr.g = current.g + 1
        nbr.previous = current 
      }
      
      openSet.push(nbr)
      nbr.g = current.g + 1
      nbr.h = heuristic(nbr, end)
      nbr.f = nbr.g + nbr.h
      nbr.previous = current 
    }
    
    
  } else {
    //Stop and exit!
    noLoop()
    stop = true
  }
  
  //Draw the grid -- for debugging
  for(var i=0;i< cols; i++){
    for(var j=0;j<rows;j++){
      grid[i][j].show(color(0,0,0))
    }
  }
  
  for(var k=0; k < closedSet.length; k++){
    closedSet[k].show(color(255,0,0))
  }
  
  print('Open set is this big',openSet.length)
  for(k=0; k < openSet.length; k++){
    openSet[k].show(color(0,255,0))
  }
      
  if(path){
    for(var t=0; t< path.length; t++){
      path[t].show(color(0,0,255))
    }
  }
}