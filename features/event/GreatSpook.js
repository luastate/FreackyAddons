import settings from "../../utils/Settings";
import { AMOGUS, BOLD, GREEN, LOGO, RED, WHITE } from "../../utils/Constants";
import { playSound } from "../../utils/functions/misc";
import { registerWhen } from "../../utils/RegisterTils";


/**
 * Primal Fear Tracker
 */
registerWhen(register("step", () => {
    if (!World.isLoaded()) return;

    if (TabList.getNames().find(name => name === "§r §r§cPrimal Fears§r§7: §r§61s§r") !== undefined) {
        Client.showTitle(`${RED + BOLD}FEAR UP`, '', 10, 50, 10);
        playSound(AMOGUS, 10000);
    }
}).setFps(2), () => settings.fearAlert);

/**
 * Use eval to solve math teacher equation
 */
registerWhen(register("chat", (equation, event) => {
    ChatLib.chat(`${LOGO}&r&d&lQUICK MATHS! &r&7Solve: &r&e${equation + WHITE} = ${GREEN + eval(equation.replace(/[x]/g, '*'))}&r`);
    cancel(event);
}).setCriteria("QUICK MATHS! Solve: ${equation}"), () => settings.mathSolver);

