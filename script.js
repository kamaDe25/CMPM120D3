//Intro Scene---------------------------------------------------------
class StudioIntro extends Phaser.Scene {
    constructor() {
        super('studiointro');
    }
    preload() {}
    create() {
       
        this.textObjectKama = this.add.text(
            250,     // x
            0,    // y
            "KAMA",
            { font: "100px Arial", color: "#f9f7f5" }
        );

        this.textObjectStudios = this.add.text(
            250,    //x
            400,    //y
            "Studios",
            {font: "85px Arial", color: "#f9f7f5"}

        );

        this.textObjectClick = this.add.text(
            500,
            500,
            "Click to continue",
            {font: "30px Arial", color: "#f9f7f5"}
        );

        this.tweens.add({
            targets: this.textObjectKama,
            x: 250,
            y: 200,
            duration: 1000,
            ease: 'Linear',
        });

        this.tweens.add({
            targets: this.textObjectStudios,
            x: 250,
            y: 280,
            duration: 1000,
            ease: 'Linear',
        });

        this.input.on('pointerup', () => {
            this.tweens.add({
                targets: [this.textObjectKama, this.textObjectStudios, this.txtObjectClick],
                alpha: 0,            // fade to fully transparent
                duration: 1000,      // over 1 second
                ease: 'Linear',

                onComplete: () => {
                    this.scene.start('gamestart');
                }
            });
        })

    }
    update() {}
}

//Game Start Scene ------------------------------------------------------------------------------------
class gameStart extends Phaser.Scene{
    constructor() {
        super('gamestart');
    }
    preload() {
        this.cheese = this.load.image('cheese', 'assets/Pixel_Mart/white_cheese_piece.png')
    }

    create() {
        this.textObjectTitle = this.add.text(
            70,     // x
            50,    // y
            "Cheese Cake",
            { font: "100px Arial", color: "#f9f7f5" }
        );

        this.icon = this.add.image(250, 300, 'cheese').setScale(3);

        this.input.on('pointerup', () => {
            this.tweens.add({
                targets: [this.textObjectTitle, this.icon],
                alpha: 0,            // fade to fully transparent
                duration: 1000,      // over 1 second
                ease: 'Linear',

                onComplete: () => {
                    this.scene.start('level1');
                }
            });
        })
    }
    update() {}
}

//map function-------------------------------------------------------------------------
function createMap(scene) {

    // map generation code goes here
}// call this function in create()

//Level 1 Scene--------------------------------------------------------------------
class Level1 extends Phaser.Scene{
    constructor() {
        super('level1');
    }

    preload() {
        this.tile = this.load.image('tile', 'assets/MapSymbols/Square1x1-Lowres.png')
        this.load.spritesheet('mouse', 'assets/SmallAnimals/Mouse.png', {frameWidth: 16, frameHeight: 16})

        tilePositions = [
            { x: firstX, y: firstY },
            { x: secondX, y: secondY },
            {}
        ]
    }
    create() {
        //build environment
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(250, 300, 'tile').setScale(0.5).refreshBody();

        //player info below
        this.mouse = this.physics.add.sprite(50, 500, 'mouse').setFlipX(true).setScale(3).setCollideWorldBounds(true, 0, 0);

    }
    update() {}
}

//configuration stuff below ---------------------------------------------------------------------------
let config = {
    type: Phaser.WEBGL,
    parent: "root",
    width: 800,
    height: 600,
    backgroundColor:0x141613,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: {y: 200}
        }
    },
    scene: [StudioIntro, gameStart, Level1],
}


let game = new Phaser.Game(config);