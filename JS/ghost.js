import { GHOST_PARAMS, INIT_COORDINATES, OBJECT_TYPES, X_LENGTH, Y_LENGTH } from "./config/vars.js";
import { JSON_FLIP, DEEP_COPY, calculateDistance } from "./lib/common.js";
import { MAZE } from "./maze.js";

const OBJECTS = JSON_FLIP(OBJECT_TYPES)
let source = DEEP_COPY(INIT_COORDINATES)
let destination = DEEP_COPY(INIT_COORDINATES)
let START = false

// AI for ghost movement
const findGhostPath = (source, pacman)=>{
    console.log("source",source)
    let top = {x: source.x , y: source.y -1}
    let right = {x: source.x + 1 , y: source.y}
    let bottom = {x: source.x , y: source.y +1}
    let left = {x: source.x -1, y: source.y}

    // console.log(Math.min(calculateDistance(top, pacman),calculateDistance(right, pacman),calculateDistance(bottom, pacman), calculateDistance(left, pacman)))

    let topPathDist = checkForWall(top) ? Infinity : calculateDistance(top, pacman)
    let rightPathDist = checkForWall(right) ? Infinity : calculateDistance(right, pacman)
    let bottomPathDist = checkForWall(bottom) ? Infinity : calculateDistance(bottom, pacman)
    let leftPathDist = checkForWall(left) ? Infinity : calculateDistance(left, pacman)
    console.log(topPathDist, rightPathDist, bottomPathDist, leftPathDist)

    switch (Math.min(topPathDist, rightPathDist, bottomPathDist, leftPathDist)) {
        case topPathDist:
            console.log(topPathDist)
            return top

        case rightPathDist:
            console.log(rightPathDist)
            return right

        case bottomPathDist:
            console.log(bottomPathDist)
            return bottom

        case leftPathDist:
            console.log(leftPathDist)
            return left
        
        case Infinity:
            return pacman // special case
        
        default:
            return pacman
    }
}

// Move ghost by single step
export const moveGost = (ghost, pacman) => {
    // console.log("pacman recieved",pacman)
    if(!START) {
        source = DEEP_COPY(ghost)
        START = true
    } else {
        source = DEEP_COPY(destination)
    }
    
    destination = DEEP_COPY(findGhostPath(source, pacman)) // next destination path to pacman
    console.log(destination)

    // getting index on MAZE
    const DESTINATION_INDEX = X_LENGTH * destination['y'] + destination['x']
    const SOURCE_INDEX = X_LENGTH * source['y'] + source['x']

    let objects = document.getElementsByClassName("OBJECT");

    let object_type = MAZE[destination['y']][destination['x']];
    let object_class = OBJECTS[object_type]

    // remove destination class add PACMAN
    objects[DESTINATION_INDEX].classList.remove(object_class)
    objects[DESTINATION_INDEX].classList.add('GHOST')
    
    // remove source class PACMAN
    objects[SOURCE_INDEX].classList.remove('GHOST')
    objects[SOURCE_INDEX].classList.add(object_class)
}

const checkForWall = (point)=>{
    if(MAZE[point.y][point.x] === OBJECT_TYPES['WALL']) {
        return true
    } else {
        return false
    }
}