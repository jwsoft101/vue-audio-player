<template>
  <div id="app">
    <Vudio/>
  </div>
</template>

<script>
import Vudio from './components/Vudio.vue';

export default {
  name: 'app',
  components: {
    Vudio,
  },
};
</script>

<style lang="scss">
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
@import url("https://fonts.googleapis.com/css?family=Inconsolata:400,700");
@import url("https://fonts.googleapis.com/css?family=Raleway:400,400i,700");

$primary_color: rgba(0, 0, 0, 0.75);
$player_width: 20rem;
$player_padding: 1.5rem;

$button_size: 2rem;

$anim_duration: 0.5s;

* {
  box-sizing: border-box;
}
.animated {
  animation-duration: $anim_duration;
}
.audioContainer {
  position: relative;
  background-color: #eceff1;

  min-height: 25rem;
  width: $player_width;

  overflow: hidden;

  padding: $player_padding;
  margin: 0 auto;

  border-radius: 6px;
  box-shadow: 0 19px 38px rgba(0, 0, 0, 0.3), 0 15px 12px rgba(0, 0, 0, 0.22);

  user-select: none;

  .nav-icon {
    width: 15px;
    height: 12px;

    position: absolute;
    top: ($player_padding)-($player_padding/4);
    left: $player_padding;

    transform: rotate(0deg);
    transition: 0.25s ease-in-out;
    cursor: pointer;

    span {
      display: block;
      position: absolute;
      height: 2px;
      width: 100%;
      background: $primary_color;
      border-radius: 6px;
      opacity: 1;
      left: 0;
      transform: rotate(0deg);
      transition: 0.5s ease-in-out;
    }
    span:nth-child(1) {
      top: 0px;
    }

    span:nth-child(2) {
      top: 5px;
    }

    span:nth-child(3) {
      top: 10px;
    }

    &.isActive span:nth-child(1) {
      top: 5px;
      transform: rotate(135deg);
    }

    &.isActive span:nth-child(2) {
      opacity: 0;
      left: -60px;
    }

    &.isActive span:nth-child(3) {
      top: 5px;
      transform: rotate(-135deg);
    }
  }
  .audioPlayerList {
    color: $primary_color;
    width: ($player_width)-(2*$player_padding);
    transition: $anim_duration;
    transform: translateX(-200%);
    position: absolute;
    margin-top: $player_padding;
    overflow: auto;
    z-index: 10;
    will-change: transform;

    &.isActive {
      transform: translateX(0);
    }
    .item {
      margin-bottom: 1.5rem;
      border-left: 0.1rem solid transparent;
      transition: 0.2s;

      &:hover {
        padding-left: 0.5rem;
        cursor: pointer;
      }
      .title {
        color: rgba(0, 0, 0, 1);
        font-size: 1rem;
        margin-bottom: 0.75rem;
      }
      .artist {
        color: rgba(0, 0, 0, 0.5);
        font-size: 0.8rem;
      }
      &.isActive {
        border-left-color: black;
        padding-left: 1rem;
      }
    }
  }
  .audioPlayerUI {
    margin-top: $player_padding;
    will-change: transform, filter;
    transition: $anim_duration;
    &.isDisabled {
      transform: scale(0.75) translateX(100%);
      filter: blur(5px) grayscale(100%);
    }
    .albumDetails {
      text-align: center;
      margin: 2rem 0;

      p {
        margin: 0px;
        &.title {
          font-size: 1rem;
          color: rgba(0, 0, 0, 1);
        }
        &.artist {
          margin-top: 1rem;
          font-size: 0.75rem;
          font-weight: none;
          color: $primary_color;
          transition-delay: 100ms;
        }
      }
    }
    .albumImage {
      width: ($player_width)-($player_padding*2);
      height: ($player_width)-($player_padding*2);
      overflow: hidden;
      margin: 0 auto;

      img {
        width: 100%;
        height: 100%;
        z-index: 10;
        object-fit: cover;
        object-position: 50% 50%;
      }
    }
    .playerButtons {
      position: relative;
      margin: 0 auto;
      margin-bottom: 1.5rem;
      text-align: center;
      &* {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
      }
      .button {
        font-size: $button_size;
        display: inline-block;
        vertical-align: middle;
        padding: 0.5rem;
        margin: 0 0.25rem;
        color: rgba(0, 0, 0, 0.75);
        border-radius: 50%;

        outline: 0;
        text-decoration: none;
        cursor: pointer;
        transition: $anim_duration;

        &.play {
          font-size: 2*$button_size;
          margin: 0 1.5rem;
        }
        &:active {
          opacity: 0.75;
          transform: scale(0.75);
        }
        &.isDisabled {
          color: rgba(0, 0, 0, 0.2);
          cursor: initial;
        }
        &.isDisabled:active {
          transform: none;
        }
      }
    }
    .currentTimeContainer {
      width: 100%;
      height: 1rem;

      .currentTime,
      .totalTime {
        font-size: 0.5rem;
        font-family: monospace;
        color: $primary_color;
      }
      .currentTime {
        float: left;
      }
      .totalTime {
        float: right;
      }
    }

    .currentProgressBar {
      width: 100%;
      background-color: rgba(0, 0, 0, 0.1);
      margin-top: 1.5rem;
      .currentProgress {
        background-color: $primary_color;
        width: 0px;
        height: 1px;
        transition: 100ms;
      }
    }
  }
}

.loader,
.loader:after {
  border-radius: 50%;
  width: 10em;
  height: 10em;
}
.loader {
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 0.1em solid rgba(0, 0, 0, 0.2);
  border-right: 0.1em solid rgba(0, 0, 0, 0.2);
  border-bottom: 0.1em solid rgba(0, 0, 0, 0.2);
  border-left: 0.1em solid $primary_color;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

/* data change transitions */
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(10px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity $anim_duration;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}

/* Codepen Formatting */
body {
  background-image: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-repeat:no-repeat;
  background-attachment:fixed;

  color: rgba(255, 255, 255, 0.7);
  font-family: Raleway, sans-serif;

  padding: 3rem;
}
.heading {
  text-align: center;
  margin: 2rem 0;
  font-family: Inconsolata, monospace;

  h1 {
    margin: 0;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }
  p {
    margin: 0;
    font-size: 0.8rem;
  }
  a {
    color: rgba(255, 255, 255, 0.8);
    transition: 0.3s;
    &:hover {
      color: rgba(255, 255, 255, 1) !important;
    }
    &:visited {
      color: rgba(255, 255, 255, 0.5);
    }
  }
}
</style>
