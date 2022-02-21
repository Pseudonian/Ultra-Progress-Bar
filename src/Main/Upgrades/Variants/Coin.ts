import { player } from "../../../Game";
import { format } from "../../../Utilities/Format";
import { Upgrade } from "../Upgrades";

export abstract class CoinUpgrade extends Upgrade {
    
    constructor(level: number, cost: number) {
        super(level, cost)
        this.updateHTML();
    }
    purchaseLevels(amount: number){
        console.log('test')
        if (this.cost * amount <= player.coins.amount) {
            player.coins.spend(this.cost * amount)
            this.level += amount;
            this.updateHTML();
        }
    }

    abstract upgradeEffect():number

    abstract updateHTML():void

}

export const coinUpgradeCosts = {
    barSpeed: 1,
    barMomentum: 3,
}

export class CoinBarSpeed extends CoinUpgrade {
    /**
     * 
     * @returns Bar Speed to add on top of the base amount. Additive!
     */
    upgradeEffect(): number {
        return this.level / 10
    }

    updateHTML(): void {
        document.getElementById("coin-bar-speed-effect").textContent = `+${format(this.upgradeEffect(), 2)} Progress Per Second`
    }
}

export class CoinBarMomentum extends CoinUpgrade {

    upgradeEffect(): number {
        return this.level / 1000   
    }
    updateHTML(): void {
        document.getElementById("coin-bar-momentum-effect").textContent = `+${format(100 * this.upgradeEffect(), 2)}% Progress Per 1% Bar Filled`
    }
}