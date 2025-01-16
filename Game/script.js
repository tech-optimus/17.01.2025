//world variable
var deg = Math.PI/180;

//define the player class
function player(x,y,z,rx,ry){
	this.x = x;
	this.y = y;
	this.z = z;
	this.rx = rx;
	this.ry = ry;
}

//variables for movement
var PressLeft = 0;
var PressRight = 0
var PressForward = 0;
var PressBack = 0;
var PressUp = 0;
var MouseX = 0;
var MouseY = 0;

var canlock = false;

var coinSound = new Audio;
coinSound.src = "Sounds/coin.wav";

var keySound = new Audio;
keySound.src = "Sounds/key.wav";

var map = [
	//x y z rx ry rz width height color
	[0,0,-1000,0,0,0,2000,200,"Pattern/wall.avif"],
	[0,0,1000,0,0,0,2000,200,"Pattern/wall.avif"],
	[1000,0,0,0,90,0,2000,200,"#C0FFFF"],
	[-1000,0,0,0,90,0,2000,200,"#C0FFFF",0.2],
	[0,100,0,90,0,0,2000,2000,"#665544"],
	
	//cube
	[0,0,-500,0,0,0,200,200,"#FFFF00",0.5],//back wall
	[0,0,-300,0,0,0,200,200,"#FF0000",0.5],//front wall
	[100,0,-400,0,90,0,200,200,"#FF00FF",0.5],
	[-100,0,-400,0,90,0,200,200,"#0000FF",0.5],
	[0,100,-400,90,0,0,200,200,"#00FFFF",0.5],
	[0,-100,-400,90,0,0,200,200,"#00FF00",0.5],
	
	//door
	[0,0,-1000,0,0,0,100,200,"Pattern/door.png"],
	//window
	[0,0,1000,0,0,0,139,200,"Pattern/window.png"],
]

var coins = [
	[800,30,-800,0,0,0,50,50,"#FFFF00",1,50],
	[-300,30,-300,0,0,0,50,50,"#FFFF00",1,50],
	[-500,30,200,0,0,0,50,50,"#FFFF00",1,50]
]

var keys = [
	[-800,30,300,0,0,0,50,50,"#FF0000"],
	[-300,30,300,0,0,0,50,50,"#FF0000"],
	[200,30,-500,0,0,0,50,50,"#FF0000"]
]

//variable fo locked mouse
var lock = false;

//link variable to container
var container = document.getElementById("container");

//if the mouse is pressed
container.onclick = function(){
	if (canlock) container.requestPointerLock();
}

//if the is pressed
document.addEventListener("keydown", (event) => {
	if (event.key == "a"){
		PressLeft = 1;
	}
	if (event.key == "d"){
		PressRight = 1;
	}
	if (event.key == "w"){
		PressForward = 5;
	}
	if (event.key == "s"){
		PressBack = 1;
	}
	if (event.keyCode == 32){
		PressUp = 1;
	}
})

//if the key is released
document.addEventListener("keyup", (event) => {
	if (event.key == "a"){
		PressLeft = 0;
	}
	if (event.key == "d"){
		PressRight = 0;
	}
	if (event.key == "w"){
		PressForward = 0;
	}
	if (event.key == "s"){
		PressBack = 0;
	}
	if (event.keyCode == 32){
		PressUp = 0;
	}
})

//locked mouse listener
document.addEventListener("pointerlockchange", (event) => {
	lock = !lock;
})

//if the mouse moves
document.addEventListener("mousemove", (event) => {
	MouseX = event.movementX;
	MouseY = event.movementY;
})

var pawn = new player(0,0,0,0,0);

var world = document.getElementById("world");

function update(){
	//count movement
	//dx = PressRight - PressLeft;
	//dz = - (PressForward - PressBack);
	dx = (PressRight - PressLeft) * Math.cos(pawn.ry * deg) -
		 (PressForward - PressBack) * Math.sin(pawn.ry * deg);
	dz = - (PressRight - PressLeft) * Math.sin(pawn.ry * deg) -
		 (PressForward - PressBack) * Math.cos(pawn.ry * deg);
	
	dy = - PressUp;
	drx = MouseY;
	dry = - MouseX;
	MouseX = MouseY = 0;
	
	//add movement to the coordinates
	pawn.x = pawn.x + dx;
	pawn.y = pawn.y + dy;
	pawn.z = pawn.z + dz;
	//if the mouse is locked, then allow rotation
	if (lock) {
		pawn.rx = pawn.rx + drx;
		pawn.ry = pawn.ry + dry;
	}
	
	//change the coordinates of the world
	world.style.transform = "translateZ(600px)" +
							"rotateX(" + (-pawn.rx) + "deg)" +
							"rotateY(" + (-pawn.ry) + "deg)" +
	"translate3d(" + (-pawn.x) + "px," + (-pawn.y) + "px," + (-pawn.z) + "px)";
}

//function to transform array to the squares
function CreateNewWorld(){
	CreateSquares(map,"map");
}

function CreateSquares(squares,string){
	for (i = 0; i < squares.length; i++){
		//create rectangles and styles
		let newElement = document.createElement("div");
		newElement.className = string + " square";
		newElement.id = string + i;
		newElement.style.width = squares[i][6] + "px";
		newElement.style.height = squares[i][7] + "px";
		newElement.style.background = squares[i][8];
		newElement.style.backgroundImage = "url(" + squares[i][8] + ")";
		newElement.style.opacity = squares[i][9];
		newElement.style.borderRadius = squares[i][10] + "%";
		newElement.style.transform = 
		"translate3d(" + (600 - squares[i][6]/2 + squares[i][0]) + "px," +
						 (400 - squares[i][7]/2 + squares[i][1]) + "px," + 
						 squares[i][2] + "px)" +
		"rotateX(" + squares[i][3] + "deg)" + 
		"rotateY(" + squares[i][4] + "deg)" + 
		"rotateZ(" + squares[i][5] + "deg)";
		
		//insert rectangles into the world
		world.append(newElement);
	}
}

function interact(squares,string,soundObject){
	for (i = 0; i < squares.length; i++){
		let dto = (squares[i][0] - pawn.x)**2 + 
					(squares[i][1] - pawn.y)**2 +
					(squares[i][2] - pawn.z)**2;
		let ow = squares[i][6]**2;
		if (dto < ow){
			soundObject.play();
			document.getElementById(string + i).style.display = "none";
			squares[i][0] = 1000000;
			squares[i][1] = 1000000;
			squares[i][2] = 1000000;
		}
	}
}



function repeatFunction(){
	update();
	interact(coins,"coin",coinSound);
	interact(keys,"key",keySound);
}

