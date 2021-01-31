// common library function

// Flips an Object
export const JSON_FLIP = (json)=>{
    let ret = {}
    for(var key in json){
        ret[json[key]] = key
    }
    return ret
}

//  Deep Copy
export const DEEP_COPY = (object)=>{
    let ret = JSON.parse(JSON.stringify(object))
    return ret
}

// calculate distance between coordinate objects
export const calculateDistance = (point1, point2)=>{
    let result_x = point1.x - point2.x
    let result_y = point1.y - point2.y
    return hypot(result_x, result_y)
}

// hypotenuse of two numbers
const hypot = (a,b) => {
    if(Math.hypot) {
        return Math.hypot(a,b)
    } else {
        let r = Math.sqrt(a*a + b*b)
        return r
    }
}

// Minimum of n numbers and return index
const calculateMinimnumByIndex = (argument) => {
    
}
  