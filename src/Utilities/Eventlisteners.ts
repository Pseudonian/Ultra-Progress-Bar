import { player } from "../Game";
import { hideStuff } from "./UpdateHTML"

export const generateEventHandlers = () => {
    document.getElementById("main-tab-nav").addEventListener('click', () => hideStuff("Main"));
    document.getElementById("upgrade-tab-nav").addEventListener('click', () => hideStuff("Upgrades"));

    document.getElementById("buy-coin-bar-speed").addEventListener('click', () => player.coinUpgrades.barSpeed.purchaseLevels(1));
    document.getElementById("buy-coin-bar-momentum").addEventListener('click', () => player.coinUpgrades.barMomentum.purchaseLevels(1));

}