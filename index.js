//----------------------variables----------------------//
Game = {};
Game.scenes = [];
Game.scenes[1] = {};
Game.layers = [];
Game.layers[1] = {}
//----------------------resources----------------------//
Game.res = {
    HelloWorld_png : "HelloWorld.png",
    icons : "icons.png",
    sprites_plist: "icons.plist"
};

Game.g_resources = [];
Game.firstColumn = [];
Game.secondColumn = [];
Game.thirdColumn = [];

Game.player = {};
Game.player.addSprite = {};
Game.player.addAnimation = {};
Game.player.runAnimation = {};

let text;
let inGame = false; //статус гри
let button;
let redLine;


//інформація спрайтів
let infoSprite = {
    CC: 'icons/CC.png',
    DD: 'icons/DD.png',
    EE: 'icons/EE.png',
    WC: 'icons/WC.png',
    WC_X2: 'icons/WC_X2.png',
    BL: 'icons/BL.png',
    AA: 'icons/AA.png',
    BB: 'icons/BB.png'
};


const ICONS = [
    infoSprite.CC,
    infoSprite.DD,
    infoSprite.EE,
    infoSprite.WC,
    infoSprite.WC_X2,
    infoSprite.AA,
    infoSprite.BB
];
//іконок в рядку
const ICONS_IN_LINE = 15;




for (const i in Game.res ) {
    Game.g_resources.push( Game.res[i] );
}
//----------------------scenes----------------------//

Game.scenes[1].extend = cc.Scene.extend({
    onEnter:function () {
        this._super();
        const layer = new Game.layers[1].extend();
        layer.init();
        this.addChild( layer );
    }
});



//----------------------layers----------------------//
Game.layers[1].extend = cc.LayerColor.extend({
    init: function () {
        this._super();
        this.setColor(cc.color(255,255,255));
        let game = this;
        Game.layers[1].start( game );
    }
});
//колбек після зупинки спінів
function onIconsStop() {
    //перевірка на виграш
    if (Game.firstColumn[1].getName() === Game.secondColumn[1].getName() &&
        Game.secondColumn[1].getName() === Game.thirdColumn[1].getName()) {
        text.setString("Result: WIN");
        redLine.visible = true;
    } else {
        text.setString("Result: Not win");
    }

    inGame = false; //зміна статусу гри
    button.setEnabled(true);    //зміна статусу кнопки
    button.setBright(true);
}

//перший шар
Game.layers[1].start = function( game ) {
    //маска
    let rect = [];
    rect[0] = cc.p(0, 0);
    rect[1] = cc.p(700, 0);
    rect[2] = cc.p(700, 450);
    rect[3] = cc.p(0, 450);

    let node = cc.Node.create();

    let mask = new cc.DrawNode();

    let red = cc.color.RED;
    mask.clear();
    mask.drawPoly(rect, 4, red, 0, red);


    let maskedFill = new cc.ClippingNode(mask);

    maskedFill.addChild(node);
    maskedFill.setPosition(150, 225);
    game.addChild(maskedFill);

    createPlayField(); //створюємо ігрове поле
    addGameSprites(node); //додаєио колонки на поле
    createButton(game); //додаємо кнопки
    createText(game); //створюємо текст
    createBorder(game); //створюємо рамку
    createLine(game); //ліня "виграшу)

};

//додаємо колонки на поле
function addGameSprites(game) {
    const x = 250;
    const y = 158;
    for (let i = 0; i < Game.firstColumn.length; i++) {
        addGameSprite(game,Game.firstColumn[i],0,y * (i));
        addGameSprite(game,Game.secondColumn[i],x,y * (i));
        addGameSprite(game,Game.thirdColumn[i],x * 2,y * (i ));

    }
    //додаємо спрайт на поле
    function addGameSprite(game, sprite, x, y) {
        sprite.setPosition(x,y);
        sprite.anchorY = 0;
        sprite.anchorX = 0;
        sprite.setScale(0.8);
        game.addChild(sprite, 0);
    }
}

//створюємо ігрове поле
function createPlayField() {
    createColumn(Game.firstColumn);
    createColumn(Game.secondColumn);
    createColumn(Game.thirdColumn);
}

//створюємо колонку
function createColumn(column) {
    for (let i = 0; i < ICONS_IN_LINE; i++) {
        const index = Math.floor(Math.random() * ICONS.length);
        column.push(createSprite(ICONS[index], index));
    }
}
//створюємо текст
function createText(game) {

    text = new ccui.Text();
    text.setColor("Black");
    text.setFontSize(30);
    text.setString("Result:");
    text.x = 300;
    text.y = 100;

    game.addChild(text);
}
//створюємо кнопку
function createButton(game) {
    button= new ccui.Button();
    button.loadTextures("Button_Normal.png", "Button_Disable.png","Button_Disable.png");
    button.x = 700;
    button.y = 100;
    button.setTitleColor("Black");
    button.setTitleText("SPIN");
    button.setTitleFontSize(30);
    button.addTouchEventListener(this.touchEvent, this);

    game.addChild(button);
}
//обробка натискання кнопки
function touchEvent(sender, type) {

    switch (type) {
        case ccui.Widget.TOUCH_BEGAN:
            if (inGame === false) {
                inGame = true;
            } else {
                break;
            }
            if (inGame) {
                redLine.visible = false; //статус лінії
                button.setEnabled(false); //статус кнопки
                button.setBright(false);
                setTimeout(moveColumn, 0, Game.firstColumn, 20); //рухаємо колонки
                setTimeout(moveColumn, 0, Game.secondColumn, 23);
                setTimeout(moveColumn, 0, Game.thirdColumn, 26, onIconsStop);

                text.setString("Result:");
            }
            break;
    }
}
//створюємо спрайт
function createSprite(gSprite, index) {
    let nodeSprite = new cc.Node();
    nodeSprite.setName(index.toString());
    let sprite = cc.Sprite.createWithTexture(cc.spriteFrameCache.getSpriteFrame(gSprite));
    sprite.setAnchorPoint(0,0);
    nodeSprite.addChild(sprite);
    return nodeSprite;

}
//створюємо червону лінію
function createLine(game) {
    redLine = new cc.DrawNode();
    redLine.drawSegment(cc.p(840,450), cc.p(140,450),2,cc.color(255,0,0));
    redLine.visible = false;
    game.addChild(redLine);
}
//створюємо рамку
function createBorder(game) {
    let borderOne = new cc.DrawNode();
    borderOne.drawSegment(cc.p(140,675), cc.p(140,225),4,cc.color(128,128,128));
    borderOne.drawSegment(cc.p(140,225), cc.p(840,225),4,cc.color(128,128,128));
    borderOne.drawSegment(cc.p(840,225), cc.p(840,675),4,cc.color(128,128,128));
    borderOne.drawSegment(cc.p(840,675), cc.p(140,675),4,cc.color(128,128,128));

    borderOne.drawSegment(cc.p(373,675), cc.p(373,225),2,cc.color(128,128,128));
    borderOne.drawSegment(cc.p(606,675), cc.p(606,225),2,cc.color(128,128,128));

    borderOne.drawSegment(cc.p(840,525), cc.p(140,525),2,cc.color(128,128,128));
    borderOne.drawSegment(cc.p(840,375), cc.p(140,375),2,cc.color(128,128,128));
    game.addChild(borderOne);
}


//рухаємо колонку
function moveColumn(column, iconsToMove, completeCB) {
    iconsToMove--; //кількість іконок що будуть крутитись
    const time = 0.05; //час за який будуть крутитись
        for (let i = 0; i < 4; i++) {
            column[i].y = 158 * i;
            column[i].runAction(
                cc.sequence([ //масив екшенів (черга виконання)
                    cc.moveBy(time, 0, -158),
                    cc.callFunc(()=> {
                        if (!i) {
                            column.push(column.shift()); //переносимо першу іконку в кінець масиву
                            if (iconsToMove > 0) { //якщо іконки не закінчились
                                setTimeout(moveColumn,0,column, iconsToMove, completeCB); //рухаємо іконки
                            } else {
                                if (completeCB) {
                                    completeCB(); //викликаємо колбек
                                }
                            }
                        }
                    })
                ]),
            );

        }
}


//----------------------game----------------------//

cc.game.onStart = function() {
    cc.LoaderScene.preload( Game.g_resources, function () {
        cc.spriteFrameCache.addSpriteFrames(Game.res.sprites_plist, null);
        cc.director.runScene(new Game.scenes[1].extend());
    }, this);
};

window.onload = function(){
    cc.game.run("gameCanvas");
}