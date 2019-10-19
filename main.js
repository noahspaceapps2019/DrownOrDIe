var config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.AUTO,
        width: 1920,
        height: 1080
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

var player
var cursors
var jumpForce = -1000
var jump = 0



var game = new Phaser.Game(config);

function preload ()
{
  this.load.image('bg', 'assets/background.png');
  this.load.image('ground', 'assets/platform.png');
  this.load.image('fullscreen', 'assets/fullscreen.png');
  this.load.spritesheet('player', 'assets/Omino.png', { frameWidth: 177, frameHeight: 265 });
}

function create ()
{
  this.add.image(0, 0, 'background').setOrigin(0, 0);

  player = this.physics.add.sprite(100, 900, 'player');
  player.setCollideWorldBounds(true);
  player.setScale(0.3);

  this.playerJumps = 0;

  this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 4 }),
      frameRate: 6,
      repeat: 0
  });

  ground = this.physics.add.staticGroup();
  ground.create(0, 1000, 'ground').setOrigin(0, 0).setScale(6).refreshBody();

  this.physics.add.collider(player, ground);

  platforms = this.physics.add.staticGroup();

  platforms.create(600, 450, 'ground').setScale(1.5).refreshBody();
  platforms.create(50, 250, 'ground').setScale(1.5).refreshBody();
  platforms.create(750, 120, 'ground').setScale(1.5).refreshBody();

  this.physics.add.collider(player, platforms);

  var button = this.add.image(800-16, 16, 'fullscreen', 0).setOrigin(1, 0).setInteractive();
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

  this.cameras.main.setBounds(0, 0, 10080, 720);
  this.physics.world.setBounds(0, 0, 10080, 1080);
  this.cameras.main.startFollow(player, true, 0.08, 0.08);

  this.input.setTopOnly(false);

  this.input.on('pointerdown', function (pointer, thid) {

      if (jump === 0)
      {
          player.setVelocityY(jumpForce);
          jump = 1
      }
      else if (jump = 1) {
        player.setVelocityY(jumpForce);
        jump++
      }
      else {
        player.setVelocityY(0);
        jump = 0;
      }
  }, this);
}
function update ()
{

      player.setVelocityX(500);

      player.anims.play('right', true);


      console.log(player.body.velocity.y);
}
