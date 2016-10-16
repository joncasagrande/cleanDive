var game = new Phaser.Game(600, 800, Phaser.AUTO, '', 
    { preload: preload, create: create, update: update, render: render });
var score = 0;
var scoreText;

//var player;
var platforms;
var cursors;

var stars;
var score = 0;
var scoreText;

function preload() {
    game.load.image('sky', 'img/sky.png');
    game.load.image('ground', 'img/platform.png');
    game.load.image('star', 'img/star.png');
    game.load.spritesheet('dude', 'img/dude.png', 32, 48);
}

function create() {
    game.world.setBounds(-1000, -1000, 2000, 2000);
    land = game.add.tileSprite(-1000, -1000, 2000, 2000, 'sky');
    

    game.physics.startSystem(Phaser.Physics.ARCADE);
    //game.add.sprite(0, 0, 'sky');
    
    platforms = game.add.group();
    stars = game.add.group();

    
    createPlatform(platforms)
    createStars(stars);
    createPlayer()
    
    scoreText = game.add.text(0, 0, 'score: 0', { fontSize: '18px', fill: '#000' });

    cursors = game.input.keyboard.createCursorKeys();
    game.camera.follow(player);
}

function update() {

    //  Collide the player and the stars with the platforms
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(stars, platforms);
    game.physics.arcade.overlap(player, stars, collectStar, null, this);
    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.left.isDown){
        //  Move to the left
        player.body.velocity.x = -150;
        //player.scale.x = -1;
        player.animations.play('left');

    }else if (cursors.right.isDown){
        //  Move to the right
        player.body.velocity.x = 150;
        //player.scale.x = 1;
        player.animations.play('right');
    }else if(cursors.down.isDown){
        player.body.velocity.y = 150;
        player.animations.play('down');
    }else if(cursors.up.isDown){
    player.body.velocity.y = -150;
    }else{
        //  Stand still
        player.animations.stop();
        player.frame = 4;
    }
}

function render(){
    scoreText.text = 'Score: ' + score;
}

function collectStar (player, star) {
    star.kill();
    score += 10;    
}

function createPlayer(){
    player = game.add.sprite(32, 250, 'dude');
    game.physics.arcade.enable(player);

    player.anchor.set(0.5);
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
}

function createPlatform(platforms){
    platforms.enableBody = true;
    
    var ground = platforms.create(0,250, 'ground');
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;
}

function createStars(stars){
    stars.enableBody = true;
    for(var i = 0; i< 12; i++){
        var star = stars.create(i * 70, 0, 'star');
            star.body.gravity.y = 6;
            star.body.bounce.y = 0.7 + Math.random() * 0.2;

    }
    game.physics.arcade.collide(stars, platforms);
}