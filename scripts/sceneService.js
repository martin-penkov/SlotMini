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
        let symbols = this.sheet.textures
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