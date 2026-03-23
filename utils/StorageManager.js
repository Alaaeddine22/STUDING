import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  PROFILE: '@happy_learning_profile',
  PROGRESS: '@happy_learning_progress',
  SETTINGS: '@happy_learning_settings',
  DAILY: '@happy_learning_daily',
};

const defaultProfile = {
  name: '',
  avatar: 0,
  totalStars: 0,
  level: 1,
  badges: [],
  createdAt: null,
};

const defaultProgress = {
  completedLessons: [],
  lessonScores: {},
  exerciseHistory: [],
  streakDays: 0,
  lastActiveDate: null,
  dailyChallengesCompleted: 0,
  perfectLessons: 0,
};

const defaultSettings = {
  darkMode: false,
  soundEnabled: true,
  parentPin: '1234',
};

export async function getProfile() {
  try {
    const data = await AsyncStorage.getItem(KEYS.PROFILE);
    return data ? JSON.parse(data) : { ...defaultProfile };
  } catch { return { ...defaultProfile }; }
}

export async function saveProfile(profile) {
  await AsyncStorage.setItem(KEYS.PROFILE, JSON.stringify(profile));
}

export async function getProgress() {
  try {
    const data = await AsyncStorage.getItem(KEYS.PROGRESS);
    return data ? JSON.parse(data) : { ...defaultProgress };
  } catch { return { ...defaultProgress }; }
}

export async function saveProgress(progress) {
  await AsyncStorage.setItem(KEYS.PROGRESS, JSON.stringify(progress));
}

export async function getSettings() {
  try {
    const data = await AsyncStorage.getItem(KEYS.SETTINGS);
    return data ? JSON.parse(data) : { ...defaultSettings };
  } catch { return { ...defaultSettings }; }
}

export async function saveSettings(settings) {
  await AsyncStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
}

export async function getDailyChallenge() {
  try {
    const data = await AsyncStorage.getItem(KEYS.DAILY);
    if (data) {
      const parsed = JSON.parse(data);
      const today = new Date().toDateString();
      if (parsed.date === today) return parsed;
    }
    return null;
  } catch { return null; }
}

export async function saveDailyChallenge(challenge) {
  await AsyncStorage.setItem(KEYS.DAILY, JSON.stringify({
    ...challenge,
    date: new Date().toDateString(),
  }));
}

export async function updateStreak() {
  const progress = await getProgress();
  const today = new Date().toDateString();
  const lastActive = progress.lastActiveDate;

  if (lastActive === today) return progress;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (lastActive === yesterday.toDateString()) {
    progress.streakDays += 1;
  } else if (lastActive !== today) {
    progress.streakDays = 1;
  }

  progress.lastActiveDate = today;
  await saveProgress(progress);
  return progress;
}

export async function resetAllData() {
  await AsyncStorage.multiRemove(Object.values(KEYS));
}
