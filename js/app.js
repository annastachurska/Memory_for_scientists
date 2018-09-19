document.addEventListener("DOMContentLoaded", function(){
    class MemoryGame {
        constructor(){
            this.hasFlippedCard = false;
            this.isBoardLocked = false;
            this.items = null;
            this.enzymes = [
                ['helikaza', 'Helikaza', 'Rozplata podwójną helisę'],
                ['prymaza', 'Prymaza', 'Jest polimerazą RNA'],
                ['gyraza', 'Gyraza', 'Wprowadza superskręty'],
                ['gyraza', 'Gyraza', 'Rozłącza koliste DNA po zakończeniu replikacji'],
                ['polimerazaI', 'Polimeraza I (Kornberga)', 'Jest główną polimerazą naprawczą'],
                ['polimerazaI', 'Polimeraza I (Kornberga)', "Ma aktywność 3'-5' egzonukleazy"],
                ['polimerazaI', 'Polimeraza I (Kornberga)', "Ma aktywność 5'-3' egzonukleazy"],
                ['polimerazaI', 'Polimeraza I (Kornberga)', 'Jest polimerazą DNA'],
                ['bialkossb', 'Białko SSB', 'Zapobiega tworzeniu helisy po rozdzieleniu nici DNA']
            ];
            this.transcriptionFactors = [
                ['hif', 'HIF', 'Odpowiedź na obniżony poziom tlenu'],
                ['nrf2', 'Nrf2', 'Odpowiedź na stres oksydacyjny'],
                ['nfkb', 'NFkappaB', 'Regulacja odpowiedzi immunologicznej'],
                ['smad', 'SMAD', 'Odpowiedź wywoływana przez TGFbeta'],
                ['tfIIe', 'TFIIE', 'Transkrypcja u eukariotów'],
                ['p53', 'p53', 'stabilność genomu (naprawa lub apoptoza)'],
                ['srebp', 'SREBP', 'kontrola biosyntezy tłuszczów'],
                ['stat', 'STAT', 'Odpowiedź na czynniki wzrostu i cytokiny'],
                ['creb', 'CREB', 'Rozwój systemu nerwowego, plastyczność neuronów']
            ];
            this.counter = 0;
        }

        createBoard() {
            const gameContainer = document.querySelector('.game_container');
            for (let i=0; i<this.items.length; i++) {
                let newArticleName = document.createElement('article');
                newArticleName.classList.add('game_item');
                newArticleName.setAttribute('data-name', this.items[i][0]);
                newArticleName.setAttribute('data-des', 'name');

                let newArticleNameFront = document.createElement('article');
                newArticleNameFront.classList.add('game_item_front');
                newArticleNameFront.innerText = this.items[i][1];
                newArticleName.appendChild(newArticleNameFront);

                let newImgFront = document.createElement('img');
                newImgFront.classList.add('game_item_back');
                newImgFront.setAttribute('src', './img/funny-green-bactera.png');
                newImgFront.setAttribute('alt', 'front_card');
                newArticleName.appendChild(newImgFront);

                gameContainer.appendChild(newArticleName);

                let newArticleDes = document.createElement('article');
                newArticleDes.classList.add('game_item');
                newArticleDes.setAttribute('data-name', this.items[i][0]);
                newArticleDes.setAttribute('data-des', 'description');

                let newArticleDesFront = document.createElement('article');
                newArticleDesFront.classList.add('game_item_front');
                newArticleDesFront.innerText = this.items[i][2];
                newArticleDes.appendChild(newArticleDesFront);

                let newImgDes = document.createElement('img');
                newImgDes.classList.add('game_item_back');
                newImgDes.setAttribute('src', './img/funny-green-bactera.png');
                newImgDes.setAttribute('alt', 'front_card');
                newArticleDes.appendChild(newImgDes);

                gameContainer.appendChild(newArticleDes);
            }

            this.cards = document.querySelectorAll('.game_item');
            this.cards.forEach(card => {
                let random = Math.floor(Math.random()*12);
                card.style.order = random;
            });

        }

        start(){
            this.chooseGameType();
            this.createBoard();
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
            this.counter++;

        }

        checkMatch(){
            let isMatched = ((this.firstCard.dataset.name === this.secondCard.dataset.name) && (this.firstCard.dataset.des !== this.secondCard.dataset.des));
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

            if (document.querySelectorAll('.flip').length == this.items.length*2) {
                this.finishGame();
            }
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

        chooseGameType(){
            this.selection = document.querySelector('.introduction_select').value;
            if (this.selection === 'Replikacja u E.coli') {
                this.items = this.enzymes;
            } else {
                this.items = this.transcriptionFactors;
            }
        }

        finishGame(){
            setTimeout(()=>{
                document.querySelector('.finalSection').style.display = 'block';
                document.querySelector('.game_container').style.opacity = '0.6';
                document.querySelector('.finalScore').innerText = this.counter;
            },2000)
        }
    }

    document.querySelector('.introduction_button').addEventListener('click', (e) => {
        document.querySelector('.introduction').style.display = 'none';
        document.querySelector('.game_container').style.opacity = '1';
        let game = new MemoryGame();
        game.start();
    });



});




