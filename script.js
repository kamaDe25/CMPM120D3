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
            "Cheese Catch",
            { font: "100px Arial", color: "#f9f7f5" }
        );

        this.icon = this.add.image(400, 500, 'cheese').setScale(3);

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
        this.button = this.load.image('button', 'assets/MapSymbols/DoorFalse1x1-Lowres.png')
        this.fan = this.load.image('fan', 'assets/MapSymbols/PitClosedCircle1x1-Lowres.png')
        this.load.image('cheese', 'assets/Pixel_Mart/white_cheese_piece.png')

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
        //this.bowl.body.setSize(1)
        //this.bowl.refreshBody()
        this.fan = this.physics.add.image(690, 400, 'fan').setAngularDrag(0).setAngularVelocity(360)
        this.fan.body.setAllowGravity(false)
        this.button = this.physics.add.staticImage(230, 490, 'button').setScale(0.4)
        this.cheese = this.physics.add.image(685, 250, 'cheese')

        //make sure stuff is solid
        this.physics.add.collider(this.mouse, this.platforms);
        //this.physics.add.collider(this.cheese, this.bowl);
        this.physics.add.overlap(this.mouse, this.button);
        this.physics.add.collider(this.mouse, this.bowl);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.fanOn = true;
        //this.mouse.body.onCollide = true
        this.physics.add.overlap(
            this.mouse,
            this.button,
            () => {
                if(this.fanOn == true){
                    this.fanOn = false
                }else{
                    this.fanOn = true
                }
            }
        )

        this.physics.add.overlap(
            this.cheese,
            this.bowl,
            () => {
                console.log('overlap detected')
                this.textObjectKama = this.add.text(
                    250,     // x
                    0,    // y
                    "You Win!",
                    { font: "75px Arial", color: "#f9f7f5" }
                );
                this.time.delayedCall(
                    2000,
                    () => {  this.scene.start('level1transition');}
                );
            }
        )    
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

        if(this.fanOn == true){
            this.fan.setAngularAcceleration(0).setAngularDrag(0);
            //rotate fan
            //set cheese y velocity to negative so it looks like its being held up by cheese
            this.cheese.body.setAllowGravity(false);
        }else{
            this.fan.body.setAngularDrag(360);
            this.cheese.body.setAllowGravity(true);
            //set cheese y velocity to 0
        }
    }
}

class Level1Transition extends Phaser.Scene{
    constructor(){
        super('level1transition');
    }
    preload(){}
    create(){
        this.textObjectTitle = this.add.text(
            70,     // x
            50,    // y
            "Are you ready for more in level 2?",
            { font: "50px Arial", color: "#f9f7f5", wordWrap: {width: 700} },

        );

        this.input.on('pointerup', () => {
            this.tweens.add({
                targets: [this.textObjectTitle],
                alpha: 0,            // fade to fully transparent
                duration: 1000,      // over 1 second
                ease: 'Linear',

                onComplete: () => {
                    this.scene.start('level2');
                }
            });
        })

    }
    update(){}
}

class Level2 extends Phaser.Scene{
     constructor() {
        super('level2');
    }

    preload(){
        this.tile = this.load.image('tile', 'assets/MapSymbols/Square1x1-Lowres.png')
        this.bowl = this.load.image('bowl', 'assets/Pixel_Mart/bowl.png')
        this.load.spritesheet('mouse', 'assets/SmallAnimals/Mouse.png', {frameWidth: 16, frameHeight: 16})
        this.button = this.load.image('button', 'assets/MapSymbols/DoorFalse1x1-Lowres.png')
        this.fan = this.load.image('fan', 'assets/MapSymbols/PitClosedCircle1x1-Lowres.png')
        this.load.image('cheese', 'assets/Pixel_Mart/white_cheese_piece.png')
        this.pushBlock = this.load.image('block', 'assets/MapSymbols/PitClosedSquare1x1-Lowres.png')
    }
    create(){
         //build environment
        this.platforms = this.physics.add.staticGroup();
        let i = 0;
        for(i = 0; i < tilePositions.length; i++){
            this.platforms.create(tilePositions[i].x, tilePositions[i].y, 'tile').setScale(0.5).refreshBody();
        }

        //adding stuff
        this.mouse = this.physics.add.sprite(50, 500, 'mouse').setFlipX(true).setScale(3).setCollideWorldBounds(true, 0, 0);
        this.bowl = this.physics.add.staticImage(700, 550, 'bowl').setScale(3)
        this.fan = this.physics.add.image(690, 400, 'fan').setAngularDrag(0).setAngularVelocity(360)
        this.fan.body.setAllowGravity(false)
        this.button = this.physics.add.staticImage(300, 600, 'button').setScale(0.4)
        this.cheese = this.physics.add.image(685, 250, 'cheese')
        this.pushBlock = this.physics.add.image(230, 350, 'block').setScale(0.5).setCollideWorldBounds(true)
        this.pushBlock.body.setDrag(300, 0);

        //make sure stuff is solid
        this.physics.add.collider(this.mouse, this.platforms);
        //this.physics.add.overlap(this.mouse, this.button);
        this.physics.add.collider(this.mouse, this.bowl);
        this.physics.add.collider(this.mouse, this.pushBlock);
        this.physics.add.collider(this.pushBlock, this.platforms)

        this.cursors = this.input.keyboard.createCursorKeys();

        this.fanOn = true;
        //this.mouse.body.onCollide = true
        this.physics.add.overlap(
            this.button,
            this.pushBlock,
            () => {
                if(this.fanOn == true){
                    this.fanOn = false
                }else{
                    this.fanOn = true
                }
            }
        )

        this.physics.add.overlap(
            this.cheese,
            this.bowl,
            () => {
                console.log('overlap detected')
                this.textObjectKama = this.add.text(
                    250,     // x
                    0,    // y
                    "You Win!",
                    { font: "75px Arial", color: "#f9f7f5" }
                );
                this.time.delayedCall(
                    2000,
                    () => {  this.scene.start('level2transition');}
                );
            }
        )    
    }
    update(){
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

        if(this.fanOn == true){
            this.fan.setAngularAcceleration(0).setAngularDrag(0);
            //rotate fan
            //set cheese y velocity to negative so it looks like its being held up by cheese
            this.cheese.body.setAllowGravity(false);
        }else{
            this.fan.body.setAngularDrag(360);
            this.cheese.body.setAllowGravity(true);
            //set cheese y velocity to 0
        }
    }
}

class Level2Transition extends Phaser.Scene{
    constructor(){
        super('level2transition');
    }
    preload(){}
    create(){
        this.textObjectTitle = this.add.text(
            70,     // x
            50,    // y
            "Are you ready for more in level 3?",
            { font: "50px Arial", color: "#f9f7f5", wordWrap: {width: 700} },

        );

        this.input.on('pointerup', () => {
            this.tweens.add({
                targets: [this.textObjectTitle],
                alpha: 0,            // fade to fully transparent
                duration: 1000,      // over 1 second
                ease: 'Linear',

                onComplete: () => {
                    this.scene.start('level3');
                }
            });
        })
    }
    update(){}
}

class Level3 extends Phaser.Scene{
    constructor() {
        super('level3');
    }
    preload(){
        this.tile = this.load.image('tile', 'assets/MapSymbols/Square1x1-Lowres.png')
        this.bowl = this.load.image('bowl', 'assets/Pixel_Mart/bowl.png')
        this.load.spritesheet('mouse', 'assets/SmallAnimals/Mouse.png', {frameWidth: 16, frameHeight: 16})
        this.button = this.load.image('button', 'assets/MapSymbols/DoorFalse1x1-Lowres.png')
        this.fan = this.load.image('fan', 'assets/MapSymbols/PitClosedCircle1x1-Lowres.png')
        this.load.image('cheese', 'assets/Pixel_Mart/white_cheese_piece.png')
        this.platform2 = this.load.image('platform2', 'assets/MapSymbols/Bench1x1-Lowres.png')
    }
    create(){
          //build environment
        this.platforms = this.physics.add.staticGroup();
        let i = 0;
        for(i = 0; i < tilePositions.length; i++){
            this.platforms.create(tilePositions[i].x, tilePositions[i].y, 'tile').setScale(0.5).refreshBody();
        }

        //adding stuff
        this.mouse = this.physics.add.sprite(50, 500, 'mouse').setFlipX(true).setScale(3).setCollideWorldBounds(true, 0, 0);
        this.bowl = this.physics.add.staticImage(700, 550, 'bowl').setScale(3)
        this.fan = this.physics.add.image(690, 370, 'fan').setAngularDrag(0).setAngularVelocity(360)
        this.fan.body.setAllowGravity(false)
        this.button = this.physics.add.staticImage(300, 600, 'button').setScale(0.4)
        this.cheese = this.physics.add.image(685, 220, 'cheese')
        
        this.platform2 = this.physics.add.image(685, 450, 'platform2').setImmovable(true)
        this.platform2.body.setAllowGravity(false)
        this.platform2.body.setSize(70, 20)
        this.platform2.setVisible(false)

        this.pushBlock = this.physics.add.image(230, 350, 'block').setScale(0.5).setCollideWorldBounds(true)
        this.pushBlock.body.setDrag(300, 0);

        //make sure stuff is solid
        this.physics.add.collider(this.mouse, this.platforms);
        this.physics.add.collider(this.mouse, this.bowl);
        this.physics.add.collider(this.mouse, this.pushBlock);
        this.physics.add.collider(this.pushBlock, this.platforms)

        this.cursors = this.input.keyboard.createCursorKeys();

        this.blockOnButton = false;
        this.fanOn = true;

        this.physics.add.overlap(
            this.button,
            this.pushBlock,
            () => {
                this.blockOnButton = true;
                /*if(this.fanOn == true){
                    this.fanOn = false
                }else{
                    this.fanOn = true
                }*/
            }
        )

        this.physics.add.overlap(
            this.cheese,
            this.bowl,
            () => {
                console.log('overlap detected')
                this.textObjectKama = this.add.text(
                    250,     // x
                    0,    // y
                    "You Win!",
                    { font: "75px Arial", color: "#f9f7f5" }
                );
                this.time.delayedCall(
                    2000,
                    () => {  this.scene.start('complete');}
                );
            }
        )
        
        this.platformCollider = this.physics.add.collider(
            this.platform2, 
            this.cheese,
            () => this.cheeseLandedPlatform = true
        );
        this.platformCollider.active = false;

        this.cheeseLandedPlatform = false;
    }
    update(){
        
        if (this.blockOnButton == true){
            this.fanOn = false
        }else{
            this.fanOn = true
        }

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

        if(this.fanOn == true){
            this.fan.body.setAngularDrag(0);
            //rotate fan
            //set cheese y velocity to negative so it looks like its being held up by cheese
            this.platform2.setVisible(false) 
            this.platformCollider.active = false;
            if(this.cheeseLandedPlatform == false){
                this.cheese.body.setAllowGravity(false);
            }else{
                this.cheese.body.setAllowGravity(true);
                this.cheese.setVelocityY(200);
                //this.cheeseLandedPlatform = false;
            }
            
        }else{
            this.fan.body.setAngularDrag(360);
            this.cheese.body.setAllowGravity(true);
            //this.platformCollider = true;
            this.platformCollider.active = true;
            this.platform2.setVisible(true) 
            //this.platformCollider.active = true;
            //this.physics.add.collider(this.platform2, this.cheese);
            //set cheese y velocity to 0
        }

        //fanOn/Off
        this.blockOnButton = false
    }

}

class Complete extends Phaser.Scene{
    constructor() {
        super('complete');
    }
    preload(){}
    create(){
        this.textObjectTitle = this.add.text(
            70,     // x
            50,    // y
            "Congratuation! You caught the cheese!",
            { font: "50px Arial", color: "#f9f7f5", wordWrap: {width: 700} },

        );
    }
    update(){}

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
            gravity: {y: 200},
            fixedStep: true
        }
    },
    scene: [StudioIntro, gameStart, Level1, Level2, Level3, Complete, Level1Transition, Level2Transition]
}


let game = new Phaser.Game(config);