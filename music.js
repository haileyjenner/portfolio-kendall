/* Hailey's Barbie Girl player: local audio, looping, and polite autoplay fallback. */
(() => {
  'use strict';

  const player = document.getElementById('music-player');
  const audio = document.getElementById('portfolio-audio');
  if (!player || !audio) return;

  const playButton = document.getElementById('music-play');
  const minimizeButton = document.getElementById('music-minimize');
  const muteButton = document.getElementById('music-mute');
  const seek = document.getElementById('music-progress');
  const volume = document.getElementById('music-volume');
  const currentLabel = document.getElementById('music-current');
  const durationLabel = document.getElementById('music-duration');
  const status = document.getElementById('music-status');

  audio.loop = true;
  audio.volume = 0.65;

  let userPaused = false;
  let gesturePending = false;
  let playRequest = 0;
  let lastNonzeroVolume = 0.65;

  const duration = () => (Number.isFinite(audio.duration) && audio.duration > 0 ? audio.duration : 0);
  const clock = seconds => {
    const n = Number.isFinite(seconds) && seconds >= 0 ? Math.floor(seconds) : 0;
    return `${Math.floor(n / 60)}:${String(n % 60).padStart(2, '0')}`;
  };
  const showStatus = message => { if (status) status.textContent = message; };

  function showTime() {
    const total = duration();
    const now = Math.max(0, Number.isFinite(audio.currentTime) ? audio.currentTime : 0);
    if (currentLabel) currentLabel.textContent = clock(now);
    if (durationLabel) durationLabel.textContent = clock(total);
    if (seek) {
      const percent = total ? Math.max(0, Math.min(100, now / total * 100)) : 0;
      seek.value = String(percent);
      seek.style.setProperty('--fill', `${percent}%`);
      seek.setAttribute('aria-valuetext', `${clock(now)} of ${clock(total)}`);
      seek.disabled = !total;
    }
  }

  function showVolume() {
    const silent = audio.muted || audio.volume === 0;
    player.classList.toggle('is-muted', silent);
    if (muteButton) {
      muteButton.setAttribute('aria-pressed', String(silent));
      muteButton.setAttribute('aria-label', silent ? 'Unmute music' : 'Mute music');
      muteButton.title = silent ? 'Unmute' : 'Mute';
    }
    if (volume) {
      volume.value = String(silent ? 0 : audio.volume);
      volume.style.setProperty('--fill', `${(silent ? 0 : audio.volume) * 100}%`);
    }
  }

  function showPlayback() {
    const playing = !audio.paused && !audio.ended;
    player.classList.toggle('is-playing', playing);
    if (playButton) {
      playButton.setAttribute('aria-pressed', String(playing));
      playButton.setAttribute('aria-label', playing ? 'Pause Barbie Girl' : 'Play Barbie Girl');
      playButton.title = playing ? 'Pause music' : 'Play music';
    }
    if (playing) {
      player.dataset.playback = 'playing';
      showStatus('Now playing ♡ · repeating');
      clearGesture();
    } else if (userPaused) {
      player.dataset.playback = 'paused';
      showStatus('Paused ♡ · press play to resume');
    }
  }

  function clearGesture() {
    if (!gesturePending) return;
    gesturePending = false;
    document.removeEventListener('pointerdown', onGesture, true);
    document.removeEventListener('keydown', onGesture, true);
  }

  function onGesture(event) {
    if (!gesturePending || userPaused) return;
    // A direct player control has its own click/key handler; don't preempt it.
    if (event.target instanceof Element && event.target.closest('#music-player')) return;
    if (event.type === 'keydown' &&
        (event.metaKey || event.ctrlKey || event.altKey ||
         !['Enter', ' ', 'Spacebar'].includes(event.key))) return;
    clearGesture();
    requestPlay();
  }

  function waitForGesture() {
    player.dataset.playback = 'blocked';
    showStatus('Tap play or interact to start the music ♡');
    if (gesturePending || userPaused) return;
    gesturePending = true;
    document.addEventListener('pointerdown', onGesture, true);
    document.addEventListener('keydown', onGesture, true);
  }

  function requestPlay() {
    if (userPaused) return;
    const request = ++playRequest;
    try {
      const result = audio.play();
      if (result && typeof result.catch === 'function') {
        result.catch(error => {
          // Ignore stale play rejections after a newer play/pause command.
          if (request !== playRequest || userPaused) return;
          if (error?.name === 'NotAllowedError') {
            waitForGesture();
          } else if (error?.name !== 'AbortError') {
            player.dataset.playback = 'error';
            showStatus('Unable to load music · try the play button');
          }
        });
      }
    } catch (error) {
      if (error?.name === 'NotAllowedError') waitForGesture();
      else {
        player.dataset.playback = 'error';
        showStatus('Unable to load music · try the play button');
      }
    }
  }

  playButton?.addEventListener('click', () => {
    if (audio.paused) {
      userPaused = false;
      clearGesture();
      requestPlay();
    } else {
      userPaused = true;
      playRequest++;
      clearGesture();
      audio.pause();
      showPlayback();
    }
  });

  minimizeButton?.addEventListener('click', () => {
    const minimized = player.classList.toggle('is-minimized');
    minimizeButton.setAttribute('aria-expanded', String(!minimized));
    minimizeButton.setAttribute('aria-label', minimized ? 'Expand music player' : 'Minimize music player');
    minimizeButton.title = minimized ? 'Expand player' : 'Minimize player';
    minimizeButton.textContent = minimized ? '+' : '−';
  });

  seek?.addEventListener('input', () => {
    const total = duration();
    if (total) {
      audio.currentTime = total * Math.max(0, Math.min(100, Number(seek.value))) / 100;
      showTime();
    }
  });

  muteButton?.addEventListener('click', () => {
    if (audio.muted || audio.volume === 0) {
      audio.volume = lastNonzeroVolume || 0.65;
      audio.muted = false;
    } else {
      lastNonzeroVolume = audio.volume;
      audio.muted = true;
    }
    showVolume();
  });

  volume?.addEventListener('input', () => {
    const level = Math.max(0, Math.min(1, Number(volume.value)));
    audio.muted = false;
    audio.volume = level;
    if (level > 0) lastNonzeroVolume = level;
    showVolume();
  });

  audio.addEventListener('play', showPlayback);
  audio.addEventListener('playing', showPlayback);
  audio.addEventListener('pause', showPlayback);
  audio.addEventListener('timeupdate', showTime);
  audio.addEventListener('durationchange', showTime);
  audio.addEventListener('loadedmetadata', showTime);
  audio.addEventListener('volumechange', showVolume);
  audio.addEventListener('error', () => {
    clearGesture();
    player.dataset.playback = 'error';
    showStatus('Music unavailable · check the MP3 file');
  });

  showTime();
  showVolume();
  showPlayback();
  // Browsers permit unmuted autoplay only in certain contexts; honor that
  // policy and retry within a genuine user gesture instead of forcing sound.
  requestPlay();
})();
