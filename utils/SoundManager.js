import { Audio } from 'expo-av';

const sounds = {};

const soundFiles = {
  correct: require('../assets/sounds/correct.wav'),
  wrong: require('../assets/sounds/wrong.wav'),
  success: require('../assets/sounds/success.wav'),
  click: require('../assets/sounds/click.wav'),
};

export async function loadSounds() {
  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
    });
    for (const [key, file] of Object.entries(soundFiles)) {
      const { sound } = await Audio.Sound.createAsync(file);
      sounds[key] = sound;
    }
  } catch (e) {
    console.log('Sound loading skipped:', e.message);
  }
}

export async function playSound(name) {
  try {
    if (sounds[name]) {
      await sounds[name].replayAsync();
    }
  } catch (e) {
    console.log('Sound play error:', e.message);
  }
}

export async function unloadSounds() {
  for (const sound of Object.values(sounds)) {
    try { await sound.unloadAsync(); } catch (e) {}
  }
}
