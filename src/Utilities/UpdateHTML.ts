export type Tabs = "Main" | "Upgrades"

export const hideStuff = (tab: Tabs) => {
    document.getElementById("mainTab").style.display = "none"
    document.getElementById("upgradeTab").style.display = "none"

    if (tab === "Main") {
        document.getElementById("mainTab").style.display = "block"
    }
    if (tab === "Upgrades") {
        document.getElementById("upgradeTab").style.display = "block"
    }
}