// main.js
class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
    this.emojiList = [
      "😊",
      "🎮",
      "🚀",
      "🌟",
      "🎯",
      "🎪",
      "🎨",
      "🎭",
      "🎢",
      "🤖",
      "👾",
      "🤠",
      "🍉",
      "🍓",
      "🥑",
      "🥕",
      "🌶️",
      "🍌",
      "🍯",
      "❄️",
      "🌐",
      "💻",
      "📱",
      "💡",
      "🔋",
      "🔌",
      "💰",
      "⛄️",
      "🔥",
      "🌪️",
      "🌬️",
      "💨",
      "💧",
      "💦",
      "💤",
      "💫",
      "💥",
      "💢",
      "🎄",
      "🎆",
      "🎇",
      "🎈",
      "🎉",
      "🎊",
      "🎋",
      "🎍",
      "🎎",
      "🎏",
      "🎐",
      "🎑",
      "🎒",
      "🎓",
      "🎖️",
      "🎗️",
      "🍖",
    ];
    this.currentLevel = parseInt(localStorage.getItem("level")) || 1;
    this.baseEmojiSize = window.innerWidth < 768 ? 128 : 64;

    // Détection du dark mode
    this.isDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    // Écouter les changements de thème
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        this.isDarkMode = e.matches;
        this.updateColors();
      });
  }

  preload() {
    // Pas besoin de charger des images
  }

  create() {
    // Rendre le jeu responsive
    this.scale.on("resize", this.resize, this);
    this.resize({ width: window.innerWidth, height: window.innerHeight });

    // Position centrale
    const centerX = this.cameras.main.centerX;
    const centerY = this.cameras.main.centerY;

    // Emoji principal
    this.emoji = this.add
      .text(centerX, centerY, this.emojiList[0], {
        fontSize: this.baseEmojiSize + "px",
        lineHeight: 1.4,
        padding: { y: this.baseEmojiSize * 0.2 },
      })
      .setOrigin(0.5)
      .setInteractive();

    // Compteurs
    this.emojis = parseInt(localStorage.getItem("emojis")) || 0;
    this.emojisPerClick = parseInt(localStorage.getItem("emojisPerClick")) || 1;
    this.upgradeCost = parseInt(localStorage.getItem("upgradeCost")) || 10;

    // Affichage des compteurs
    this.emojisText = this.add
      .text(centerX, 50, "Emojis: " + this.emojis, {
        fontSize: "32px",
        fill: "#000",
      })
      .setOrigin(0.5);

    this.levelText = this.add
      .text(centerX, 100, "Level: " + this.currentLevel, {
        fontSize: "32px",
        fill: "#000",
      })
      .setOrigin(0.5);

    // Bouton d'amélioration plus haut
    this.upgradeButton = this.add
      .text(
        centerX,
        centerY + 150,
        "Upgrade (Cost: " + this.upgradeCost + ") 📈",
        {
          fontSize: "24px",
          fill: "#000",
        }
      )
      .setOrigin(0.5)
      .setInteractive();

    // Événements
    this.emoji.on("pointerdown", this.collectEmoji, this);
    this.upgradeButton.on("pointerdown", this.upgradeClick, this);

    // Charger le nombre d'emojis sauvegardé
    this.emojis = parseInt(localStorage.getItem("emojis")) || 0;
    this.emojisPerClick = parseInt(localStorage.getItem("emojisPerClick")) || 1;
    this.upgradeCost = parseInt(localStorage.getItem("upgradeCost")) || 10;

    // Mettre à jour l'affichage initial avec les valeurs sauvegardées
    this.emojisText.setText("Emojis: " + this.emojis);
    this.levelText.setText("Level: " + this.currentLevel);
    this.upgradeButton.setText("Upgrade (Cost: " + this.upgradeCost + ") 📈");

    // Mettre à jour l'emoji initial
    const emojiIndex = (this.currentLevel - 1) % this.emojiList.length;
    this.emoji.setText(this.emojiList[emojiIndex]);

    // Appliquer les couleurs initiales
    this.updateColors();

    // Ajuster la taille des textes pour mobile
    const textSize = window.innerWidth < 768 ? "48px" : "32px";
    const buttonSize = window.innerWidth < 768 ? "36px" : "24px";

    this.emojisText.setFontSize(textSize);
    this.levelText.setFontSize(textSize);
    this.upgradeButton.setFontSize(buttonSize);
  }

  resize(gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;

    this.cameras.main.setViewport(0, 0, width, height);

    if (this.emoji) {
      this.emoji.setPosition(width / 2, height / 2 - 150);
      this.emojisText.setPosition(width / 2, 50);
      this.levelText.setPosition(width / 2, 100);
      this.upgradeButton.setPosition(width / 2, height - 450);

      // Repositionner le message d'erreur
      if (this.errorText) {
        this.errorText.setPosition(
          width / 2 - this.upgradeButton.width / 2,
          this.upgradeButton.y - 60
        );
      }
    }
  }

  collectEmoji() {
    this.emojis += this.emojisPerClick;
    this.emojisText.setText("Emojis: " + this.emojis);

    // Animation de clic plus grande
    this.tweens.add({
      targets: this.emoji,
      scale: { from: 1, to: 2.5 },
      rotation: { from: -0.2, to: 0.2 },
      duration: 300,
      ease: "Bounce.easeOut",
      yoyo: true,
    });

    // Effet de particules plus grand
    const x = this.emoji.x;
    const y = this.emoji.y;
    const sparkle = this.add.text(x, y, "✨", {
      fontSize: "48px",
    });
    sparkle.setOrigin(0.5);

    this.tweens.add({
      targets: sparkle,
      y: y - 150,
      alpha: 0,
      duration: 1200,
      onComplete: () => sparkle.destroy(),
    });

    if (this.errorText) {
      this.errorText.destroy();
    }
  }

  upgradeClick() {
    if (this.emojis >= this.upgradeCost) {
      this.emojis -= this.upgradeCost;
      this.emojisPerClick += 1;
      this.currentLevel += 1;

      // Changer l'emoji
      const emojiIndex = (this.currentLevel - 1) % this.emojiList.length;
      this.emoji.setText(this.emojiList[emojiIndex]);

      // Mettre à jour les textes
      this.emojisText.setText("Emojis: " + this.emojis);
      this.levelText.setText("Level: " + this.currentLevel);

      this.upgradeCost *= 2;
      this.upgradeButton.setText("Upgrade (Cost: " + this.upgradeCost + ") 📈");

      // Réinitialiser la taille
      this.emoji.setScale(1);

      // Sauvegarder toutes les données après une amélioration
      localStorage.setItem("emojis", this.emojis);
      localStorage.setItem("level", this.currentLevel);
      localStorage.setItem("emojisPerClick", this.emojisPerClick);
      localStorage.setItem("upgradeCost", this.upgradeCost);

      // Retirer le message d'erreur s'il existe
      if (this.errorText) {
        this.errorText.destroy();
      }

      // Animation de niveau plus spectaculaire
      this.tweens.add({
        targets: this.emoji,
        scale: { from: 1, to: 4 },
        rotation: { from: 0, to: Math.PI * 4 },
        duration: 1500,
        ease: "Cubic.easeOut",
        onComplete: () => {
          // Plus de particules dans l'explosion
          for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const sparkle = this.add
              .text(this.emoji.x, this.emoji.y, "🌟", { fontSize: "48px" })
              .setOrigin(0.5);

            this.tweens.add({
              targets: sparkle,
              x: this.emoji.x + Math.cos(angle) * 200,
              y: this.emoji.y + Math.sin(angle) * 200,
              alpha: 0,
              duration: 1500,
              onComplete: () => sparkle.destroy(),
            });
          }
        },
      });
    } else {
      // Message d'erreur plus haut
      this.errorText = this.add
        .text(
          this.scale.width / 2 - this.upgradeButton.width / 2,
          this.upgradeButton.y - 60,
          "❌ Not enough emojis!",
          {
            fontSize: "24px",
            fill: "#f00",
          }
        )
        .setOrigin(0, 0.5);
    }
  }

  update() {
    // Grossissement progressif de l'emoji
    const progress = this.emojis / this.upgradeCost;
    const scale = 1 + progress;
    this.emoji.setScale(scale);
  }

  updateColors() {
    const textColor = this.isDarkMode ? "#ffffff" : "#000000";
    const bgColor = this.isDarkMode ? "#1a1a1a" : "#f0f0f0";

    this.cameras.main.setBackgroundColor(bgColor);

    if (this.emojisText) {
      this.emojisText.setColor(textColor);
      this.levelText.setColor(textColor);
      this.upgradeButton.setColor(textColor);
    }
  }
}

const config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.RESIZE,
    parent: "game",
    width: "100%",
    height: "100%",
    zoom: window.innerWidth < 768 ? 2 : 1, // Zoom x2 sur mobile
  },
  scene: [GameScene],
  backgroundColor: window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "#1a1a1a"
    : "#f0f0f0",
};

const game = new Phaser.Game(config);
