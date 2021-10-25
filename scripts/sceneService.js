class SceneService {
    constructor(loader) {
        this.sheet = loader.resources['gameAssets'];
    }
    getSlotFrame(){
        let slotFrame = this.sheet.textures["SlotFrame.png"]
        return slotFrame
    }

    getButtons(){
        let buttonNormal = this.sheet.textures["SpinButton_Normal.png"]
        let buttonActive = this.sheet.textures["SpinButton_Active.png"]
        return {buttonNormal, buttonActive}
    }

    getSymbols(){
        let symbols = {...(this.sheet.textures)}
        delete symbols["SlotFrame.png"]
        delete symbols["SpinButton_Normal.png"]
        delete symbols["SpinButton_Active.png"]
        //convert textures to sprites
        return symbols
    }

    getRandomSymbolTexture(){
        //random number from 1 to 8
        let randomNum = Math.floor(Math.random() * 8) + 1;
        let symbolName = `Symbol_${randomNum}.png`
        return this.getSymbols()[symbolName]
    }

    getMaskSprite(slotFrame){
        const mask = new PIXI.Graphics();
        mask.beginFill(0xFF3300);
        mask.drawRect(slotFrame.x, slotFrame.y + 12, fullFieldWidth, fullFieldHeight - 24);
        mask.endFill();
        return mask;
    }

    getBettingSprites(rewardService, betObject){
        const upBetSprite = new PIXI.Graphics();
        upBetSprite.beginFill(0x78AB46);
        upBetSprite.drawCircle(30, 30, 30);
        upBetSprite.y = 100
        upBetSprite.endFill();
        upBetSprite.interactive = true;
        upBetSprite.on('mousedown', function() {
            rewardService.increaseBet()
            betObject.text = `Bet: ${rewardService.returnBetAmount()} BGN`
        })

        const lowerBetSprite = new PIXI.Graphics();
        lowerBetSprite.beginFill(0xC41E3A);
        lowerBetSprite.drawCircle(30, 30, 30);
        lowerBetSprite.x = 100
        lowerBetSprite.y = 100
        lowerBetSprite.endFill();
        lowerBetSprite.interactive = true;
        lowerBetSprite.on('mousedown', function() {
            rewardService.lowerBet()
            betObject.text = `Bet: ${rewardService.returnBetAmount()} BGN`
        })

        return {upBetObj: upBetSprite, lowerBetObj: lowerBetSprite}
    }

    getBetValueSprite(rewardService){
        let betObject = new PIXI.Text(`Bet: ${rewardService.returnBetAmount()} BGN`, defaultStyling())
        betObject.y = 60
        return betObject;
    }

    getHelpText(){
        let helpText1 = new PIXI.Text("Green Circle = increase bet", helpTextStyling())
        let helpText2 = new PIXI.Text("Red Circle = lower bet", helpTextStyling())
        helpText1.y = 200
        helpText2.y = 250

        return {help1: helpText1, help2: helpText2}
    }

    static getWinNotification(amountWon){
        let textString = `Won ${amountWon} BGN!`
        let winText = new PIXI.Text(textString, winStyling())
        let textMetrics = PIXI.TextMetrics.measureText(textString, winStyling())
        winText.x = window.innerWidth - textMetrics.width;
        return winText;
    }

    static getLoseNotification(){
        let textString = `You Lost!`
        let winText = new PIXI.Text(textString, winStyling())
        let textMetrics = PIXI.TextMetrics.measureText(textString, winStyling())
        winText.x = window.innerWidth - textMetrics.width;
        return winText;
    }

    static getNoBalanceNotification(){
        let textString = `Not enough balance! Lower bet!`
        let winText = new PIXI.Text(textString, winStyling())
        let textMetrics = PIXI.TextMetrics.measureText(textString, winStyling())
        winText.x = window.innerWidth - textMetrics.width;
        return winText;
    }

    static get0BetNotification(points){
        let textString = `You could have won x${points} times your bet!`
        let winText = new PIXI.Text(textString, winStyling())
        let textMetrics = PIXI.TextMetrics.measureText(textString, winStyling())
        winText.x = window.innerWidth - textMetrics.width;
        return winText;
    }

    static createSprite(texture, x, y, width, height){
        let sprite = new PIXI.Sprite(texture)
        sprite.width = width;
        sprite.height = height;
        sprite.x = x - (width / 2);
        sprite.y = y - (height / 2);
        return sprite
    }

    static createSymbolSprite(texture, x, y){
        let sprite = new PIXI.Sprite(texture)
        sprite.width = 300;
        sprite.height = 300;
        sprite.x = x
        sprite.y = y
        return sprite
    }
}