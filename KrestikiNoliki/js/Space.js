/**
* Пространственный объект представляет собой пространство на игровом поле.
  * Пробел будет содержать ссылку на токен, который его занимает
 */

class Space {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.id = `space-${x}-${y}`;
        this.token = null;
    }

    /**
     * Получите пространство DOM, чтобы прикрепить к нему прослушиватель событий
     */
    get htmlSpace(){
        return document.getElementById(this.id);
    }

    /**
     * Проверяет, владеет ли игрок этим пространством, и возвращает владельца
     * @возврат {нуль || object} null, если с пространством не связан токен, иначе вернуть объект-владелец
     */
    get owner(){
        if (this.token === null) {
            return null
        } else {
            return this.token.owner.name;
        }
    }

    /**
    * Создать HTML-представление объекта
     */
    renderHTMLSpace(){
        const space = document.createElement('li');
        space.setAttribute("class", "box");
        space.setAttribute("id", this.id);
        document.querySelector("ul.boxes").appendChild(space);
    }

    /**
   * Отметить пространственный объект как занятый
   * @param {object} token - токен, который был сброшен в этом пространстве
     */
    mark(token){
        this.token = token;
    }

}