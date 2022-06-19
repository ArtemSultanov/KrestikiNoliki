/**
* Объекты игрока будут иметь связанный значок и места, которые занимает игрок
 */

class Player {
    constructor(name, id, color, active = false){
        this.name = name;
        this.id = id;
        this.color = color;
        this.active = active;
        this.tokens = this.createTokens(5); //метод, создающий токены, принадлежащие игроку
    }

    /**
    * Определить, какие жетоны еще не разыграны
    * @return {array} unusedTokens - массив токенов, у которых "игранное" значение равно false;
     */
    get unusedTokens(){
        const unusedTokens = this.tokens.filter(token => !token.played);
        return unusedTokens;
    }

    /**
     * Вытащите один из неиспользованных знаков игрока, чтобы использовать его в качестве следующего активного знака.
     * @return {object} token - первый знак в массиве unusedTokens
     */
    get activeToken(){
        return this.unusedTokens[0];
    }

    /**
    * Каждый игрок получит 5 ходов
      * @param {integer} numOfTokens - количество создаваемых знаков
       * @return {array} tokens - массив объектов знаков
     */
    createTokens(numOfTokens){
        const tokens = [];
        for (let i = 0; i < numOfTokens; i++) {
            const token = new Token(this, i);
            tokens.push(token);
        }
        return tokens;
    }
}

/**
 * Игроки в игре имеют возможность играть против компьютера.
 * Класс «Computer» расширяет класс «Player».
 */

class Computer extends Player {
  constructor(...props){
    super(...props)
  }

  /**
  * Случайным образом выбирает место на доске на основе оставшихся свободных мест.
  * Затем на случайно выбранный элемент DOM принудительно накладывается событие щелчка.
  */
  makeMove(){
    const boardSpaces = document.querySelectorAll('ul.boxes')[0].children;
    const availalbeSpaces = []
    for (let i = 0; i < boardSpaces.length; i++){
      if (!boardSpaces[i].classList.contains('box-filled-1') &&
          !boardSpaces[i].classList.contains('box-filled-2')) {
        availalbeSpaces.push(boardSpaces[i])
      }
    }
    const randNum = Math.floor(Math.random() * availalbeSpaces.length)
    const selectedSpace = availalbeSpaces[randNum]
    selectedSpace.click()
  }

}