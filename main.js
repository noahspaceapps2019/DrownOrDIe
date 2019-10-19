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
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var player
var top_water
var water
var pala_eolica
var cursors
var jumpForce = -800
var gameOver = false



var game = new Phaser.Game(config);

function preload ()
{
  this.load.image('bg', 'assets/background.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('fullscreen', 'assets/fullscreen.png');
  this.load.spritesheet('player', 'assets/omino.png', { frameWidth: 200, frameHeight: 265 });
  this.load.image('top_water', 'assets/top_water.png');
  this.load.image('water', 'assets/water.png');
  this.load.image('pala_eolica', 'assets/pala_eolica.png');
}

function create ()
{
  this.add.image(0, -100, 'bg').setOrigin(0, 0);

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

  this.physics.add.collider(player, ground);

  top_water = this.add.tileSprite(0,700, 16069, 205, 'top_water');
  top_water.setOrigin(0, 0);
  top_water.setScale(4);
  top_water.setAlpha(0.7);
  water = this.add.tileSprite(0, 870, 16069, 414, 'water');
  water.setOrigin(0, 0);
  water.setScale(4);
  water.setAlpha(0.7);

  this.physics.add.existing(water);
  water.body.setAllowGravity(false);

  var button = this.add.image(1080-16, 16, 'fullscreen', 0).setOrigin(1, 0).setInteractive();
  button.setScale(0.1);
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
  this.cameras.main.startFollow(player, true, 0.08, 0.08);

  this.input.setTopOnly(false);

  this.input.on('pointerdown', function (pointer, jump) {
      jump = 0
      if (player.body.touching.down && jump === 0)
      {
          player.setVelocityY(jumpForce);
          jump = 1
          console.log(jump);
      }

      else {

        jump = 0
      }
  }, this);



}

function update ()
{
      if (gameOver)
      {
        return;
      }
      player.setVelocityX(500);
      player.anims.play('right', true);

      top_water.y += -0.2;
      water.y += -0.2;
      this.physics.add.overlap(player, water, drown, null, this);

      //console.log(player.body.velocity.y);
}

function drown(player, water) {
  this.physics.pause();

  gameOver = true;
}
