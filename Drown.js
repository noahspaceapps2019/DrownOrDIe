class Drown extends Phaser.Scene {
  constructor() {
    super("Drown.death");
  }

  create() {
      this.add.text(20, 20, "Loading game...", { font: "25px Arial", fill: "yellow" });
  }
}
