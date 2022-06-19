/*
 Доска состоит из отдельных пространств, где каждое пространство представляет элемент объектнаой модели документа.
 */
class Board {
    constructor(){
        this.rows = 3;
        this.cols = 3;
        this.spaces = this.createSpaces();
    }

    /*
     Создаем объекты для представления пространства на доске
     */
    createSpaces(){
        const spaces = [];
        for (let x = 0; x < this.cols; x++) {
            const col = [];
            for (let y = 0; y < this.rows; y++) {
                const space = new Space(x, y);
                col.push(space);
            }
            spaces.push(col);
        }
        return spaces;
    }

    /*
     * Визуализируем игровое поле, используя массив объектов space.
     */
    renderHTMLBoard(){
        for (let column of this.spaces) {
            for (let space of column) {
                space.renderHTMLSpace();
            }
        }
    }

    /*
     * Получим индивидуальный объект space
     */
    findSpace(spaceId){
        let targetSpace;
        for (let column of this.spaces) {
            for (let space of column) {
                if (space.id == spaceId) {
                    targetSpace = space;
                }
            }
        }
        return targetSpace;
    }
}