import { format } from "../../../Utilities/Format";
import { Currency } from "../Currency"

export class Coins extends Currency {
    updateHTML(): void {
        document.getElementById("gold-amount").textContent = format(this.amount);
    }
}