/**
 * Game Object поддерживает состояние игры и обрабатывает события DOM.
 */

class Game {
    constructor(vsComputer = false){
        this.vsComputer = vsComputer
        this.board = new Board();
        this.players = this.createPlayers();
        this.win = false;
        this.turns = 0;
        this._ready = false;
    }

    /**
     * Определить ход игрока
     * @return {object} activePlayer - игрок, у которого свойство active равно true
     */
    get activePlayer() {
        return this.players.find(player => player.active);
    }

    get ready(){
        return this._ready
    }

    set ready(val){
        this._ready = val
    }

     /**
     * Создайте двух игроков. Игрок 2 будет экземпляром «Компьютер», если «this.vsComputer»
     * установлено значение true. Также будет случайным образом выбирать, кто из игроков ходит первым.
     */
    createPlayers(){
        const player1Input = document.getElementById("player-1-name").value;
        const player1Name = player1Input.trim().length > 0 ? player1Input : "Player 1";
        const p1Active = Math.floor(Math.random() * 2) === 0;
        let player2;
        if (this.vsComputer){
            player2 = new Computer('Computer', 'player2', '#3688C3', !p1Active)
        } else {
            const player2Input = document.getElementById("player-2-name").value;
            const player2Name = player2Input.trim().length > 0 ? player2Input : "Player 2";
            player2 = new Player(player2Name, 'player2', '#3688C3', !p1Active)
        }
        return [
            new Player(player1Name, "player1", "#FFA000", p1Active),
            player2
        ];
    }

    /**
     * Настройте HTML для хода игроков и если активным игроком является компьютер
     * вызвать метод makeMove
     */
    playerTurn(){
        this.ready = true
        const unactivePlayer = this.players.find(player => !player.active);
        const activePlayer = this.activePlayer;
        document.getElementById(unactivePlayer.id).classList.remove('active');
        document.getElementById(activePlayer.id).classList.add('active');
        
        if (activePlayer.name === 'Computer'){
            activePlayer.makeMove()
        }
    }

    /**
     * Смена игроков после каждого клика
     */
    switchPlayers(){
        for (let player of this.players) {
            player.active = player.active === true ? false : true;
        }
    }

    /**
    * Печать результатов игры в DOM
    * Сообщение @param {string} - победитель игры или ничья
     */
    gameOver(message, result){
        const finish = document.getElementById('finish');
        const winnerTally = document.querySelector(`.${this.activePlayer.id}-wins span.win-num`)
        finish.classList.remove("screen-win-tie", "screen-win-one", "screen-win-two")
        let screenStyle; 
        document.getElementById('board').style.display = 'none';

        if (result === 'draw') {
            screenStyle = 'screen-win-tie';
            finish.style.backgroundColor = '#54D17A';
        } else {
            screenStyle = this.activePlayer.id == 'player1' ? 'screen-win-one' : 'screen-win-two';
            finish.style.backgroundColor = this.activePlayer.color;
            winnerTally.textContent = parseInt(winnerTally.textContent) + 1
        }
        
        finish.style.display = 'block';
        finish.classList.add(screenStyle);
        document.querySelector('p.message').textContent = message;
    }

    /**
     * Если прошло 9 ходов, а победитель не найден, результат ничейный
     * @return {boolean} — отрисовка будет истинной или ложной
     */
    checkForDraw(){
        let draw = false;
        if (!this.win && this.turns == 9) {
            draw = true;
        }
        return draw;
    }

    /**
   * Проверьте области по горизонтали, диагонали и вертикали
   * @param {object} target - последнее заполненное пространство объекта
   * @return {boolean} win - был ли найден победитель
     */
    checkForWinner(target){
        const owner = target.owner;
        let win = false;

        //проверка по вертикали
        for (let x = 0; x < this.board.cols - 2; x++) {
            for (let y = 0; y < this.board.rows; y++) {
                if (this.board.spaces[x][y].owner === owner && 
                    this.board.spaces[x + 1][y].owner === owner &&
                    this.board.spaces[x + 2][y].owner === owner ) {
                    win = true;
                    return win;
                }
            }
        }

        //проверка по горизонтали
        for (let x = 0; x < this.board.cols; x++) {
            for (let y = 0; y < this.board.rows - 2; y++) {
                if (this.board.spaces[x][y].owner === owner && 
                    this.board.spaces[x][y + 1].owner === owner &&
                    this.board.spaces[x][y + 2].owner === owner ) {
                    win = true;
                    return win;
                }
            }
        }

        //диагональ (вверху слева - внизу справа)
        if (this.board.spaces[0][0].owner === owner && 
            this.board.spaces[1][1].owner === owner &&
            this.board.spaces[2][2].owner === owner) {
                win = true;
                return win;
        }

        //диагональ (вверху справа - внизу слева)
        if (this.board.spaces[0][2].owner === owner && 
            this.board.spaces[1][1].owner === owner &&
            this.board.spaces[2][0].owner === owner) {
                win = true;
                return win;
        }

        return win;
    }

    /**
    * Обновите состояние игры и проверьте победителя
    * @param {object} token - токен, который был воспроизведен последним
    * @param {object} targetSpace - последнее занятое пространство
     */
    updateGameState(token, targetSpace){
        this.turns++;

        // отметим пространство и установим, что токен был сыгран
        targetSpace.mark(token);
        token.played = true;

        //проверяем на победу или ничью
        const gameIsOver = this.checkForWinner(targetSpace);
        const draw = this.checkForDraw();
        if (gameIsOver) {
            this.win = true;
            this.gameOver(`CONGRATULTAIONS! ${this.activePlayer.name} wins!`, 'win');
        } else if (draw) {
            this.gameOver('OMG 0_0    IT\'S A DRAW!', 'draw');
        } else {
            this.switchPlayers();
            this.playerTurn();
        }
    }

    /**
     * Переключать изображение знака игрока, когда он наводит курсор на область , только если состояние игры "готово"
     * @param {object} e - событие наведения мыши
     */
    handleMouseOver(e){
        if (this.ready) {
            if (e.target.classList.contains('box-filled-1') || e.target.classList.contains('box-filled-2')) {
                return;
            }
            if (!e.target.classList.contains('box')) {return;}
            e.target.style.backgroundImage = `url(${this.activePlayer.activeToken.tokenPath})`;
        }
    }

    /**
     * Удалять знак игрока, когда он выводит курсор мыши из пространства.
     * @param {object} e - событие mouseout
     */
    handleMouseOut(e){
        if (this.ready) {
            if (e.target.classList.contains('box-filled-1') || e.target.classList.contains('box-filled-2')) {
                return;
            }
            if (!e.target.classList.contains('box')) {return;}
            e.target.style.backgroundImage = "";
        }
    }

    /**
    * Займите место знаком SVG игрока
      * @param {object} e - событие клика
     */
    handleClick(e){
        if (this.ready) {
            if (e.target.classList.contains('box-filled-1') || e.target.classList.contains('box-filled-2')) { return; }
            if (!e.target.classList.contains('box')) { return; }

            //сделать состояние игры ложным, пока игра обновляется
            this.ready = false;

           //отмечаем целевое пространство DOM
            const fillClass = this.activePlayer.id == 'player1' ? 'box-filled-1' : 'box-filled-2';
            e.target.classList.add(fillClass);

            //обновляем состояние игры
            const spaceId = e.target.id;
            const token = this.activePlayer.activeToken;
            const targetSpace = this.board.findSpace(spaceId);
            this.updateGameState(token, targetSpace);
        }
    }

    /**
     * Инициализировать игру
     */
    startGame(){
        this.board.renderHTMLBoard();
        const p1NameCard = document.querySelector(".player1-name");
        const p2NameCard = document.querySelector(".player2-name");
        p1NameCard.textContent = this.players[0].name;
        p1NameCard.style.color = this.players[0].color;
        p2NameCard.textContent = this.players[1].name;
        p2NameCard.style.color = this.players[1].color;
        this.playerTurn();      
    }
}