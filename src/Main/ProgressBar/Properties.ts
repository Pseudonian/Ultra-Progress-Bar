//import assert from 'assert'

import { player } from "../../Game";
import { format } from "../../Utilities/Format";

/**
 * Basic Bar Stats
 */
const baseEXPReq = 10;
let currentPerSec = 0;
let previousPerSec = 0;

export const computeMainBarTNL = () => {
    let TNL = 0
    // Additive Component
    TNL += baseEXPReq * Math.pow(player.barLevel + 1, 2)
    // Multiplicative Component (Bumps at 50, 100, 200)
    if (player.barLevel > 50)
        TNL *= Math.pow(2, 1/10 * (player.barLevel - 50))
    if (player.barLevel > 100)
        TNL *= Math.pow(2, 1/50 * (player.barLevel - 100))
    if (player.barLevel > 200)
        TNL *= Math.pow(2, 1/200 * (player.barLevel - 200))
    return TNL
}

export const incrementMainBarEXP = (delta: number) => {
    player.barEXP += delta
    currentPerSec += delta

    document.getElementById("perSecCurr").textContent = `+${format(currentPerSec,2)} this sec`
}

/**
 * Obtain the width of a progress bar given current progress and required progress
 * @param currScore The amount of progress (number) the player has toward something
 * @param targetScore How much progress is needed to fill the progress bar
 * @returns a Number [0, 100] indicating how wide the bar should be, with precision 0.1
 */
export const getBarWidth = (currScore: number, targetScore: number) => {
    // Only return increments of 0.1%
    return Math.min(100, 0.1 * Math.floor(1000 * currScore / targetScore))
}

export const updateMainBar = (width: number) => {
    document.getElementById("progression").style.width = width + "%";
}

export function backgroundColorCreation() {
    const R = (128 + player.barLevel).toString(16)
    const G = (2 * player.barLevel).toString(16)
    const B = (128 + player.barLevel).toString(16)

    if (player.barLevel < 128)
        return `#${R}${G}${B}`
    else
        return `#ffffff`
}

export const levelUpBar = () => {
    player.barEXP -= player.barTNL
    player.barLevel += 1;

    console.log(backgroundColorCreation())
    document.getElementById('progression').style.backgroundColor = backgroundColorCreation();
    player.barTNL = computeMainBarTNL()
    const width = getBarWidth(player.barEXP, player.barTNL);
    updateMainBar(width);
    
    document.getElementById("coinWorth").textContent =  `Worth ${format(computeMainBarCoinWorth())} coins`;
    
}

export const updateMainBarInformation = () => {
    document.getElementById("level").textContent = `Level: ${player.barLevel}`
    document.getElementById("EXP").textContent = `EXP: ${format(player.barEXP)}/${format(player.barTNL)}`
}

export const updateDPS = () => {
    previousPerSec = currentPerSec;
    currentPerSec = 0;
    document.getElementById("perSecPrev").textContent = `+${format(previousPerSec,2)} prev sec`
}

export const computeMainBarCoinWorth = () => {
    let baseWorth = 0;

    const nextLevel = player.barLevel + 1
    baseWorth += Math.floor(nextLevel / 10)
    // Highest level bonus
    if (nextLevel > player.highestBarLevel)
        baseWorth += 3;
    if (nextLevel % 10 === 0)
        baseWorth += Math.floor(nextLevel / 10)

    return baseWorth
}