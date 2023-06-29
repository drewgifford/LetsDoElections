export function randInt(max: number, min: number = 0){
    
    
    return Math.round(Math.random()*(max-min)) + min

}

export function choice(array: any[]){

    return array[randInt(array.length - 1)]


}

export function nth(i: number){

    var a = i % 10,
        b = i % 100;

    if (a == 1 && b != 11) {
        return (i + "st");
    } else if (a == 2 && b != 12) {
        return (i + "nd");
    } else if (a == 3 && b != 13) {
        return (i + "rd");
    } else {
        return (i + "th");
    }
    return i;


}