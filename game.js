//the player can change to teleport or bomb( '`'-movement  '1'-bomb  '9'-teleport); main iterraction button is LMB
//'space' - end turn

var grid=[];
var sX=120, sY=75;
var blockSize=12;
var player={x:0,y:0,weapon:"move",bombs:5,teleports:5,search:false,moves:0};
var enemy={x:0,y:0,weapon:"move",bombs:5,teleports:5,search:false};
var bomb={x:0,y:0};
var turn=0;
let search=false, exploded=false;
var gameover=false;
//create grid array
for(let x=0;x<sX;x++){
	grid[x]=[];
	for(let y=0;y<sY;y++){
		if(Math.random()>0.51){
			grid[x][y]=1;
		}
	}
}
//generation function
function GenerateTerrain(){
	for(let x=0;x<sX;x++){
		for(let y=0;y<sY;y++){
			let neighbours=0;
			for(let i=-1;i<=1;i++){
				for(let j=-1;j<=1;j++){
					if(i==0 && j==0){continue}
					if((x+i>=sX) || (x+i<=0) || (y+j<=0) || (y+j>=sY)){continue}
					else if(grid[x+i][y+j]==1){
						neighbours++;
					}
				}
			}
			if(neighbours<4 ){
				grid[x][y]=0;
			}else if(neighbours>4){
				grid[x][y]=1
			}
		}
	}
	
}
//Find spawn point function
function FindSpawn(index){
	if(!index.search){
		let a=Math.floor(Math.random()*sX);
		let b=Math.floor(Math.random()*sY);
		if(grid[a][b]==0){
			index.x=a;
			index.y=b;
			index.search=true;
		}
	}
}
//grvity 
function gravity(index){
	if(grid[index.x][index.y+1]==0){
		grid[index.x][index.y]=0;
		index.y++;
	}
}
//explode function
function explode(explosive){
	for(let x=-2;x<=2;x++){
		for(let y=1;y<=3;y++){
			grid[explosive.x+x][explosive.y+y]=0;
		}
	}
	for(let x=-2;x<=2;x++){
		for(let y=-1;y<=-3;y--){
			grid[explosive.x+x][explosive.y+y]=0;
		}
	}
}
//throwing bomb function
function throwBomb(explosive,index){
if(Math.abs(mouseX-(index.x*blockSize))<=150 && Math.abs(mouseY-(index.y*blockSize))<=150){
    explosive.x=Math.floor(mouseX/blockSize);
    explosive.y=Math.floor(mouseY/blockSize);
    explode(explosive)
}else{ 
	console.log("you can't throw there")
	index.bombs++;
    return;
}
}
//weapon switch function
function switchWeapon(index,key){
    switch(key){
        case 49:
            index.weapon="bomb";
            break;
        case 50:
            index.weapon="";
            break;
        case 51:
            index.weapon="";
            break;
        case 57:
			index.weapon="teleport";
			break;
		case 192:
			index.weapon="move";
			break;
        default: break;
    }
}
//teleport function
function teleport(index){
    let mouseBlockX=Math.floor(mouseX/blockSize);
    let mouseBlockY=Math.floor(mouseY/blockSize);
    if(grid[mouseBlockX][mouseBlockY]==1){
		index.teleports++;
      return;
    }else{
        grid[index.x][index.y]=0;
        index.x=mouseBlockX;
        index.y=mouseBlockY;
    }
}
//movement
function move(index){
	let mouseBlockX=Math.floor(mouseX/blockSize);
		let dist=mouseBlockX-index.x;
		let a=0;
		if(dist<0){
			if(grid[index.x-1][index.y]==1){
				if(grid[index.x-1][index.y-1]==0){
					grid[index.x][index.y]=0;
					index.x--;
					index.y--;
				}else{
				console.log("can't go there")
				return;
				}
			}else{
			grid[index.x][index.y]=0;
			index.x--;
			}
		}else{
			if(grid[index.x+1][index.y]==1){
				if(grid[index.x+1][index.y-1]==0){
					grid[index.x][index.y]=0;
					index.x++;
					index.y--;
				}else{
				console.log("can't go there")
				return;
				}
			}else{
			grid[index.x][index.y]=0;
			index.x++;
			}
		}
}
//decides what to do with weapons function
function whatToDo(index){
    switch (index.weapon){
        case "bomb":
            if(index.bombs>0){
                throwBomb(bomb,index);
                index.bombs--;
                console.log("bombs left: "+index.bombs)
                break;
            }else{
                console.log("no more bombs")
                break;
            } 
        case "teleport":
            if(index.teleports>0){
                teleport(index);
                index.teleports--;
                console.log("teleports left: "+index.teleports)
                break;
            }else{
                console.log("no more teleports");
                break;
			}
		case "move":
			if(index.moves<10){
			index.moves++;
			move(index);
			break;
			}else{
				break;
			}
        default:
            console.log("nothing to do")
            break;
    }
}
//pathfinding
function FindPath(index,target){
	let distX, distY;
	distX=-(index.x-target.x);
	distY=-(index.y-target.y);
	if(distX<0){
		if(grid[index.x-1][index.y]==1){
			if(grid[index.x-1][index.y-1]==0){
				grid[index.x][index.y]=0;
				index.x--;
				index.y--;
			}else{
				for(let x=-2;x<=2;x++){
					for(let y=1;y<=3;y++){
						grid[index.x+x][index.y+y]=0;
					}
				}
				for(let x=-2;x<=2;x++){
					for(let y=-1;y<=-3;y--){
						grid[index.x+x][index.y+y]=0;
					}
				}
			return;
			}
		}else{
		grid[index.x][index.y]=0;
		index.x--;
		}
	}else{
		if(grid[index.x+1][index.y]==1){
			if(grid[index.x+1][index.y-1]==0){
				grid[index.x][index.y]=0;
				index.x++;
				index.y--;
			}else{
				for(let x=-2;x<=2;x++){
					for(let y=1;y<=3;y++){
						grid[index.x+x][index.y+y]=0;
					}
				}
				for(let x=-2;x<=2;x++){
					for(let y=-1;y<=-3;y--){
						grid[index.x+x][index.y+y]=0;
					}
				}
			return;
			}
		}else{
		grid[index.x][index.y]=0;
		index.x++;
		}
	}
	
	if(index.x==target.x && index.y==target.y){
		console.log("dead")
		gameover=true;
		return;
	}
}
let a=0;
function update() {
	a++;
	if(a<10){
	GenerateTerrain();
	}
	FindSpawn(player);
	FindSpawn(enemy)
	gravity(player);
	gravity(enemy);

	//update player position
	grid[player.x][player.y]=10;
	grid[enemy.x][enemy.y]=20;

	//call pathfinding
	if(turn==1){
		if(a%150==0){
			turn=0;
		}
		if(a>30){
			if(a%5==0){
			FindPath(enemy,player)
		}
	}
}

	if(turn==1){
		player.moves=0;
	}

	//outlines
	for(let i=0;i<sX;i++){
		grid[i][0]=1;
		grid[i][sY-1]=1;
	}
	for(let j=0;j<sY;j++){
		grid[0][j]=1;
		grid[sX-1][j]=1
	}

	if(gameover){
		return
	}

}

function draw() {
	//draw grid+player
	for(let x=0;x<sX;x++){
		for(let y=0;y<sY;y++){
			if(grid[x][y]==1){
				context.fillStyle="black";
			}else if(grid[x][y]==0){
				context.fillStyle="white";
			}else if(grid[x][y]==10){
				context.fillStyle="green";
			}else if(grid[x][y]==20){
				context.fillStyle="red";
			}
			context.fillRect(x*blockSize,y*blockSize,blockSize,blockSize);
		}
	}
	if(!gameover){	
		if(turn==0){
			context.fillStyle="green"
			context.font="30px Arial"
			context.fillText("player's turn",20,80)
		}else{
			context.fillStyle="red"
			context.font="30px Arial"
			context.fillText("CPU's turn",20,80)
		}
	}else{
			context.fillStyle="red"
			context.font="100px Arial"
			context.fillText("GAME OVER",400,400)
	}
	
}

function keyup(key) {
	if(turn==0){
	console.log(key)
	switchWeapon(player,key)
	}
	if(key==32){
		turn=1;
	}
}

function mouseup() {
	if(turn==0){
	whatToDo(player);
	}
}
