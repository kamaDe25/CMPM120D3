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
                    this.scene.start('gameStart');
                }
            });
        })

    }
    update() {}
}

//Game Start Scene ------------------------------------------------------------------------------------
class gameStart extends Phaser.Scene{
    preload() {}
    create() {
        this.textObjectTitle = this.add.text(
            250,     // x
            0,    // y
            "Cheese  Cake",
            { font: "100px Arial", color: "#f9f7f5" }
        );

        this.input.on('pointerup', () => {
            this.tweens.add({
                targets: [this.textObjectTitle],
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

class level1 extends Phaser.Scene{
    preload() {}
    create() {}
    update() {}
}

//configuration stuff below ---------------------------------------------------------------------------
let config = {
    type: Phaser.WEBGL,
    parent: "root",
    width: 800,
    height: 600,
    backgroundColor:0x141613,
    scene: [StudioIntro, Library, Presentation, Chairs, Start],
}


let game = new Phaser.Game(config);