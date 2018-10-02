document.addEventListener("DOMContentLoaded", function(){
    class MemoryGame {
        constructor(){
            this.isCardFlipped = false;
            this.isBoardLocked = false;
            this.items = null;
            this.dataTable = {
                transcriptionFactors: [
                    ['hif', 'HIF', 'Response to diminished oxygen availability'],
                    ['nrf2', 'Nrf2', 'Response to elevated level of reactive oxygen species'],
                    ['nfkb', 'NFkappaB', 'Regulation of immune response'],
                    ['smad', 'SMAD', 'Response triggered by TGFbeta'],
                    ['tfIIe', 'TFIIE', "Eukariotes' transcription"],
                    ['p53', 'p53', 'Stability of genome (repair vs apoptosis)'],
                    ['srebp', 'SREBP', 'Control for fatty acid biosynthesis'],
                    ['stat', 'STAT', 'Response to growth factors and cytokines'],
                    ['creb', 'CREB', 'Development of nervous system, plasticity of neurons']
                ],
                techniques: [
                    ['fret', 'FRET', 'Interaction between proteins'],
                    ['krystalografia', 'Crystallography', 'Structure of protein'],
                    ['elisa', 'ELISA', 'Amount of selected protein'],
                    ['bca', 'BCA assay', 'Concentration of all proteins in sample'],
                    ['immunocytochemia', 'Immunocytochemical staining', 'Localization of protein in cell'],
                    ['realtimepcr', 'Real-time PCR', 'Gene expression on mRNA level'],
                    ['emsa', 'EMSA', 'DNA binding of transcription factor'],
                    ['southers', 'Southern blot', 'Identification of DNA fragments'],
                    ['kometki', 'Comet assay', 'DNA fragmentation']
                ],
                enzymes: [
                    ['helikaza', 'Helikase', 'Unfolds double helix'],
                    ['prymaza', 'Primase', 'RNA polimerase'],
                    ['gyraza', 'Gyrase', 'Incorporates superhelixes'],
                    ['gyraza', 'Gyrase', 'Unfolds circular DNA after replication'],
                    ['polimerazaI', 'Polimerase I (Kornberga)', 'Main repair polimerase'],
                    ['polimerazaI', 'Polimerase I (Kornberga)', "With 3'-5' exonuclease activity"],
                    ['polimerazaI', 'Polimerase I (Kornberga)', "With 5'-3' exonuklease activity"],
                    ['polimerazaI', 'Polimerase I (Kornberga)', 'DNA polimerase'],
                    ['bialkossb', 'SSB protein', 'Prevents forming of helix after separation of DNA strands']
                ]
            };
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
            this.setButton();
        }

        flipCard(e){
            if (this.isBoardLocked) return;
            if (e == this.firstCard) return;
            e.classList.add('flip');
            if (!this.isCardFlipped) {
                this.isCardFlipped = true;
                this.firstCard = e;
                return;
            }
            this.isCardFlipped = false;
            this.secondCard = e;
            this.isBoardLocked = true;
            this.handleEventAfterSecondCard();
        }

        handleEventAfterSecondCard() {
            document.querySelector('.game_button').disabled = false;
            let self = this;
            this.id = setTimeout(() => {
                self.unflipCards();
                document.querySelector('.game_button').disabled = true;
            }, 4000);
        }

        setButton(){
            let self = this;
            document.querySelector('.game_button').addEventListener('click', () => {
                self.handleCheckButton();
            });
        }

        handleCheckButton(){
            this.checkMatch();
            this.counter++;
            document.querySelector('.game_score').innerText = `Ilość rund: ${this.counter}`;
            clearTimeout(this.id);
            document.querySelector('.game_button').disabled = true;
        }

        checkMatch(){
            let isMatched = ((this.firstCard.dataset.name === this.secondCard.dataset.name) && (this.firstCard.dataset.des !== this.secondCard.dataset.des));
            isMatched ? this.disabledMatchedCards() : this.unflipCards();
        }

        disabledMatchedCards(){
            let self = this;
            this.firstCard.removeEventListener('click', e => {
                self.flipCard(e.target);
            });
            this.secondCard.removeEventListener('click', e => {
                self.flipCard(e.target);
            });

            if (document.querySelectorAll('.flip').length == this.items.length*2) {
                this.finishGame();
            }
            this.resetBoard();
        }

        unflipCards(){
            this.isBoardLocked = true;
            this.firstCard.classList.remove('flip');
            this.secondCard.classList.remove('flip');
            this.resetBoard();
        }

        resetBoard(){
            [this.isCardFlipped, this.isBoardLocked] = [false, false];
            [this.firstCard, this.secondCard] = [null, null];
        }

        chooseGameType(){
            this.selection = document.querySelector('.introduction_select').value;
            if (this.selection === 'Czynniki transkrypcyjne') {
                this.items = this.dataTable.transcriptionFactors;
            } else if (this.selection === 'Techniki labolatoryjne'){
                this.items = this.dataTable.techniques;
            } else {
                this.items = this.dataTable.enzymes;
            }
        }

        finishGame(){
            setTimeout(()=>{
                document.querySelector('.finalSection').style.display = 'block';
                document.querySelector('.game').style.opacity = '0.6';
                document.querySelector('.finalScore').innerText = this.counter;
            },2000)
        }
    }

    document.querySelector('.introduction_button').addEventListener('click', (e) => {
        document.querySelector('.introduction').style.display = 'none';
        document.querySelector('.game').style.opacity = '1';
        document.querySelector('.game_buttonContainer').style.display = 'flex';
        let game = new MemoryGame();
        game.start();
    });

});




