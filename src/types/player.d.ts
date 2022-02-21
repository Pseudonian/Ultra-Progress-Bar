import { Coins } from "../Main/Currency/Variants/Coin";
import { CoinBarSpeed } from "../Main/Upgrades/Variants/Coin";

export interface Player {
    firstPlayed: Date,
    barEXP: number,
    barTNL: number,
    totalEXP: number,
    barLevel: number,
    highestBarLevel: number,
    coins: Coins
    coinUpgrades: {
        barSpeed: CoinBarSpeed 
        barMomentum: CoinBarMomentum
    }
}