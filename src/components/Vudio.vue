<template>
  <div>

    <div class="heading">
      <h1>VueJS Audio Player V2</h1>
      <p>(photos from <a href="https://unsplash.com/">unsplash</a>
        &amp; audios from <a href="https://soundbible.com/">soundbible</a>)</p>
    </div>

    <div class="audioContainer">
      <a class="nav-icon" v-on:click="isPlaylistActive=!isPlaylistActive"
         :class="{'isActive': isPlaylistActive}" title="Music List">
        <span></span>
        <span></span>
        <span></span>
      </a>
      <div class="audioPlayerList" :class="{'isActive': isPlaylistActive}">
        <div class="item"
             v-for="(item,index) in musicPlaylist"
             v-bind:class="{ 'isActive':isCurrentSong(index) }"
             v-on:click="changeSong(index),isPlaylistActive=!isPlaylistActive"
             :key="index"
        >
          <p class="title">{{ item.title }}</p>
          <p class="artist">{{ item.artist }}</p>
        </div>

      </div>
      <div class="audioPlayerUI" :class="{'isDisabled': isPlaylistActive}">
        <div class="albumImage">
          <transition name="ballmove" enter-active-class="animated zoomIn"
                      leave-active-class="animated fadeOutDown" mode="out-in">
            <!--<transition name="slide-fade" mode="out-in">-->
            <img @load="onImageLoaded()" :src="musicPlaylist[currentSong].image"
                 :key="currentSong" ondragstart="return false;"
                 id="playerAlbumArt">
          </transition>
          <div class="loader" :key="currentSong">Loading...</div>
        </div>
        <div class="albumDetails">
          <transition name="slide-fade" mode="out-in">
            <p class="title" :key="currentSong">{{ musicPlaylist[currentSong].title }}</p>
          </transition>
          <transition name="slide-fade" mode="out-in">
            <p class="artist" :key="currentSong">{{ musicPlaylist[currentSong].artist }}</p>
          </transition>
        </div>

        <div class="playerButtons">
          <a class="button" :class="{'isDisabled':(currentSong==0)}" v-on:click="prevSong()"
             title="Previous Song"><i class="zmdi zmdi-skip-previous"></i></a>
          <a class="button play" v-on:click="playAudio()" title="Play/Pause Song">
            <transition name="slide-fade" mode="out-in">
              <i class="zmdi" :class="[currentlyStopped ? 'zmdi-stop' : (currentlyPlaying ?
              'zmdi-pause-circle' : 'zmdi-play-circle')]"
                 :key="1"></i>
            </transition>
          </a>
          <a class="button" :class="{'isDisabled':(currentSong==musicPlaylist.length-1)}"
             v-on:click="nextSong()" title="Next Song"><i
            class="zmdi zmdi-skip-next"></i></a>
        </div>

        <div class="currentTimeContainer" style="text-align:center">
          <span class="currentTime">{{ currentTime | fancyTimeFormat }}</span>
          <span class="totalTime"> {{ trackDuration | fancyTimeFormat }}</span>
          <!--<span style="color:black">({{ currentSong+1 }}/{{ musicPlaylist.length }})</span>-->
        </div>

        <div class="currentProgressBar">
          <div class="currentProgress" :style="{ width: currentProgressBar + '%' }"></div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>
export default {
  name: 'Vudio',
  data() {
    return {
      audio: '',
      imgLoaded: false,
      currentlyPlaying: false,
      currentlyStopped: false,
      currentTime: 0,
      checkingCurrentPositionInTrack: '',
      trackDuration: 0,
      currentProgressBar: 0,
      isPlaylistActive: false,
      currentSong: 0,
      debug: false,
      musicPlaylist: [
        {
          title: 'Service Bell',
          artist: 'Daniel Simion',
          url: 'https://soundbible.com/mp3/service-bell_daniel_simion.mp3',
          image: 'https://source.unsplash.com/crs2vlkSe98',
        },
        {
          title: 'Meadowlark',
          artist: 'Daniel Simion',
          url: 'https://soundbible.com/mp3/meadowlark_daniel-simion.mp3',
          image: 'https://source.unsplash.com/35bE_njbG9E',
        },
        {
          title: 'Hyena Laughing',
          artist: 'Daniel Simion',
          url: 'https://soundbible.com/mp3/hyena-laugh_daniel-simion.mp3',
          image: 'https://source.unsplash.com/4_N5a-_5K4o',
        },
        {
          title: 'Creepy Background',
          artist: 'Daniel Simion',
          url: 'http://soundbible.com/mp3/creepy-background-daniel_simon.mp3',
          image: 'https://source.unsplash.com/j0g8taxHZa0',
        },
      ],
      audioFile: '',
    };
  },
  mounted() {
    this.changeSong();
    this.audio.loop = false;
  },
  filters: {
    fancyTimeFormat(s) {
      return (s - (s % 60)) / 60 + (s > 9 ? ':' : ':0') + s;
    },
  },
  methods: {
    togglePlaylist() {
      this.isPlaylistActive = !this.isPlaylistActive;
    },
    nextSong() {
      if (this.currentSong < this.musicPlaylist.length - 1) this.changeSong(this.currentSong + 1);
    },
    prevSong() {
      if (this.currentSong > 0) this.changeSong(this.currentSong - 1);
    },
    changeSong(index) {
      const wasPlaying = this.currentlyPlaying;
      this.imageLoaded = false;
      if (index !== undefined) {
        this.stopAudio();
        this.currentSong = index;
      }
      this.audioFile = this.musicPlaylist[this.currentSong].url;
      this.audio = new Audio(this.audioFile);
      const localThis = this;
      this.audio.addEventListener('loadedmetadata', () => {
        localThis.trackDuration = Math.round(this.duration);
      });
      this.audio.addEventListener('ended', this.handleEnded);
      if (wasPlaying) {
        this.playAudio();
      }
    },
    isCurrentSong(index) {
      if (this.currentSong === index) {
        return true;
      }
      return false;
    },
    getCurrentSong(currentSong) {
      return this.musicPlaylist[currentSong].url;
    },
    playAudio() {
      if (
        this.currentlyStopped === true
        && this.currentSong + 1 === this.musicPlaylist.length
      ) {
        this.currentSong = 0;
        this.changeSong();
      }
      if (!this.currentlyPlaying) {
        this.getCurrentTimeEverySecond(true);
        this.currentlyPlaying = true;
        this.audio.play();
      } else {
        this.stopAudio();
      }
      this.currentlyStopped = false;
    },
    stopAudio() {
      this.audio.pause();
      this.currentlyPlaying = false;
      this.pausedMusic();
    },
    handleEnded() {
      if (this.currentSong + 1 === this.musicPlaylist.length) {
        this.stopAudio();
        this.currentlyPlaying = false;
        this.currentlyStopped = true;
      } else {
        this.currentlyPlaying = false;
        this.currentSong = this.currentSong + 1;
        this.changeSong();
        this.playAudio();
      }
    },
    onImageLoaded() {
      this.imgLoaded = true;
    },
    getCurrentTimeEverySecond() {
      const localThis = this;
      this.checkingCurrentPositionInTrack = setTimeout(
        () => {
          localThis.currentTime = localThis.audio.currentTime;
          localThis.currentProgressBar = localThis.audio.currentTime / localThis.trackDuration
            * 100;
          localThis.getCurrentTimeEverySecond(true);
        },
        1000,
      );
    },
    pausedMusic() {
      clearTimeout(this.checkingCurrentPositionInTrack);
    },
  },
  watch: {
    currentTime() {
      this.currentTime = Math.round(this.currentTime);
    },
  },
  beforeDestroy() {
    this.audio.removeEventListener('ended', this.handleEnded);
    this.audio.removeEventListener('loadedmetadata', this.handleEnded);

    clearTimeout(this.checkingCurrentPositionInTrack);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
</style>
