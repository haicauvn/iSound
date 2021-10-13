/**
 * 1. Render songs
 * 2. Scroll top
 * 3. Play / pause / seek
 * 4. CD rotated
 * 5. Next / previous
 * 6. Random number
 * 7. Next / Repeat when ended
 * 8. Active song
 * 9. Scroll active song into view
 * 10. Play song when click
 */

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const playBtn = $('.btn-toggle-play');
const player = $('.player');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const playlist = $('.playlist');
const audio = $('#audio');
const cd = $('.cd');
const progress = $('.progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
    currentIndex : 0,
    isPlaying : false,
    isRandom : false,
    isRepeat : false,
    songs : [
        {
            name: 'tokyo',
            singer: 'RM',
            path: './assets/music/tokyo.mp3',
            image: './assets/img/momo.jpg'
        },
        {
            name: 'seoul',
            singer: 'RM',
            path: './assets/music/seoul.mp3',
            image: './assets/img/momo.jpg'
        },
        {
            name: 'moonchild',
            singer: 'RM',
            path: './assets/music/moonchild.mp3',
            image: './assets/img/momo.jpg'
        },
        {
            name: 'badbye',
            singer: 'RM',
            path: './assets/music/badbye.mp3',
            image: './assets/img/momo.jpg'
        },
        {
            name: 'uhgood',
            singer: 'RM',
            path: './assets/music/uhgood.mp3',
            image: './assets/img/momo.jpg'
        },
        {
            name: 'everything goes',
            singer: 'RM',
            path: './assets/music/everythinggoes.mp3',
            image: './assets/img/momo.jpg'
        },
        {
            name: 'forever rain',
            singer: 'RM',
            path: './assets/music/foreverrain.mp3',
            image: './assets/img/momo.jpg'
            
        }
    ],
    defineProperties : function() {
        Object.defineProperty(this, 'currentSong', {
            get : function() {
                return this.songs[this.currentIndex];
            }
        })
    },
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' : ''} " data-index='${index}'>
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>`
        })
        playlist.innerHTML = htmls.join('');
    },
    handleEvents: function() {
        const _this = this;
        // Cd rotate
        const cdThumbAnimate = cdThumb.animate([{transform: 'rotate(360deg)'}]
        , {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // Handle scroll top
        var cdWidth = cd.offsetWidth;
        document.onscroll = function() {
            const scrollTop = window.scrollY;
            const newCdWidth = cdWidth - scrollTop;
            cd.style.width = newCdWidth > 0 ? newCdWidth  + 'px': 0;
        }

        // Handle click play
        playBtn.onclick = function() {
            if (_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
        }

        // Listener play
        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }
        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        audio.onended = function() {
            if(!_this.isRepeat) {
                _this.nextSong();
            }
            audio.play();
        }

        // Listener Click to item playlist button
        playlist.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)');
            if(e.target.closest('.song:not(.active)')) {
                if(e.target.closest('.option')) {
                    // Todo: option on song
                } else {
                    _this.currentIndex = Number(songNode.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
            }
        }

        // Progress song
        audio.ontimeupdate = function () {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }

        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }

        // Next song
        nextBtn.onclick = function() {
            _this.nextSong();
            audio.play();
        }

        // Prev song
        prevBtn.onclick = function() {
            _this.prevSong();
            audio.play();
        }

        // Random song
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);
        }

        // Repeat song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }
    },
    scrollToActiveSong: function() {
        $('.song.active').scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
        });
    },

    loadCurrentSong : function() {
        heading.textContent = this.currentSong.name;
        cdThumb.url = this.currentSong.image;
        audio.src = this.currentSong.path;
    },

    nextSong : function() {
        if(this.isRandom) {
            this.playRandomSong();
        } else {
            this.currentIndex++;
            if(this.currentIndex >= this.songs.length) {
                this.currentIndex = 0;
            }
            this.loadCurrentSong();
        }
        this.render();
        this.scrollToActiveSong();
    },

    prevSong : function() {
        this.currentIndex--;
        if(this.currentIndex <= 0) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    playRandomSong : function() {
        let newIndex;
        do{
            newIndex = Math.floor(Math.random() * this.songs.length);
        } while(newIndex === this.currentIndex);
        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },
    start: function() {
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();
    }
}

app.start();