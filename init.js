let isRolling = false;
let fullFieldWidth = window.innerWidth / 1.5;
let fullFieldHeight = window.innerHeight / 1.5;

//field data x- y-axis
//2d array containing the field with the data to identify each symbol

let verticalOffset = fullFieldHeight / 3 + 50;
let horizontalOffset = fullFieldWidth / 5;
let field = [
    [{x: 0, y: 0}, {x: 0, y: verticalOffset}, {x: 0, y: verticalOffset * 2}],
    [{x: horizontalOffset, y: 0}, {x: horizontalOffset, y: verticalOffset}, {x: horizontalOffset, y: verticalOffset * 2}],
    [{x: horizontalOffset * 2, y: 0}, {x: horizontalOffset * 2, y: verticalOffset}, {x: horizontalOffset * 2, y: verticalOffset * 2}],
    [{x: horizontalOffset * 3, y: 0}, {x: horizontalOffset * 3, y: verticalOffset}, {x: horizontalOffset * 3, y: verticalOffset * 2}],
    [{x: horizontalOffset * 4, y: 0}, {x: horizontalOffset * 4, y: verticalOffset}, {x: horizontalOffset * 4, y: verticalOffset * 2}]
]




// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also setup the ticker
// and the root stage PIXI.Container.
const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    transparent: false,
    antialias: false
});

//remove default chrome styling
app.renderer.view.style.position = 'absolute';
document.body.appendChild(app.view);



const loader = new PIXI.Loader();
loader.add('gameAssets', './assets/textures.json')

loader.onComplete.add(function () {
    console.log("Assets successfully loaded!")
})

//setup scene loader
let sceneService = new SceneService(loader)

loader.load(setup);
function setup(loader) {
    //init background frame
    let slotFrameTexture = sceneService.getSlotFrame();
    let slotFrameSprite = SceneService.createSprite(slotFrameTexture, window.innerWidth / 2, window.innerHeight / 2, fullFieldWidth, fullFieldHeight)
    app.stage.addChild(slotFrameSprite);
    //mask the surrounding area
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xFF3300);
    graphics.drawRect(slotFrameSprite.x, slotFrameSprite.y, fullFieldWidth, fullFieldHeight);
    graphics.endFill();
    slotFrameSprite.mask = graphics

    //add button
    let buttonTexture = sceneService.getButtons().buttonNormal;
    let buttonSprite = SceneService.createSprite(buttonTexture, window.innerWidth - 150, window.innerHeight - 150, 150, 150)
    buttonSprite.on('mousedown', function () {Roll()});
    buttonSprite.interactive = true;
    app.stage.addChild(buttonSprite)

    //generate random symbols on the field
    addRandomFieldSymbols(slotFrameSprite)
    console.log(field)


    // var testRectangle = new PIXI.Graphics();
    // testRectangle.beginFill(0xFFFF00);
    // testRectangle.lineStyle(5, 0xFF0000);
    // testRectangle.drawRect(0, 0, 300, 200);
    // slotFrameSprite.addChild(testRectangle);
    
    
    
}


rollReels = function(delta) {
    //roll reach column by speed
    rollSingleReel(0, 0)
    rollSingleReel(1, 1000)
    rollSingleReel(2, 2000)
    rollSingleReel(3, 3000)
    rollSingleReel(4, 4000)
}

rollSingleReel = function(columnId, timeout){
    setTimeout(() => {
        app.ticker.add(function(delta) {
            field[columnId][0].sprite.y += 1 * delta
            field[columnId][1].sprite.y += 1 * delta
            field[columnId][2].sprite.y += 1 * delta
        })
    }, timeout);
}


function Roll(){
    isRolling = true;
    console.log(`is Rolling: ${isRolling}`)

    app.ticker.addOnce(rollReels)
}

function addRandomFieldSymbols(slotFrame) {
    for(var col = 0; col < field.length; col++) {
        var wholeRow = field[col];
        for(var slotIndex = 0; slotIndex < wholeRow.length; slotIndex++) {
            let posValues = field[col][slotIndex]
            let symbolSprite = SceneService.createSprite(sceneService.getRandomSymbolTexture(), posValues.x + 150, posValues.y + 170, 300, 300)
            field[col][slotIndex].sprite = symbolSprite;
            //add random symbol to the field with these coordinates
            slotFrame.addChild(symbolSprite);

        }
    }
}