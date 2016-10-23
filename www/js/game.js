var game = new Phaser.Game(600, 800, Phaser.AUTO, '', 
    { preload: preload, create: create, update: update, render: render });
var score = 0;
var scoreText;

var player;
var platforms;
var cursors;

var stars;
var score = 0;
var scoreText;

var enemy;

function preload() {
    game.load.image('sky', 'img/sky.png');
    game.load.image('ground', 'img/platform.png');
    game.load.image('star', 'img/star.png');
    game.load.image('enemy', 'img/diamond.png')
    game.load.spritesheet('dude', 'img/dude.png', 32, 48);
}

function create() {
    game.physics.startSystem(Phaser.Physics.P2JS);
    game.world.setBounds(0, 0, 600, 4000*4000);
    land = game.add.tileSprite(0, 0, 600, 4000*4000, 'sky');
    
    enemy = game.add.sprite(300, 60, 'enemy');
    game.physics.p2.enable(enemy,false);    
    
    //game.add.sprite(0, 0, 'sky');
    
    platforms = game.add.group();
    stars = game.add.group();

    game.time.events.repeat(Phaser.Timer.SECOND * 2, 10, createStars, this);
   // createPlatform(platforms)
   // createStars(stars);
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
        player.body.velocity.y = 450;
        player.animations.play('down');
    }else if(cursors.up.isDown){
        player.body.velocity.y = -150;
    }else{
        //  Stand still
        player.animations.stop();
        player.frame = 4;
    }

    if(!Phaser.Rectangle.contains(player.body, enemy.x, enemy.y)){
        accelerateToObject(enemy, player, 30);
    }
}

function accelerateToObject(obj1, obj2, speed) {
    if (typeof speed === 'undefined') { speed = 60; }
    var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
    obj1.body.rotation = angle + game.math.degToRad(90);  // correct angle of angry bullets (depends on the sprite used)
    obj1.body.force.x = Math.cos(angle) * speed;    // accelerateToObject 
    obj1.body.force.y = Math.sin(angle) * speed;
}

function render(){
    scoreText.text = 'Score: ' + score;
}

function collectStar (player, star) {
    star.kill();
    score += 10;    
}

function createPlayer(){
    player = game.add.sprite(0, 0, 'dude');
    game.physics.arcade.enable(player);

    player.anchor.set(0.5);
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
    game.physics.p2.enable(player);
}

function createPlatform(platforms){
    platforms.enableBody = true;
    
    var ground = platforms.create(0,250, 'ground');
        ground.scale.setTo(2, 2);
        ground.body.immovable = true;
}

function createStars(){
    stars.enableBody = true;
    var star = stars.create(game.world.randomX, 0,'star');
        star.body.gravity.y = 6;
        star.body.bounce.y = 0.7 + Math.random() * 0.2;

    game.physics.arcade.collide(stars, platforms);
}