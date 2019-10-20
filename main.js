var config = {
    type: Phaser.AUTO,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1080,
        height: 720
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1600 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update


    }
};

var bg
var player
var top_water
var water
var pala_eolica
var oil
var tornado1
var tornado2
var cursors
var jumpForce = -800
var timedEvent1
var timedEvent2
var winObject
var tip
var gameover_tip
var reload1
var reload2
var win = false
var gameOver = false



var game = new Phaser.Game(config);

function preload ()
{
  this.load.image('bg', 'assets/background.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('fullscreen', 'assets/fullscreen.png');
  this.load.spritesheet('player', 'assets/omino.png', { frameWidth: 200, frameHeight: 265 });
  this.load.image('pala_eolica', 'assets/pala_eolica.png');
  this.load.image('oil', 'assets/oil.png');
  this.load.image('tornado', 'assets/tornado.png');
  this.load.image('top_water', 'assets/top_water.png');
  this.load.image('pala_eolica', 'assets/pala_eolica.png');
  this.load.image('tip', 'assets/tip.png');
  this.load.image('gameover', 'assets/gameover.png');
}

function create ()
{
  bg = this.add.tileSprite(0, 0, 16069, 608, 'bg');
  bg.setOrigin(0, 0);
  bg.setScale(2.2);



  player = this.physics.add.sprite(100, 590, 'player');
  player.setCollideWorldBounds(true);
  player.setScale(0.4);


  this.playerJumps = 0;

  this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 6,
      repeat: 0
  });

  ground = this.physics.add.staticGroup();
  ground.create(0, 642, 'ground').setOrigin(0, 0).setScale(100).refreshBody();

  pala_eolica = this.physics.add.group({
    key: 'pala_eolica',
    repeat: 4,
    setXY: {x: 1050, y: 400, stepX: 4016}
  });

  pala_eolica.children.iterate(function (child){

    child.setScale(0.3);
    child.body.setAllowGravity(false);

  });

  oil = this.physics.add.group({
    key: 'oil',
    repeat: 6,
    setXY: {x: 1250, y: 590, stepX: 3800}
  });

  oil.children.iterate(function (child){

    child.setScale(0.3);
    child.body.setAllowGravity(false);

  });

  tornado1 = this.physics.add.sprite(8035, 555, 'tornado');
  tornado1.setScale(0.9);

  tornado2 = this.physics.add.sprite(16069 - 200, 555, 'tornado');
  tornado2.setScale(0.9);

  winObject = this.physics.add.sprite(16069 - 100, 540, 'pala_eolica');
  winObject.setScale(0.8);
  winObject.body.setAllowGravity(false);

  top_water = this.add.tileSprite(0,700, 16069, 205, 'top_water');
  top_water.setOrigin(0, 0);
  top_water.setScale(6);
  top_water.setAlpha(0.7);
  water = this.add.tileSprite(0, 870, 16069, 714, 'top_water');
  water.setOrigin(0, 0);
  water.setScale(6);
  water.setAlpha(0.7);

  this.physics.add.existing(top_water);
  top_water.body.setAllowGravity(false);
  this.physics.add.existing(water);
  water.body.setAllowGravity(false);

  var button = this.add.image(1080-20, 16, 'fullscreen', 0).setOrigin(1, 0).setInteractive();
  button.setScale(0.35);
  button.on('pointerup', function () {

          if (this.scale.isFullscreen)
          {
              this.scale.stopFullscreen();
          }
          else
          {
              this.scale.startFullscreen();
          }
  }, this);
  button.setScrollFactor(0);

  this.cameras.main.setBounds(0, 0, 16069, 720);
  this.physics.world.setBounds(0, 0, 16069, 720);
  this.cameras.main.startFollow(player);
  this.cameras.main.setFollowOffset(-270, 0);

  this.input.setTopOnly(false);

  this.input.on('pointerdown', function (pointer, jump) {
      jump = 0
      if (player.body.touching.down && jump === 0)
      {
          player.setVelocityY(jumpForce);
          jump = 1
          //console.log(jump);
      }

      else {

        jump = 0

      }
  }, this);

  timedEvent1 = this.time.delayedCall({delay: 1000, callBack: water_down, callBackScope: this});
  timedEvent2 = this.time.delayedCall({delay: 1000, callBack: water_up, callBackScope: this});

  tip = this.add.image(80, 20, 'tip');
  tip.setOrigin(0, 0);
  tip.setScale(0.75);
  tip.setActive(false);
  tip.setVisible(false);
  tip.setScrollFactor(0);

  gameover_tip = this.add.image(115, 120, 'gameover');
  gameover_tip.setOrigin(0, 0);
  gameover_tip.setScale(0.85);
  gameover_tip.setActive(false);
  gameover_tip.setVisible(false);
  gameover_tip.setScrollFactor(0);

  reload1 = this.add.text(300, 480, "Reload the page to restart", { font: "36px Arial", fill: "white" });
  reload1.setScrollFactor(0);
  reload1.setActive(false);
  reload1.setVisible(false);

  reload2 = this.add.text(280, 330, "Reload the page to restart", { font: "25px Arial", fill: "white" });
  reload2.setScrollFactor(0);
  reload2.setActive(false);
  reload2.setVisible(false);
}

function update ()
{

      if (gameOver)
      {
        return
      }
      player.setVelocityX(650);
      player.anims.play('right', true);

      top_water.y += -0.12;
      water.y += -0.12;

      tornado1.setVelocityX(-150);
      tornado2.setVelocityX(-200);

      this.physics.add.collider(tornado1, ground);
      this.physics.add.collider(tornado2, ground);
      this.physics.add.collider(player, ground);
      this.physics.add.overlap(player, water, death, null, this);
      this.physics.add.overlap(player, pala_eolica, water_down, null, this);
      this.physics.add.overlap(player, oil, water_up, null, this);
      this.physics.add.overlap(player,tornado1, death, null, this);
      this.physics.add.overlap(player,tornado2, death, null, this);
      this.physics.add.overlap(player, winObject, gameWin, null, this);

      //console.log(player.body.velocity.y);
}

function gameWin(player, winObject) {
    this.physics.pause();
    tip.setActive(true);
    tip.setVisible(true);

    reload2.setActive(true);
    reload2.setVisible(true);
    gameOver = true;
}

function death(player, deathfactor) {
  this.physics.pause();
  gameover_tip.setActive(true);
  gameover_tip.setVisible(true);

  reload1.setActive(true);
  reload1.setVisible(true);
  gameOver = true;
}
function water_down(player, pala_eolica) {
  pala_eolica.disableBody(true, true);

    top_water.y += 30;
    water.y += 30;
    //console.log(water.y);

}

function water_up(player, oil) {
  oil.disableBody(true, true);

    top_water.y += -50;
    water.y += -50;
    console.log(water.y);

}
