let isRolling = false;
let fullFieldWidth = window.innerWidth / 1.5;
let fullFieldHeight = window.innerHeight / 1.5;
let areNewSymbolsSpawned = false;
let newSymbolsSpawnedCount = 0;
let isNewFieldGenerated = false;
let rollSpeed = 100;  //speed in ms
let spinTime = 2000; // time is in ms
let correctedPositions = [false, false, false, false, false]

//ticker named functions
let ticker1 = function(delta) {tickerGeneralFunc(delta, 0)}
let ticker2 = function(delta) {tickerGeneralFunc(delta, 1)}
let ticker3 = function(delta) {tickerGeneralFunc(delta, 2)}
let ticker4 = function(delta) {tickerGeneralFunc(delta, 3)}
let ticker5 = function(delta) {tickerGeneralFunc(delta, 4)}


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

let rollField = [
    [],
    [],
    [],
    [],
    []
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
let slotFrame;

loader.load(setup);
function setup(loader) {
    //init background frame
    let slotFrameTexture = sceneService.getSlotFrame();
    let slotFrameSprite = SceneService.createSprite(slotFrameTexture, window.innerWidth / 2, window.innerHeight / 2, fullFieldWidth, fullFieldHeight)
    slotFrame = slotFrameSprite;
    app.stage.addChild(slotFrameSprite);
    //mask the surrounding area
    const graphics = new PIXI.Graphics();
    graphics.beginFill(0xFF3300);
    graphics.drawRect(slotFrameSprite.x, slotFrameSprite.y + 12, fullFieldWidth, fullFieldHeight - 24);
    graphics.endFill();
    slotFrameSprite.mask = graphics

    //add button
    let buttonTexture = sceneService.getButtons().buttonNormal;
    let buttonSprite = SceneService.createSprite(buttonTexture, window.innerWidth - 150, window.innerHeight - 150, 150, 150)
    buttonSprite.on('mousedown', function (event) {Roll(event)});
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
    //generater new random field sprites
    initialAddRandomFieldSymbolsDuringRoll()

    //roll reach column by speed
    rollSingleReel(0, 0, ticker1)
    rollSingleReel(1, 200, ticker2)
    rollSingleReel(2, 400, ticker3)
    rollSingleReel(3, 600, ticker4)
    rollSingleReel(4, 800, ticker5)
}

rollSingleReel = function(columnId, timeout, namedFunction){
    setTimeout(() => {
        app.ticker.add(namedFunction)
    }, timeout);
}

function tickerGeneralFunc(delta, columnId) {
    rollField[columnId].forEach(spriteReference => {
        spriteReference.y += rollSpeed * delta;
    });

    if(rollField[columnId].length === 6){
        if(rollField[columnId][0].y >= fullFieldHeight + 170){
            removeOldSpritesFromStage(columnId, true)
        }
    }
}


function Roll(event){
    correctedPositions = [false, false, false, false, false]
    //change button to unavailable texture and remove temporarily the onclick event
    let buttonSprite = event.currentTarget
    buttonSprite.texture = sceneService.getButtons().buttonActive;
    isRolling = true;
    console.log(`is Rolling: ${isRolling}`)
    setTimeout(() => {
        stopReels()
    }, spinTime);

    //set timeout also for when the spin is going to be done and you can spin again
    //then remove the removeTickers from the stage
    //add 1650 to the because that is the sum of the delays between first and last reel when they start and when they finish
    setTimeout(() => {
        buttonSprite.texture = sceneService.getButtons().buttonNormal;
        app.ticker.remove(stopTicker1);
        app.ticker.remove(stopTicker2);
        app.ticker.remove(stopTicker3);
        app.ticker.remove(stopTicker4);
        app.ticker.remove(stopTicker5);
        console.log(`final ticker:`)
        console.log(app.ticker)
    }, spinTime + 1650);
    app.ticker.addOnce(rollReels)
}

function stopReels(){
    console.log(app.ticker)
    slowedRollSpeed  = rollSpeed / 5
    stopReel(ticker1, 50, stopTicker1)
    stopReel(ticker2, 250, stopTicker2)
    stopReel(ticker3, 450, stopTicker3)
    stopReel(ticker4, 650, stopTicker4)
    stopReel(ticker5, 850, stopTicker5)
}

function stopReel(reelNamedTicker, timeout, namedStopTicker){
    setTimeout(() => {
        app.ticker.remove(reelNamedTicker)
        //call function that will correct the positions
        app.ticker.add(namedStopTicker);
    }, timeout);
}

//stop ticker named functions
let stopTicker1 = function(delta) {correctPositionsTicker(delta, 0)}
let stopTicker2 = function(delta) {correctPositionsTicker(delta, 1)}
let stopTicker3 = function(delta) {correctPositionsTicker(delta, 2)}
let stopTicker4 = function(delta) {correctPositionsTicker(delta, 3)}
let stopTicker5 = function(delta) {correctPositionsTicker(delta, 4)}

function correctPositionsTicker(delta, columnId){
    //move upper symbols to the correct positions on x and y axis
    //then remove from the stage the lower ones which are going to be out of bounds
    
    if(!correctedPositions[columnId]){
        //move elements
        rollField[columnId].forEach(spriteReference => {
            spriteReference.y += slowedRollSpeed * delta
        });
        //check if elements are in the correct positions already
        if(rollField[columnId][5].y >= field[columnId][2].y){
            correctedPositions[columnId] = true;
            //make sure sprite is in absolutely correct position by rewriting it to be the same as the initial one
            rollField[columnId][5].y = field[columnId][2].y
            //remove symbols beneath (which are out of bounds of the fieldBoxSprite)
            removeOldSpritesFromStage(columnId, false)
            //change variables
            isRolling = false;
            console.log(`is Rolling: ${isRolling}`)
        }
    }
}

function addRandomFieldSymbols(slotFrame) {
    for(var col = 0; col < field.length; col++) {
        var wholeRow = field[col];
        for(var slotIndex = 0; slotIndex < wholeRow.length; slotIndex++) {
            let posValues = field[col][slotIndex]
            let symbolSprite = SceneService.createSprite(sceneService.getRandomSymbolTexture(), posValues.x + 150, posValues.y + 170, 300, 300)
            field[col][slotIndex].sprite = symbolSprite;
            rollField[col].push(symbolSprite)
            //add random symbol to the field with these coordinates
            slotFrame.addChild(symbolSprite);
        }
    }
}


function initialAddRandomFieldSymbolsDuringRoll(){
    for(var col = 0; col < field.length; col++) {
        var wholeColumn = field[col];
        for(var slotIndex = 0; slotIndex < wholeColumn.length; slotIndex++) {
            // let spawnYOffset = 300
            let posValues = field[col][slotIndex]
            let symbolSprite = SceneService.createSprite(sceneService.getRandomSymbolTexture(), posValues.x + 150, posValues.y + 170 - verticalOffset * 3, 300, 300)
            field[col][slotIndex].sprite = symbolSprite;
            rollField[col].push(symbolSprite)
            //add random symbol to the field with these coordinates
            slotFrame.addChild(symbolSprite);
        }
    }
}

function removeOldSpritesFromStage(columnId, generateNewOnes){
    //remove the three sprites which have left the field respectively
    slotFrame.removeChild(rollField[columnId][0]);
    slotFrame.removeChild(rollField[columnId][1]);
    slotFrame.removeChild(rollField[columnId][2]);
    rollField[columnId].shift()
    rollField[columnId].shift()
    rollField[columnId].shift()

    //add randomly generated symbols on top of the left ones
    if(generateNewOnes){renderSpritesForColumn(columnId)}
}


//render symbols which are going to create the rolling animation out of the newly generated random symbols
function renderSpritesForColumn(column){
    //get sprites for the three rows 
    let upperRow = rollField[column][0].texture
    let centerRow = rollField[column][1].texture
    let lowerRow = rollField[column][2].texture
    //create sprites and change y coordinates


    let upperRowSprite = SceneService.createSymbolSprite(upperRow, rollField[column][0].x, rollField[column][0].y - fullFieldHeight - 300 / 2);
    let centerRowSprite = SceneService.createSymbolSprite(centerRow, rollField[column][1].x, rollField[column][1].y - fullFieldHeight - 300 / 2);
    let lowerRowSprite = SceneService.createSymbolSprite(lowerRow, rollField[column][2].x, rollField[column][2].y - fullFieldHeight - 300 / 2);
    
    //add elements to rollField array 
    rollField[column].push(upperRowSprite)
    rollField[column].push(centerRowSprite)
    rollField[column].push(lowerRowSprite)

    //attach to the scene
    slotFrame.addChild(upperRowSprite);
    slotFrame.addChild(centerRowSprite);
    slotFrame.addChild(lowerRowSprite);

}

