console.log("Loaded JS");
const gameGrid=document.getElementById('game-grid');
const bar=document.getElementById('movable-bar')
console.log("Game Grid Found",gameGrid);

window.addEventListener("keypress",(e)=>{
    console.log(e)
    switch (e.key){
        case "A":
            //move right
            break
        case "D":
            //move left
            break
        default:
            e.preventDefault();
    }
})



