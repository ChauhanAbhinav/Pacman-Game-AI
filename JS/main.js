import { OBJECT_TYPES, X_LENGTH, Y_LENGTH, INIT_COORDINATES, GHOST_PARAMS } from "./config/vars.js";
import { JSON_FLIP, DEEP_COPY } from "./lib/common.js";
import { MAZE } from "./maze.js";
import { moveGost } from "./ghost.js";

const OBJECTS = JSON_FLIP(OBJECT_TYPES)
let pacman = DEEP_COPY(INIT_COORDINATES)
let ghost = DEEP_COPY(INIT_COORDINATES)
let source = DEEP_COPY(INIT_COORDINATES)
let destination = DEEP_COPY(INIT_COORDINATES)
let score = 0, START = false

const drawMAZE = () =>{
    document.getElementById("maze").innerHTML=''
    for (let y = 0; y < MAZE.length; y++) {
        for (let x = 0; x < MAZE[y].length; x++) {
            const obj = MAZE[y][x]
            document.getElementById("maze").innerHTML+=`<div class="OBJECT ${OBJECTS[obj]}"></div>`
            if(obj===OBJECT_TYPES['PACMAN']) {
                pacman['x'] = x
                pacman['y'] = y
            } else 
            if(obj===OBJECT_TYPES['GHOST']) {
                ghost['x'] = x
                ghost['y'] = y
            }
        }
    }
}
drawMAZE();

window.onkeydown = (e)=>{
    if(!START) {
        startGhost(ghost); // enable ghost
        START = true
    }
    source = DEEP_COPY(pacman)
    destination = DEEP_COPY(pacman)
    let key = ''
    switch (e.code) {
        case 'ArrowUp': 
            key = 'u'
            if((destination['y']-1) > -1) {
                destination['y']--
            } else {
                destination['y'] = Y_LENGTH -1 // Enter from other side of maze
            }
            break;
        case 'ArrowDown':
            key = 'd'
            if((destination['y']+1) < (Y_LENGTH)) {
                destination['y']++
            } else {
                destination['y'] = 0 // Enter from other side of maze
            }
            break;
        case 'ArrowLeft':
            key = 'l'
            if((destination['x']-1) > -1) {
                destination['x']--
            } else {
                destination['x']= X_LENGTH-1 // Enter from other side of maze
            }
            break;
        case 'ArrowRight':
            key = ''
            if((destination['x']+1) < (X_LENGTH)) {
                destination['x']++
            } else {
                destination['x']= 0 // Enter from other side of maze
            }
            break;
        default:
            return // any else key -do nothing
    }
    // Avoid WALL
    if(MAZE[destination['y']][destination['x']] === OBJECT_TYPES['WALL']) {
        destination = DEEP_COPY(pacman)
        return
    }
    pacman = DEEP_COPY(destination)
    // console.log("Moving pacman to",pacman)
    movePacman(source, destination, key)
}

const movePacman = (source, destination, key) => {
    // getting index on MAZE
    const DESTINATION_INDEX = X_LENGTH * destination['y'] + destination['x']
    const SOURCE_INDEX = X_LENGTH * source['y'] + source['x']

    let objects = document.getElementsByClassName("OBJECT");

    let object_type = MAZE[destination['y']][destination['x']];
    let object_class = OBJECTS[object_type]

    // remove destination class add PACMAN
    objects[DESTINATION_INDEX].classList.remove(object_class)
    objects[DESTINATION_INDEX].classList.add('PACMAN')

    if(key) {
        objects[DESTINATION_INDEX].classList.add('rotate-'+key)
    }
    
    // remove source class PACMAN
    objects[SOURCE_INDEX].classList.remove('PACMAN')
    objects[SOURCE_INDEX].className = objects[SOURCE_INDEX].className.replace(/rotate-/g, "");
    
    if(object_type === OBJECT_TYPES['COIN']) {
        increaseScore();
    }
}

const increaseScore = ()=>{
score++;
document.getElementById("score").innerHTML = score
}

let ghostInterval

const startGhost = (ghost)=>{
    let ms = 1 / GHOST_PARAMS.velocity * 1000
    ghostInterval = setInterval(() => {
        moveGost(ghost, pacman);
        // stopGhost()
    }, ms);
}

// Will stop the ghost
const stopGhost = ()=>{
    clearInterval(ghostInterval)
}