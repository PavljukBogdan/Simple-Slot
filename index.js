//----------------------variables----------------------//
var test;
Game = {}; //Об'єкт який фактично є грою
Game.scenes = []; //ігрові сцени
Game.scenes[1] = {}; //ініціалізація першої ігрової сцени
Game.layers = []; //масив шарів
Game.layers[1] = {} //ініціалізвція першого шару
//----------------------resources----------------------//
Game.res = {
    HelloWorld_png : "HelloWorld.png", //тестова картинка
    icons : "icons.png", //текстура з іконками
    sprites_plist: "icons.plist" //пліст для іконок
};

Game.g_resources = []; //масив ресурсів гри
Game.firstColumn = []; //перший стовбчик
Game.secondColumn = []; //другий стовпчик
Game.thirdColumn = []; //третій стовчик

Game.player = {}; //ігрові об'єкти
Game.player.addSprite = {}; //додані спрайти
Game.player.addAnimation = {}; // додані анімації
Game.player.runAnimation = {}; //запущені анімації
 //глобальні об'єкти - міняються в залежності від стану гри
let text; //текст виграшу
let inGame = false; //статус гри
let button; //кнопка виграшу
let redLine; //червона лінія


//інформація спрайтів
let infoSprite = {  //назви спрайтів для формування їх з пліста
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



//завантажуємо ресурси в загальний масив
for (const i in Game.res ) {
    Game.g_resources.push( Game.res[i] );
}
//----------------------scenes----------------------//
//створюємо першу сцену
Game.scenes[1].extend = cc.Scene.extend({
    onEnter:function () {
        this._super();
        const layer = new Game.layers[1].extend();
        //ініціалізовуємо перший шар
        layer.init();
        //додаємо на сцену перший шар
        this.addChild( layer );
    }
});



//----------------------layers----------------------//
//створюємо перший шар наслідуючи його від кокоса
Game.layers[1].extend = cc.LayerColor.extend({
    init: function () {
        this._super();
        //створюємо білий колір
        this.setColor(cc.color(255,255,255));
        //зманна game належить до контексту layers
        let game = this;
        Game.layers[1].start( game ); //запускаємо шар
    }
});
//колбек після зупинки спінів
function onIconsStop() {
    //перевірка на виграш
    //перевірка чи співпали всі три іконки
    if (Game.firstColumn[1].getName() === Game.secondColumn[1].getName() &&
        Game.secondColumn[1].getName() === Game.thirdColumn[1].getName()) {
        text.setString("Result: WIN"); //якщо співпали, то присвоюємо тексту виграш
        redLine.visible = true; //виводимо червону лінію на екран
    } else {
        text.setString("Result: Not win"); //якщо ні присвоюємо не виграш
    }
    //міняємо стани кнопки та гри
    inGame = false; //зміна статусу гри
    button.setEnabled(true);    //зміна статусу кнопки
    button.setBright(true);
}

//перший шар
//опис функції старту шару
Game.layers[1].start = function( game ) {
    //маска
    //координати маски
    let rect = [];
    rect[0] = cc.p(0, 0);
    rect[1] = cc.p(700, 0);
    rect[2] = cc.p(700, 450);
    rect[3] = cc.p(0, 450);
    //створюємо нову ноду
    let node = cc.Node.create();
    //створюємо маску
    let mask = new cc.DrawNode();
    //створюємо колір
    let red = cc.color.RED;
    mask.clear();
    //малюємо багатокутник
    mask.drawPoly(rect, 4, red, 0, red);

    //створюємо тіло для вирізання прямокутника в масці
    let maskedFill = new cc.ClippingNode(mask);
    //додаємо ноду на виріз маски
    maskedFill.addChild(node);
    //задаємо положення
    maskedFill.setPosition(150, 225);
    //додаємо маску
    game.addChild(maskedFill);

    createPlayField(); //створюємо ігрове поле
    addGameSprites(node); //додаємо колонки на поле
    createButton(game); //додаємо кнопки
    createText(game); //створюємо текст
    createBorder(game); //створюємо рамку
    createLine(game); //ліня "виграшу)

};

//додаємо колонки на поле
function addGameSprites(game) {
    const x = 250; //зміщення по х
    const y = 158; //зміщення по у
    for (let i = 0; i < Game.firstColumn.length; i++) { //додаємо страйти на поли
        addGameSprite(game,Game.firstColumn[i],0,y * (i));
        addGameSprite(game,Game.secondColumn[i],x,y * (i));
        addGameSprite(game,Game.thirdColumn[i],x * 2,y * (i ));

    }
    //додаємо спрайт на поле (виконуємо позиціонування)
    function addGameSprite(game, sprite, x, y) {
        sprite.setPosition(x,y); //задаємо позицію
        sprite.anchorY = 0; //старт координат по у
        sprite.anchorX = 0; //старт координат по х
        sprite.setScale(0.8); //задаємо масштаб спрайта
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
    //створюємо лінію з рандомних спрайтів
    for (let i = 0; i < ICONS_IN_LINE; i++) {
        const index = Math.floor(Math.random() * ICONS.length);
        column.push(createSprite(ICONS[index], index));
    }
}
//створюємо текст
function createText(game) {

    text = new ccui.Text(); //створюємо текст
    text.setColor("Black"); //сетим колір
    text.setFontSize(30); //сетим розмір
    text.setString("Result:"); //просфоюємо по дефолту
    text.x = 300; //присвоюємо координати
    text.y = 100;

    game.addChild(text); //додаємо на сцену
}
//створюємо кнопку
function createButton(game) {
    button= new ccui.Button(); //створюємо кнопку
    button.loadTextures("Button_Normal.png", "Button_Disable.png","Button_Disable.png"); //завантажуємо різні текстури для різних станів кнопки
    button.x = 700; //присвоюємо координати
    button.y = 100;
    button.setTitleColor("Red"); //
    button.setTitleText("SPIN"); //назва кнопки
    button.setTitleFontSize(30); //розмір напису
    button.addTouchEventListener(this.touchEvent, this); //навішуємо подію

    game.addChild(button); //додаємо кнопку
}
//обробка натискання кнопки
function touchEvent(sender, type) {

    switch (type) {
        case ccui.Widget.TOUCH_BEGAN: //при натисканні
            if (inGame === false) { //міняємо стан гри
                inGame = true;
            } else {
                break;
            }
            if (inGame) { //якщо ми в грі
                redLine.visible = false; //статус лінії
                button.setEnabled(false); //статус кнопки
                button.setBright(false);
                setTimeout(moveColumn, 0, Game.firstColumn, 20); //рухаємо колонки
                setTimeout(moveColumn, 0, Game.secondColumn, 23);
                setTimeout(moveColumn, 0, Game.thirdColumn, 26, onIconsStop); // + викликаємо колбек
                text.setString("Result:"); //оновлюємо дефолтний напис
            }
            break;
    }
}
//створюємо спрайт
function createSprite(gSprite, index) {
    let nodeSprite = new cc.Node(); //створюємо ноду
    nodeSprite.setName(index.toString()); //сетимо ямя ноді
    let sprite = cc.Sprite.createWithTexture(cc.spriteFrameCache.getSpriteFrame(gSprite)); //створюємо спрайт із текстури
    sprite.setAnchorPoint(0,0); //стартова точка
    nodeSprite.addChild(sprite); //додаємо в ноду створений спрайт
    return nodeSprite; //повертаємо ноду

}
//створюємо червону лінію
function createLine(game) {
    redLine = new cc.DrawNode(); //створюємо лінію
    redLine.drawSegment(cc.p(840,450), cc.p(140,450),2,cc.color(255,0,0)); //малюємо по координатах та червоним кольором
    redLine.visible = false; //робимо лінію невидимою
    game.addChild(redLine); //додаємо на сцену
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