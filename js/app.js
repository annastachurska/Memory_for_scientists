document.addEventListener("DOMContentLoaded", function(){
    class MemoryGame {
        constructor(){
            this.hasFlippedCard = false;
            this.isBoardLocked = false;
            this.cards = document.querySelectorAll('.game_item');
        }

        shuffle(){
            this.cards.forEach(card => {
                let random = Math.floor(Math.random()*12);
                card.style.order = random;
            });
        }

        start(){
            this.shuffle();
            let self = this;
            this.cards.forEach(card => card.addEventListener('click', e => {
                self.flipCard(card);
            }));
        }

        flipCard(e){
            if (this.isBoardLocked) return;
            if (e == self.firstCard) return;
            e.classList.add('flip');
            if (!this.hasFlippedCard) {
                this.hasFlippedCard = true;
                this.firstCard = e;
                return;
            }
            this.hasFlippedCard = false;
            this.secondCard = e;
            this.checkMatch();
        }

        checkMatch(){
            let isMatched = this.firstCard.dataset.name === this.secondCard.dataset.name;
            isMatched ? this.disabledMatchedCards() : this.unflipCards();
        }

        disabledMatchedCards(){
            let self = this;
            this.firstCard.removeEventListener('click', e => {
                self.flipCard(card);
            });
            this.secondCard.removeEventListener('click', e => {
                self.flipCard(card);
            });
        }

        unflipCards(){
            this.isBoardLocked = true;
            let self = this;
            setTimeout(() => {
                self.firstCard.classList.remove('flip');
                self.secondCard.classList.remove('flip');
                self.resetBoard();
            }, 1500);
        }

        resetBoard(){
            [this.hasFlippedCard, this.isBoardLocked] = [false, false];
            [this.firstCard, this.secondCard] = [null, null];
        }


    }

    let game = new MemoryGame();
    game.start();

});




