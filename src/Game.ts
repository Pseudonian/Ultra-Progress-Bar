import localforage from 'localforage';

/*
* This is the player variable, which is used throughout the game!
*/

export const player: Player = {
    firstPlayed: new Date(),
    barEXP: 0,
    barTNL: 0,
    totalEXP: 0,
    barLevel: 0,
    highestBarLevel: 0,
}

/**
 * A newly initiable save for later. 
 */
export const blankSave = Object.assign({}, player, {
});

/**
 * Saves your savefile to localstorage.
 * @param button Whether the save pulse was forced by button
 */
export const saveGame = async () => {

    const saveString = Object.assign({}, player, {}); 


    await localforage.removeItem('UPBSave');

    const save = btoa(JSON.stringify(saveString));
    if (save !== null) {
        await localforage.setItem('UPBSave', save);
    }
}

const loadSavefile = async () => {
    console.log('load attempted')
    const save = await localforage.getItem<string>('UPBSave');

    const data = save ? JSON.parse(atob(save)) as Player & Record<string, unknown> : null

    if (data) {
        Object.keys(data).forEach((stringProp) => {
            const prop = stringProp as keyof Player
            if (!(prop in player)) {
                return;
            }
            return ((player[prop] as unknown) = data[prop])
        }
    )};
}


/*
* These are fundamental functions for intervals, which are used
* to create the basic game loop at 50fps without jarring effects.
*/

import { backgroundColorCreation, computeMainBarCoinWorth, computeMainBarTNL, getBarWidth, incrementMainBarEXP, levelUpBar, updateDPS, updateMainBar, updateMainBarInformation } from "./Main/ProgressBar/Properties";
import { Player } from "./types/player";
import { format } from './Utilities/Format';

export const intervalHold = new Set<ReturnType<typeof setInterval>>();
export const interval = new Proxy(setInterval, {
    apply(target, thisArg, args: Parameters<typeof setInterval>) {
        const set = target.apply(thisArg, args);
        intervalHold.add(set);
        return set;
    }
});

export const clearInt = new Proxy(clearInterval, {
    apply(target, thisArg, args: [ReturnType<typeof setInterval>]) {
        const id = args[0];
        if (intervalHold.has(id))
            intervalHold.delete(id);

        return target.apply(thisArg, args);
    }
});

window.addEventListener('load', () => {
    /*generateEventHandlers();*/
    void loadGame();
});

window.addEventListener('unload', () => {
    // This fixes a bug in Chrome (who would have guessed?) that
    // wouldn't properly load elements if the user scrolled down
    // and reloaded a page. Why is this a bug, Chrome? Why would
    // a page that is reloaded be affected by what the user did
    // beforehand? How does anyone use this buggy browser???????
    window.scrollTo(0, 0);
});


/**
 * Performance toggles
 * lastUpdate: updates every tick but is default 0 when page load
 * FPS: How many times the game is to update (tick) per second.
 */
let lastUpdate = 0;
const FPS = 50; 
const saveRate = 5000

export const loadGame = async () => {
    for (const timer of intervalHold)
        clearInt(timer);

    intervalHold.clear();

    lastUpdate = performance.now();
    interval(tick, 1000 / FPS);
    interval(updateDPS, 1000);

    Object.defineProperty(window, 'player', {
        value: player
    });

    player.barTNL = computeMainBarTNL();
    updateMainBar(getBarWidth(player.barEXP, player.barTNL))

    await loadSavefile();
    /*Maintain Autosave*/
    interval(saveGame, saveRate)

    document.getElementById("progression").style.backgroundColor = backgroundColorCreation();
    document.getElementById("coinWorth").textContent =  `Worth ${format(computeMainBarCoinWorth())} coins`;
}

export const tick = () => {
    const now = performance.now();
    const delta = now - lastUpdate;


    tock(delta/1000)
    lastUpdate += delta
}

export const tock = (delta: number) => {

    incrementMainBarEXP(delta);
    const width = getBarWidth(player.barEXP, player.barTNL);

    if (width < 100)
        updateMainBar(width)
    else {
        levelUpBar();
    }

    updateMainBarInformation();
}