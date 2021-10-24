function getInvisibleSprite(x, y, width, fieldHeight){
    var graphics = new PIXI.Graphics();
    graphics.beginFill(0xFFFF00);
    graphics.lineStyle(5, 0xFF0000);
    graphics.drawRect(0, 0, width, fieldHeight);

    graphics.x = x;
    graphics.y = y
    graphics.width = width;
    graphics.height = fieldHeight;
    graphics.alpha = 0;
    graphics.interactive = true;
    return graphics;
}