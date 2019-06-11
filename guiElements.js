class BBText {
    constructor(tt, x, y, siz, description) {
        this.text = tt,
            this.x = x;
        this.y = y;
        this.tSize = siz;
        this.description = description;
        this.color = color(0, 0, 0);
    }
    draw() {
        fill(this.color);
        textSize(this.tSize);
        text(this.text, this.x, this.y);
    }
    crash(x, y) {
        return (x >= this.x &&
            y <= this.y &&
            x <= this.x + textWidth(this.text) &&
            y >= parseInt(this.y) - this.tSize);
    }
    drawTooltip(x, y) {
        if (!this.description) {
            return;
        }
        var tt = this.description;
        if (textWidth(tt) > 200) {
            textSize(15);
            var rat = ceil(textWidth(tt) / 200);
            var crNum = floor(tt.length / rat);
            var texts = [];
            for (var i = 0; i < rat; i++) {
                texts[i] = tt.slice(i * crNum, (i + 1) * crNum);
            }
            var wid = textWidth(texts.reduce((a, b) => {
                return textWidth(a) > textWidth(b) ? a : b;
            }));
            stroke(0);
            fill(255);
            rect(x + 20, y, wid + 7, 15 * rat + 7);
            noStroke();
            fill(0);
            for (var i = 0; i < rat; i++) {
                text(texts[i], x + 23, y + 2 + (i + 1) * 15);
            }
        } else {
            stroke(0);
            fill(255);
            textSize(15);
            rect(x, y - 20, textWidth(tt) + 4, 18);
            noStroke();
            fill(0);
            text(tt, x + 2, y - 4);
        }

    }
}