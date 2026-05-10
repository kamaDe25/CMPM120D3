 tilePositions = [
            {x: 192.5, y: 507.5},
            {x: 227.5, y: 507.5}
]
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
        this.bowl = this.load.image('bowl', 'assets/Pixel_Mart/bowl.png')
        this.load.spritesheet('mouse', 'assets/SmallAnimals/Mouse.png', {frameWidth: 16, frameHeight: 16})
        this.slope = this.load.image('slope', 'assets/MapSymbols/TriangleArrowhead1x1-Lowres.png')
        this.button = this.load.image('button', 'asset/MapSymbols/DoorFalse1x1-Lowres.png')
    }
    create() {
        //build environment
        this.platforms = this.physics.add.staticGroup();
        let i = 0;
        for(i = 0; i < tilePositions.length; i++){
            this.platforms.create(tilePositions[i].x, tilePositions[i].y, 'tile').setScale(0.5).refreshBody();
        }

        //adding stuff
        this.mouse = this.physics.add.sprite(50, 500, 'mouse').setFlipX(true).setScale(3).setCollideWorldBounds(true, 0, 0);
        this.bowl = this.physics.add.staticImage(700, 550, 'bowl').setScale(3)
        this.slop = this.physics.add.staticImage(600, 300, 'slope')
        this.button = this.physics.add.staticImage(100, 400, 'button')

        //make sure platforms are solid for mouse
        this.physics.add.collider(this.mouse, this.platforms);

        this.cursors = this.input.keyboard.createCursorKeys();

        
    }
    update() {
        //player movement
        const { left, right, up } = this.cursors;

        if (left.isDown)
        {
            this.mouse.setVelocityX(-160);

            //this.mouse.anims.play('left', true);
        }
        else if (right.isDown)
        {
            this.mouse.setVelocityX(160);

            //this.mouse.anims.play('right', true);
        }
        else
        {
            this.mouse.setVelocityX(0);

            //this.mouse.anims.play('turn');
        }
        if (up.isDown && this.mouse.body.blocked.down){
            this.mouse.setVelocityY(-250);
        }
    }
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