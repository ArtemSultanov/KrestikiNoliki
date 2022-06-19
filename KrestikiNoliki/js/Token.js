/**
* У каждого игрока будет набор знаков
  * Свойства каждого знаков во многом зависят от игрока, которому он принадлежит
 */

class Token {
    constructor(owner, index) {
        this.owner = owner;
        this.id = `token-${index}-${owner.id}`; //поможет нам сослаться на HTML-представление, если объект
        this.played = false;
    }

    get tokenPath(){
        let tokenPath = "";
        if (this.owner.id === "player1") {
            tokenPath = 'img/o.svg';
        } else {
            tokenPath = 'img/x.svg';
        }
        return tokenPath;
    }

    /**
     * Получить путь к токену и сохранить ссылку на идентификатор объекта
     * player1 получает O SVG
     * player2 получает X SVG
     */
    renderHTMLToken(){
        let tokenPath = "";
        if (this.owner.id === "player1") {
            tokenPath = '../img/o.svg';
        } else {
            tokenPath = '../img/x.svg';
        }
        const tokenId = this.id;
        return [tokenPath, tokenId];
    }

    /**
    * Используйте идентификатор объекта Token, чтобы получить представление DOM.
    */
    get htmlToken(){
        return document.getElementById(this.id);
    }

}