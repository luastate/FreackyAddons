import {
  AQUA,
  BLUE,
  BOLD,
  DARK_RED,
  GOLD,
  GRAY,
  GREEN,
  HEADER,
  ITALIC,
  RED,
} from "./Constants";

@Vigilant("FreackyAddons", "FreackyAddons", {
  getCategoryComparator: () => (a, b) => {
    const categories = [
      "Rift",
    ];
    return categories.indexOf(a.name) - categories.indexOf(b.name);
  },
})
class Settings {
  constructor() {
    this.initialize(this);

    // Rift Category
    this.setCategoryDescription(
      "Rift",
      `${HEADER}
${ITALIC}Related Commands: /fa <enigma, npc, zone>`
    );
  }
}

export default new Settings();
