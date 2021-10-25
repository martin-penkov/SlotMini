class RewardService {
    constructor() {
        this.wallet = 100;
        this.betAmount = 10
    }

    addWalletFundsByPointsValue(points){
        let amountWon = this.betAmount * points;
        this.wallet += amountWon;
        return amountWon;
    }

    returnWalletAmount(){
        return this.wallet
    }

    returnBetAmount(){
        return this.betAmount
    }

    lowerBet(){
        if(this.betAmount <= 0){}
        else {
            this.betAmount -= 10
        }
    }

    increaseBet(){
        this.betAmount += 10;
    }

    removeBetAmountAfterSpin(){
        //return false if there is not enough balance to spin
        if(this.returnBetAmount() > this.returnWalletAmount()){
            return false
        }
        else{
            this.wallet -= this.betAmount
            return true;
        }
    }

    static checkForWinningLines(field){
        let threeConsecutivePoints = 3;
        let fourConsecutivePoints = 5;
        let fiveConsecutivePoints = 10;
        let jackpotPoints = 50;

        let points = 0;  //a match of 3 symbols in a row give 3 points, 4 symbols give 5 points, 5 symbols give 10 points
        //there is a jackpot if 5 symbols are matching in the middle winning line (it is going ot give you 50 points)
        //each point equals multiply value to the amount of your bet
        let currentRow = []
        let isMiddleLine = false;
        for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
            for (let colIndex = 0; colIndex < field.length; colIndex++) {
                currentRow.push(field[colIndex][rowIndex]);
            }
            //check for matching adjacent symbols here and return a number of matching on same row
            for (let i = 0; i < (currentRow.length - 2); i++) {
                if(i == 1){isMiddleLine = true;}
                if ((currentRow[i].texture.textureCacheIds[0] == currentRow[i + 1].texture.textureCacheIds[0])
                     && currentRow[i + 1].texture.textureCacheIds[0] == currentRow[i + 2].texture.textureCacheIds[0]) {
                    let isJackpot = false;
                    let isFourConsecutive = false;
                    //check if 4 consecutive and 5 consecutive
                    if(i >= 0 && i < 2){
                        if(i == 0){
                            if (currentRow[i + 2].texture.textureCacheIds[0] == currentRow[i + 3].texture.textureCacheIds[0] == currentRow[i + 4].texture.textureCacheIds[0]) {
                                //case for 5 consecutive
                                if(isMiddleLine){
                                    points += jackpotPoints
                                }
                                else{
                                    points += fiveConsecutivePoints
                                }
                                isJackpot = true;
                            }
                        }
                        //check also if jackpot hasn't been won
                        if(points == 0 && currentRow[i + 2].texture.textureCacheIds[0] == currentRow[i + 3].texture.textureCacheIds[0]){
                            //case for 4 consecutive
                            points += fourConsecutivePoints 
                            isFourConsecutive = true;
                        }
                    }
                    if(!isFourConsecutive && !isJackpot){
                        //case for 3 consecutive
                        points += threeConsecutivePoints
                    }
                    isJackpot = false;
                    isFourConsecutive = false;
                }
                isMiddleLine = false;
            }

            currentRow = []
        }

        return points
    }
}