/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import SoundPlayer from 'react-native-sound';

export const useAudioHelper = props => {
  const [listSounds, setListSounds] = useState(props.listSounds);
  const [timeRate, setTimeRate] = useState(props.timeRate || 15);
  const [status, setStatus] = useState('loading');

  const [duration, setDuration] = useState(0);
  const [player, setPlayer] = useState(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (player && status === 'play') {
        player.getCurrentTime(seconds => {
          setCurrentTime(seconds);
        });
      }
    }, 100);

    return () => clearInterval(interval);
  });

  const initialize = () => {
    setStatus('loading');
    if (listSounds.length > 0) {
      if (player) {
        player.release();
      }

      const callback = (error, player) => {
        if (error) {
          setStatus('error');
          //setErrorMessage(error.message);
        } else {
          setStatus('success');
          //setErrorMessage('');
        }
        player.setSpeed(speed);
        setDuration(player.getDuration());
        play(player);
      };

      const currentAudio = listSounds[index];
      // If the audio is a 'require' then the second parameter must be the callback.
      let newPlayer = null;
      switch (currentAudio.type) {
        default:
          break;
        case 'app-bundle':
          newPlayer = new SoundPlayer(
            currentAudio.path,
            currentAudio.basePath,
            error => callback(error, newPlayer),
          );
          break;
        case 'network':
          newPlayer = new SoundPlayer(currentAudio.path, null, error =>
            callback(error, newPlayer),
          );
          break;
        case 'directory':
          newPlayer = new SoundPlayer(currentAudio.path, error =>
            callback(error, newPlayer),
          );
          break;
      }
      if (newPlayer) {
        setPlayer(newPlayer);
      }
    }
  };

  const playWithPlayer = player => {
    if (player) {
      player.play(playComplete);
      setStatus('play');
    }
  };

  const playComplete = isEnd => {
    if (isEnd === true) {
      next();
    }
  };

  const play = () => {
    if (player) {
      player.play(playComplete);
      setStatus('play');
    }
  };

  const pause = () => {
    if (player) {
      player.pause();
      setStatus('pause');
    }
  };

  const stop = () => {
    if (player) {
      player.stop();
      setStatus('stop');
    }
  };

  const next = () => {
    if (player && index < listSounds.length - 1) {
      player.release();
      setCurrentTime(0);
      setStatus('next');
      setIndex(index + 1);
    }
  };

  const previous = () => {
    if (player && index > 0) {
      player.release();
      setCurrentTime(0);
      setStatus('previous');
      setIndex(index - 1);
    }
  };
  const seekToTime = seconds => {
    if (player) {
      player.setCurrentTime(seconds);
      setCurrentTime(seconds);
    }
  };

  const increaseTime = () => {
    if (player) {
      player.getCurrentTime(seconds => {
        if (seconds + timeRate < duration) {
          seekToTime(seconds + timeRate);
        } else {
          seekToTime(duration);
        }
      });
    }
  };

  const decreaseTime = () => {
    if (player) {
      player.getCurrentTime(seconds => {
        if (seconds - timeRate > 0) {
          seekToTime(seconds - timeRate);
        } else {
          seekToTime(0);
        }
      });
    }
  };

  useEffect(() => {
    if (player) {
      player.setSpeed(speed);
    }
  }, [speed]);

  useEffect(() => {
    initialize();
  }, [index]);

  const [isLoop, setIsLoop] = useState(false);
  const loop = () => {
    setIsLoop(!isLoop);
  };

  const [volume, setVolume] = useState(100); // percent
  const [previousVolume, setPreviousVolume] = useState(volume);
  const changeVolume = (player, volume) => {
    if (player && volume >= 0 && volume <= 100) {
      player.setVolume(volume / 100.0);
      setVolume(volume);
    }
  };

  const [isMuted, setIsMuted] = useState(false);
  useEffect(() => {
    if (volume > 0 && isMuted === true) {
      setIsMuted(false);
    }
  }, [volume]);

  const mute = () => {
    if (isMuted === false) {
      setIsMuted(true);
      setPreviousVolume(volume);
      changeVolume(player, 0);
    }
  };

  function unmute() {
    if (isMuted === true) {
      setIsMuted(false);
      changeVolume(player, previousVolume);
    }
  }

  function formatTimeString(value) {
    return new Date(value * 1000).toISOString().substr(11, 8);
  }

  function getDurationString() {
    return formatTimeString(duration);
  }

  function getCurrentTimeString() {
    return formatTimeString(currentTime);
  }

  function getCurrentAudioName() {
    return listSounds[index].name;
  }

  function isDisabledButtonPlay() {
    return status === 'loading' || status === 'play';
  }

  function isDisabledButtonPause() {
    return status === 'loading' || status === 'pause' || status === 'stop';
  }

  function isDisabledButtonStop() {
    return status === 'loading' || status === 'stop';
  }

  function isDisabledButtonNext() {
    return status === 'loading' || index === listSounds.length - 1;
  }

  function isDisabledButtonPrevious() {
    return status === 'loading' || index === 0;
  }

  return {
    status,
    duration,
    currentTime,
    play,
    pause,
    stop,
    next,
    previous,
    increaseTime,
    decreaseTime,
    loop,
    mute,
    unmute,
    setVolume,
    durationString: getDurationString(),
    currentTimeString: getCurrentTimeString(),
    currentAudioName: getCurrentAudioName(),
    isDisabledButtonPlay: isDisabledButtonPlay(),
    isDisabledButtonPause: isDisabledButtonPause(),
    isDisabledButtonStop: isDisabledButtonStop(),
    isDisabledButtonNext: isDisabledButtonNext(),
    isDisabledButtonPrevious: isDisabledButtonPrevious(),
    seekToTime,
    timeRate,
    speed,
    setSpeed,
  };
};
