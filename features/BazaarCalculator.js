import  axios  from '../../axios';
import { AQUA, BOLD, GOLD, GRAY, GREEN, ITALIC, RED, RESET } from '../constants';
import { data } from '../variables';

// ID : [INSTA BUY, SELL OFFER]
let items = {
    // Hypergolic Fuel Stuff
    "ENCHANTED_COAL": [0, 0],
    "ENCHANTED_SULPHUR": [0, 0],
    "CRUDE_GABAGOOL": [0, 0],
    "HYPERGOLIC_GABAGOOL": [0, 0],
    "CRUDE_GABAGOOL_DISTILLATE": [0, 0],
    // Inferno Minion Loot
    "CHILI_PEPPER": [0, 0],
    "INFERNO_VERTEX": [0, 0],
    "REAPER_PEPPER": [0, 0]
}
let products = {};
const BZ_API = 'https://api.hypixel.net/skyblock/bazaar';

// Inferno Minion Action Speed Upgrade per Minion Tier
const INFERNO_ACTION_UPGRADE = 34.5;
const INFERNO_ACTION_BASE = 1102 + INFERNO_ACTION_UPGRADE;

// Gets BZ Pricing for "items"
function getPricing() {
    axios.get(BZ_API).then((bazaar) => {
        products = bazaar.data.products

        Object.keys(items).forEach((itemID) => {
            const instaPrice = products[itemID].quick_status.sellPrice;
            const orderPrice = products[itemID].quick_status.buyPrice;

            items[itemID] = [instaPrice, orderPrice];
        })
    })
}

// Initial Setup
getPricing();

// Rounds number and adds commas
function formatInt(num) {
    return Math.round(num).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/*  HYPERGOLIC GABAGOOL:
    2404 Enchanted Coal
    150.25 Enchanted Sulphur
    13824 Crude Gabagool

    Type 0 = Insta Buy
    Type 1 = Buy Order
*/
function calcHypergolic(type) {
    return 2404 * items.ENCHANTED_COAL[type] + 150.25 * items.ENCHANTED_SULPHUR[type] + 13824 * items.CRUDE_GABAGOOL[type];
}

export function calculate(args) {
    // Update Pricing
    getPricing();

    switch (args[1]) {
        case "hypergolic":
        case "hg":
            const instaHypergolic = calcHypergolic(1);
            const orderHypergolic = calcHypergolic(0);
            const instaSellProfit = formatInt(items.HYPERGOLIC_GABAGOOL[0] - instaHypergolic);
            const instaOrderProfit = formatInt(items.HYPERGOLIC_GABAGOOL[1] - instaHypergolic);
            const orderInstaProfit = formatInt(items.HYPERGOLIC_GABAGOOL[0] - orderHypergolic);
            const orderOfferProfit = formatInt(items.HYPERGOLIC_GABAGOOL[1] - orderHypergolic);

            ChatLib.chat(`\n${GOLD}${BOLD}Insta Buy Price: ${RESET}${formatInt(instaHypergolic)}`);
            ChatLib.chat(`${GOLD}${BOLD}Insta Buy Profit (Insta Sell): ${RESET}${instaSellProfit}`);
            ChatLib.chat(`${GOLD}${BOLD}Insta Buy Profit (Sell Offer): ${RESET}${instaOrderProfit}`);
            ChatLib.chat(`${GREEN}${BOLD}Buy Order Price: ${RESET}${formatInt(orderHypergolic)}`);
            ChatLib.chat(`${GREEN}${BOLD}Buy Order Profit (Insta Sell): ${RESET}${orderInstaProfit}`);
            ChatLib.chat(`${GREEN}${BOLD}Buy Order Profit (Sell Offer): ${RESET}${orderOfferProfit}\n`);
            break;
        /*  INFERNO MINION LOOT TABLE:
            Chili Pepper 1/156
            Inferno Vertex 1/16,364
            Inferno Apex 1/1,570,909
            Reaper Pepper 1/458,182

            Minion Speed:
            base / (21 * (1 + flyCatchers + minExpander + infusion + beacon + powerCrystal + risingCelsius))
            base / 71.61 for MAX UPGRADES
        */
        case "inferno": // INFERNO MINION PROFIT
            const minions = isNaN(args[2]) ? 31 : args[2];
            const tier = isNaN(args[3]) ? 3 : args[3];
            const actionSpeed = (INFERNO_ACTION_BASE - (tier * INFERNO_ACTION_UPGRADE)) / 71.61;
            const eyedrop = 1.3;

            // Drops
            const actions = minions * 86400 / (2 * actionSpeed);
            const drops = {
                "GABAGOOL": actions.toFixed(2),
                "CHILI": (eyedrop * actions / 156).toFixed(2),
                "VERTEX": (eyedrop * actions / 16364).toFixed(2),
                "APEX": (eyedrop * actions / 1570909).toFixed(2),
                "REAPER": (eyedrop * actions / 458182).toFixed(2)
            }
            const profit = {
                "GABAGOOL": drops.GABAGOOL * items.CRUDE_GABAGOOL[1],
                "CHILI": drops.CHILI * items.CHILI_PEPPER[1],
                "VERTEX": drops.VERTEX * items.INFERNO_VERTEX[1],
                "APEX": drops.APEX * data.apexPrice,
                "REAPER": drops.REAPER * items.REAPER_PEPPER[1]
            };

            // Fuel + Net Gain (Hydra Heads hard coded for now, I'll update once I get around to it :skull:)
            const fuel = minions * (items.HYPERGOLIC_GABAGOOL[0] + 6 * items.CRUDE_GABAGOOL_DISTILLATE[0] + 800000);
            const net = Object.values(profit).reduce((a, c) => a + c, 0) - fuel;

            // ChatLib the values
            ChatLib.chat(`\n${GOLD}${BOLD}Average Profit for ${minions} Inferno Minion(s) t${tier}`);
            ChatLib.chat(`${AQUA}${BOLD}Crude Gabagool ${GRAY}${BOLD}[${drops.GABAGOOL}]${AQUA}: ${RESET}${formatInt(profit.GABAGOOL)}`);
            ChatLib.chat(`${AQUA}${BOLD}Chili Pepper ${GRAY}${BOLD}[${drops.CHILI}]${AQUA}: ${RESET}${formatInt(profit.CHILI)}`);
            ChatLib.chat(`${AQUA}${BOLD}Inferno Vertex ${GRAY}${BOLD}[${drops.VERTEX}]${AQUA}: ${RESET}${formatInt(profit.VERTEX)}`);
            ChatLib.chat(`${AQUA}${BOLD}Inferno Apex ${GRAY}${BOLD}[${drops.APEX}]${AQUA}: ${RESET}${formatInt(profit.APEX)}`);
            ChatLib.chat(`${AQUA}${BOLD}Reaper Pepper ${GRAY}${BOLD}[${drops.REAPER}]${AQUA}: ${RESET}${formatInt(profit.REAPER)}\n`);
            ChatLib.chat(`${RED}${BOLD}Fuel Price: ${RESET}${formatInt(fuel)}`);
            ChatLib.chat(`${GREEN}${BOLD}Total Profit: ${RESET}${formatInt(net)}\n`);
            break;
        default:
            ChatLib.chat(`${AQUA}Please enter as /va calculate <hypergolic, inferno ${ITALIC}<minions> <tier>${RESET}${AQUA}>`);
            break;
    }
};

// Set Apex Price
export function setApex(args) {
    data.apexPrice = isNaN(args[1]) ? data.apexPrice : args[1];
    ChatLib.chat(`${GREEN}Successfully changed Apex price to ${formatInt(data.apexPrice)}!`);
}