cols = 6 //default number of columns
rows = 6 //default number of rows
var openSet = []
var closedSet = []
var w,h
var start, end
var input1,input2
var grid
stop = true

function heuristic(a, b){
  //return dist(a.i, a.j, b.i, b.j)  // Euclidean distance -- not useful since we can only walk horizontally and vertically
  //TODO: Change this. We are getting corner paths everytime
  //TODO: Where on the page is canvas displayed
  // TODO: Change where the input text is placed
  // return dist(a.i,a.j, b.i,b.j) // Manhattan distance
}

function Spot(i, j){
  this.i = i
  this.j = j
  this.f  = 0
  this.g  = 0
  this.h  = 0
  this.neighbors = []
  this.previous = undefined
  this.wall = false
  if(random() < 0.3){
  	this.wall = true
  }
  
  this.addNeightbors = function(){
    if(i<cols-1){      this.neighbors.push(grid[i+1][j])
                }
    if(j<rows-1){
    this.neighbors.push(grid[i][j+1])
    }
    if(i>0){
  this.neighbors.push(grid[i-1][j])
    }
    if(j>0){
    this.neighbors.push(grid[i][j-1])
    }
    //Diagonal neighbors
    if(i>0 && j>0) this.neighbors.push(grid[i-1][j-1])
    if(i>0 && j<rows-1) this.neighbors.push(grid[i-1][j+1])
    if(i<cols-1 && j>0) this.neighbors.push(grid[i+1][j-1])
    if(i<cols-1 && j<rows-1) this.neighbors.push(grid[i+1][j+1])
  }

  this.show = function(color){
    fill(color)
    if(this.wall){
    	fill(255, 255, 255)
    }
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

  input1 = createInput('Enter number of columns here..');
  input1.position(0, height + 100);

  input2 = createInput('Enter number of rows here..');
  input2.position(0, height + 130);

  button1 = createButton('Submit Values');
  button1.position(0,height + 160);
  button1.mousePressed(drawGrid);

  button2 = createButton('Resume/Start');
  button2.position(0,height + 190);
  button2.mousePressed(start_drawing);

  button3 = createButton('Pause');
  button3.position(0,height+220);
  button3.mousePressed(pause_drawing);
  
}

function drawGrid(){
  createCanvas(400, 400);
  noLoop()
  openSet = []
  closedSet = []
  cols = input1.value()
  rows = input2.value()
  w  = width / cols
  h = height / rows
  grid = new Array(cols)
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
  start.wall = false
  end.wall = false
  
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
    //Search for the next spot to explore
    for (var idx in current.neighbors){
      nbr = current.neighbors[idx]
      //vertical or horizontal step
      var step = 1
      //diagonal step
      if(abs(nbr.i - current.i)+abs(nbr.j - current.j) == 2) step = sqrt(2)
      
      if(nbr.wall)
      	continue
      if (closedSet.indexOf(nbr) != -1){
        continue
      }
      if(openSet.indexOf(nbr) != -1 &&  nbr.g < current.g + 1){
        continue}
      if(openSet.indexOf(nbr) != -1 &&  nbr.g >= current.g + 1){
        nbr.g = current.g + step
        nbr.previous = current
        continue
      }
      
      openSet.push(nbr)
      nbr.g = current.g + step
      nbr.h = heuristic(nbr, end)
      nbr.f = nbr.g + nbr.h
      nbr.previous = current 
    }
    
    
  } else {
    //Stop and exit!
    console.log('No path exists!')
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
  
  // print('Open set is this big',openSet.length)
  // for(k=0; k < openSet.length; k++){
  //   openSet[k].show(color(0,255,0))
  // }
      
  if(path){
    for(var t=0; t< path.length; t++){
      path[t].show(color(0,0,255))
    }
  }
}