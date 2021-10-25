class RollFunctions {
    static Roll(event){
        correctedPositions = [false, false, false, false, false]
        let isEnoughWalletAmount = rewardService.removeBetAmountAfterSpin();
        if(isEnoughWalletAmount){
            walletObject.text = `Balance: ${rewardService.returnWalletAmount()} BGN`
            //change button to unavailable texture and remove temporarily the onclick event
            let buttonSprite = event.currentTarget
            buttonSprite.off('mousedown')
            buttonSprite.texture = sceneService.getButtons().buttonActive;
            isRolling = true;
            console.log(`is Rolling: ${isRolling}`)
            setTimeout(() => {
                this.stopReels()
            }, spinTime);
        
            //set timeout also for when the spin is going to be done and you can spin again
            //then remove the removeTickers from the stage
            //add 1650 to the because that is the sum of the delays between first and last reel when they start and when they finish
            setTimeout(() => {
                buttonSprite.texture = sceneService.getButtons().buttonNormal;
                buttonSprite.on('mousedown', function (event) { RollFunctions.Roll(event) })
                app.ticker.remove(stopTicker1);
                app.ticker.remove(stopTicker2);
                app.ticker.remove(stopTicker3);
                app.ticker.remove(stopTicker4);
                app.ticker.remove(stopTicker5);
                //remove invisibleClickers
                for (let i = 0; i < 5; i++) {   
                    slotFrame.removeChild(invisibleClickers[i]);  
                }
                //check for winning lines
                let rollPoints = RewardService.checkForWinningLines(rollField)
                let amountWon = rewardService.addWalletFundsByPointsValue(rollPoints);
                walletObject.text = `Balance: ${rewardService.returnWalletAmount()} BGN`
                let afterRollText;
                if(amountWon === 0){
                    afterRollText = SceneService.getLoseNotification();
                }
                else{
                    afterRollText = SceneService.getWinNotification(amountWon)
                }
                app.stage.addChild(afterRollText);
                //set timeout for win text to disappear
                this.removeWonNotification(afterRollText);
                console.log(`points${rollPoints}`)
            }, spinTime + 1650);
            app.ticker.addOnce(rollReels)
        }
        else{
            let noBalanceNotif = SceneService.getNoBalanceNotification()
            app.stage.addChild(noBalanceNotif)
            this.removeWonNotification(noBalanceNotif)
        }
    }

    static removeWonNotification(notificationSprite){
        setTimeout(() => {
            app.stage.removeChild(notificationSprite);
        }, 5000);
    }

    static tickerGeneralFunc(delta, columnId) {
        rollField[columnId].forEach(spriteReference => {
            spriteReference.y += rollSpeed * delta;
        });
    
        if(rollField[columnId].length === 6){
            if(rollField[columnId][0].y >= fullFieldHeight + 170){
                this.removeOldSpritesFromStage(columnId, true)
            }
        }
    }

    static addRandomFieldSymbols(slotFrame) {
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

    static initialAddRandomFieldSymbolsDuringRoll(){
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
    
    static stopReels(){
        this.stopReel(ticker1, 50, stopTicker1)
        this.stopReel(ticker2, 250, stopTicker2)
        this.stopReel(ticker3, 450, stopTicker3)
        this.stopReel(ticker4, 650, stopTicker4)
        this.stopReel(ticker5, 850, stopTicker5)
    }

    static stopReel(reelNamedTicker, timeout, namedStopTicker){
        setTimeout(() => {
            app.ticker.remove(reelNamedTicker)
            //call function that will correct the positions
            app.ticker.add(namedStopTicker);
        }, timeout);
    }
    

    static correctPositionsTicker(delta, columnId){
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
                RollFunctions.removeOldSpritesFromStage(columnId, false)
                //change variables
                isRolling = false;
            }
        }
    }


    //render symbols which are going to create the rolling animation out of the newly generated random symbols
    static renderSpritesForColumn(column){
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
    

    static removeOldSpritesFromStage(columnId, generateNewOnes){
        //remove the three sprites which have left the field respectively
        slotFrame.removeChild(rollField[columnId][0]);
        slotFrame.removeChild(rollField[columnId][1]);
        slotFrame.removeChild(rollField[columnId][2]);
        rollField[columnId].shift()
        rollField[columnId].shift()
        rollField[columnId].shift()
    
        //add randomly generated symbols on top of the left ones
        if(generateNewOnes){this.renderSpritesForColumn(columnId)}
    }
    
}