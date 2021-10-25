let isRolling = false;
let fullFieldWidth = window.innerWidth / 1.5;
let fullFieldHeight = window.innerHeight / 1.5;
let areNewSymbolsSpawned = false;
let newSymbolsSpawnedCount = 0;
let isNewFieldGenerated = false;
let rollSpeed = 100;  //speed in ms
let slowedRollSpeed  = rollSpeed / 5
let spinTime = 3000; // time is in ms
let correctedPositions = [false, false, false, false, false]

//wallet
let rewardService = new RewardService()
let walletObject = new PIXI.Text(`Balance: ${rewardService.returnWalletAmount()} BGN`, defaultStyling());



//ticker named functions
let ticker1 = function(delta) {RollFunctions.tickerGeneralFunc(delta, 0)}
let ticker2 = function(delta) {RollFunctions.tickerGeneralFunc(delta, 1)}
let ticker3 = function(delta) {RollFunctions.tickerGeneralFunc(delta, 2)}
let ticker4 = function(delta) {RollFunctions.tickerGeneralFunc(delta, 3)}
let ticker5 = function(delta) {RollFunctions.tickerGeneralFunc(delta, 4)}


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

let invisibleClickers = []
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
let betSprite;

loader.load(setup);
function setup(loader) {
    //init background frame
    let slotFrameTexture = sceneService.getSlotFrame();
    slotFrame = SceneService.createSprite(slotFrameTexture, window.innerWidth / 2, window.innerHeight / 2, fullFieldWidth, fullFieldHeight)
    app.stage.addChild(slotFrame);
    //mask the surrounding area
    slotFrame.mask = sceneService.getMaskSprite(slotFrame);

    //render wallet balance text
    app.stage.addChild(walletObject);
    
    //help text
    app.stage.addChild(sceneService.getHelpText().help1)
    app.stage.addChild(sceneService.getHelpText().help2)

    //render betting buttons 
    betSprite = sceneService.getBetValueSprite(rewardService)
    let bettingSprites = sceneService.getBettingSprites(rewardService, betSprite)
    app.stage.addChild(bettingSprites.upBetObj)
    app.stage.addChild(bettingSprites.lowerBetObj)
    //bet amount object
    app.stage.addChild(betSprite)

    //add button
    let buttonTexture = sceneService.getButtons().buttonNormal;
    let buttonSprite = SceneService.createSprite(buttonTexture, window.innerWidth - 150, window.innerHeight - 150, 150, 150)
    buttonSprite.on('mousedown', function (event) {RollFunctions.Roll(event)});
    buttonSprite.interactive = true;
    app.stage.addChild(buttonSprite)

    //generate random symbols on the field
    RollFunctions.addRandomFieldSymbols(slotFrame)
}


rollReels = function(delta) {
    //generater new random field sprites
    RollFunctions.initialAddRandomFieldSymbolsDuringRoll()

    //roll reach column by speed
    rollSingleReel(0, 0, ticker1)
    rollSingleReel(1, 200, ticker2)
    rollSingleReel(2, 400, ticker3)
    rollSingleReel(3, 600, ticker4)
    rollSingleReel(4, 800, ticker5)

    //add event listeners for stop when you press reel with mouse
    //add sprites covering each reel so we can attach event listeners on them
    
    let stopFunctionReferences = [{mainTicker: ticker1, stopTicker: stopTicker1}
        , {mainTicker: ticker2, stopTicker: stopTicker2}
        , {mainTicker: ticker3, stopTicker: stopTicker3}
        , {mainTicker: ticker4, stopTicker: stopTicker4}
        , {mainTicker: ticker5, stopTicker: stopTicker5}]
    invisibleClickers.push(getInvisibleSprite(10, 0, horizontalOffset, fullFieldHeight* 1.5));
    invisibleClickers.push(getInvisibleSprite(horizontalOffset + 10, 0, horizontalOffset, fullFieldHeight* 1.5));
    invisibleClickers.push(getInvisibleSprite(horizontalOffset * 2 + 10, 0, horizontalOffset, fullFieldHeight* 1.5));
    invisibleClickers.push(getInvisibleSprite(horizontalOffset * 3 + 10, 0, horizontalOffset, fullFieldHeight* 1.5));
    invisibleClickers.push(getInvisibleSprite(horizontalOffset * 4 + 10, 0, horizontalOffset, fullFieldHeight * 1.5));
    for (let i = 0; i < 5; i++) {
        slotFrame.addChild(invisibleClickers[i])
    }
    //atach event listeners
    for (let i = 0; i < 5; i++) {
        let reelFunctionReferences = stopFunctionReferences[i]
        invisibleClickers[i].on('mousedown', function () {RollFunctions.stopReel(reelFunctionReferences.mainTicker, 0, reelFunctionReferences.stopTicker)})
    }
}

rollSingleReel = function(columnId, timeout, namedFunction){
    setTimeout(() => {
        app.ticker.add(namedFunction)
    }, timeout);
}





//stop ticker named functions
let stopTicker1 = function(delta) {RollFunctions.correctPositionsTicker(delta, 0)}
let stopTicker2 = function(delta) {RollFunctions.correctPositionsTicker(delta, 1)}
let stopTicker3 = function(delta) {RollFunctions.correctPositionsTicker(delta, 2)}
let stopTicker4 = function(delta) {RollFunctions.correctPositionsTicker(delta, 3)}
let stopTicker5 = function(delta) {RollFunctions.correctPositionsTicker(delta, 4)}