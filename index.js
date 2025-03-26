// Utility Modules
import {
  AQUA,
  BOLD,
  DARK_AQUA,
  DARK_GRAY,
  DARK_RED,
  GOLD,
  GRAY,
  GREEN,
  LOGO,
  RED,
  RESET,
  UNDERLINE,
  WHITE,
  YELLOW,
} from "./utils/Constants";
import { data, resetGUI } from "./utils/Data";
import "./utils/DevTils";
import "./utils/Launch";
import Settings from "./utils/Settings";

// Rift
import "./features/rift/BerberisHelper"

/**
 * Open settings GUI.
 */
function openSettings() {
  try {
    Settings.openGUI();
  } catch (err) {
    ChatLib.chat(`${LOGO + RED}Error opening Settings... Please run '/ct reload' to fix!`);
    register("gameUnload", () => {
      FileLib.delete("FreackyAddons", "config.toml");
    }).setPriority(Priority.LOWEST);
  }
}

register("command", (...args) => {
  openSettings();
  return;
})
  .setName("fa")
  .setAliases("freackyaddons", "freacky");
