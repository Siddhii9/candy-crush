document.addEventListener('DOMContentLoaded',()=>{

const grid=document.querySelector('.grid')
const  scoreDisplay=document.getElementById('score')
const width=8;
const squares=[]
let score=0;

const candyColors=[
    'url(red-candy.png)',
    'url(yellow-candy.png)',
    'url(orange-candy.png)',
    'url(purple-candy.png)',
    'url(green-candy.png)',
    'url(blue-candy.png)'
]

//create bboard
function createBoard(){
    for(let i=0;i<width*width;i++){
        const square=document.createElement('div')
        square.setAttribute('draggable',true)
        // sets the draggable attribute of the square element to true. 
        // This means that the element becomes draggable using the built-in HTML5 Drag and Drop API.
        square.setAttribute('id',i)

        let randomColor=getRandomColor(i);

        //  This function generates a random floating-point number in the range [0, 1). 
        // This means the number can be 0 but will always be less than 1.
        
        square.style.backgroundImage=randomColor
        grid.appendChild(square)
        squares.push(square)
    }
}

function getRandomColor(index){
    let randomColor;
    let isColorMatch=true;

    while(isColorMatch){
        randomColor=candyColors[Math.floor(Math.random() * candyColors.length)]
        isColorMatch=false;

        if(index>=2 && squares[index-1].style.backgroundImage===randomColor && squares[index-2].style.backgroundImage===randomColor){
            isColorMatch=true;
        }

        if(index>=width*2 && squares[index-width].style.backgroundImage===randomColor && squares[index-width*2].style.backgroundImage===randomColor){
            isColorMatch=true;
        }
    }

    return randomColor;
}

createBoard()

// drag the candy
let colorBeingDragged
let colorBeingReplaced
let squareIdBeingDragged
let squareIdBeingReplaced

squares.forEach(square => square.addEventListener('dragstart',dragStart))
squares.forEach(square => square.addEventListener('dragend',dragEnd))
squares.forEach(square => square.addEventListener('dragover',dragOver))
squares.forEach(square => square.addEventListener('dragenter',dragEnter))
squares.forEach(square => square.addEventListener('dragleave',dragLeave))
squares.forEach(square => square.addEventListener('drop',dragDrop))

function dragStart(){

    colorBeingDragged=this.style.backgroundColor
    squareIdBeingDragged=parseInt(this.id)
}

function dragOver(e){
    e.preventDefault()
}

function dragEnter(e){
    e.preventDefault()
}

function dragLeave(){
    console.log(this.id,'dragleave')
}

function dragDrop(){
    colorBeingReplaced=this.style.backgroundImage
    squareIdBeingReplaced=parseInt(this.id)
    this.style.backgroundImage=colorBeingDragged
    squares[squareIdBeingDragged].style.backgroundImage=colorBeingReplaced
}

function dragEnd(){

    // what is a vlaid move
    let validMoves=[
        squareIdBeingDragged-1,
        squareIdBeingDragged -width,
        squareIdBeingDragged +1,
        squareIdBeingDragged +width
    ];

    const validMove=validMoves.includes(squareIdBeingReplaced)
    // checks if the id of swuare being replaced is in the array validMoves

    if(squareIdBeingReplaced && validMove){
        squareIdBeingReplaced=null
        checkMatches();
    }

    else if(squareIdBeingReplaced && !validMove){
        squares[squareIdBeingReplaced].style.backgroundImage=colorBeingReplaced
        squares[squareIdBeingDragged].style.backgroundImage=colorBeingDragged
    }
    else{
        squares[squareIdBeingDragged].style.backgroundImage=colorBeingDragged
    }
}

// drop candies once some have been cleared
function moveDown(){

    for(i=0;i<55;i++){
        if(squares[i+width].style.backgroundImage===''){
            squares[i+width].style.backgroundImage=squares[i].style.backgroundImage
            squares[i].style.backgroundImage='';

            const firstRow=[0,1,2,3,4,5,6,7]
            const isFirstRow=firstRow.includes(i)
            if(isFirstRow && squares[i].style.backgroundImage===''){
                let randomColor=getRandomColor(i);
                squares[i].style.backgroundImage=randomColor
            }
        }
    }

    for(let i=0;i<width;i++){
        if(squares[i].style.backgroundImage===''){
            let randomColor=getRandomColor(i);
            squares[i].style.backgroundImage=randomColor;
        }
    }
}

//checking for matches 
// for row of four
function checkRowforFour(){
    for(i=0;i<60;i++){
       let rowOfFour=[i,i+1,i+2,i+3] 
       let decidedColor=squares[i].style.backgroundImage
       const isBlank=decidedColor===''

       const notValid=[5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55];
       if(notValid.includes(i))continue;

       if(rowOfFour.every(index => squares[index].style.backgroundImage===decidedColor && !isBlank)){
        score+=4;  
        scoreDisplay.innerHTML=score
        rowOfFour.forEach(index =>{
                squares[index].style.backgroundImage=''
            })
       }
    }
}


// for column of four

function checkColumnforFour(){
    for(i=0;i<39;i++){
       let columnOfFour=[i,i+width,i+width*2,i+width*3] 
       let decidedColor=squares[i].style.backgroundImage
       const isBlank=decidedColor ===''

       if(columnOfFour.every(index => squares[index].style.backgroundImage===decidedColor && !isBlank)){
        score+=4; 
        scoreDisplay.innerHTML=score 
        columnOfFour.forEach(index =>{
                squares[index].style.backgroundImage=''
            })
       }
    }
}


// checkinf for row of three
function checkRowforThree(){
    for(i=0;i<61;i++){
       let rowOfThree=[i,i+1,i+2] 
       let decidedColor=squares[i].style.backgroundImage
       const isBlank=squares[i].style.backgroundImage==''

       const notValid=[6,7,14,15,22,23,30,31,38,39,46,47,54,55];
       if(notValid.includes(i))continue

       if(rowOfThree.every(index => squares[index].style.backgroundImage===decidedColor && !isBlank)){
        score+=3;  
        scoreDisplay.innerHTML=score
        rowOfThree.forEach(index =>{
                squares[index].style.backgroundImage=''
            })
       }
    }
}


function checkColumnforThree(){
    for(i=0;i<47;i++){
       let columnOfThree=[i,i+width,i+width*2] 
       let decidedColor=squares[i].style.backgroundImage
       const isBlank=squares[i].style.backgroundImage==''

       if(columnOfThree.every(index => squares[index].style.backgroundImage===decidedColor && !isBlank)){
        score+=3;  
        scoreDisplay.innerHTML=score
        columnOfThree.forEach(index =>{
                squares[index].style.backgroundImage=''
            })
       }
    }
}

function checkMatches(){
    checkRowforFour();
    checkColumnforFour();
    checkRowforThree();
    checkColumnforThree();
    moveDown();
}
window.setInterval(()=>{
    checkMatches();
},100)
});
