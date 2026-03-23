# 🎓 Happy Learning Kids

A fully **offline**, **gamified** mobile learning app for primary school students (ages 6–12) to learn **Mathematics** and **Arabic Language**.

Built with **React Native (Expo)**.

---

## ✨ Features

### 📚 Content
- **40 Math Lessons** covering: Numbers, Addition, Subtraction, Multiplication (full times tables), Division, Fractions, Decimals, Geometry, Time, Money, Word Problems, Patterns
- **26 Arabic Lessons** covering: Full Alphabet (28 letters), Diacritics, Words (family, animals, colors, numbers), Sentences, Grammar, Reading Comprehension, Writing
- **332 Exercises** with multiple choice and fill-in-the-blank types

### 🎮 Gamification
- ⭐ Star rewards for correct answers
- 🏆 8 level progression system
- 🔓 Lesson unlock system
- 🏅 10 achievement badges
- 🔥 Daily streak tracking
- ⚡ Daily Challenge mode
- 📊 Parent Dashboard (PIN-protected)

### 🎨 UI/UX
- Bright, colorful, kid-friendly interface
- Animated mascot with mood reactions
- Confetti celebrations on correct answers
- Shake animation on wrong answers
- 🌙 Dark mode support

### 💾 Fully Offline
- All data stored locally via AsyncStorage
- No internet required

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Expo CLI](https://docs.expo.dev/get-started/installation/)
- [Expo Go](https://expo.dev/client) app on your phone

### Run the App

```bash
# Navigate to project
cd e:\ownproject

# Install dependencies (if not already done)
npm install

# Start dev server
npx expo start
```

Then scan the QR code with **Expo Go** on your phone.

---

## 📱 Build APK (Android)

### Option 1: EAS Build (Recommended)

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure build
eas build:configure

# Build APK
eas build --platform android --profile preview
```

Add this to `eas.json` for APK (not AAB):
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

### Option 2: Local Build

```bash
# Generate native Android project
npx expo prebuild --platform android

# Build APK
cd android
./gradlew assembleRelease
```

The APK will be at `android/app/build/outputs/apk/release/app-release.apk`

---

## 📂 Project Structure

```
├── App.js                    # Main entry + navigation
├── assets/
│   ├── sounds/               # Sound effect MP3 files
│   └── images/               # Image assets
├── components/
│   ├── AnimatedButton.js     # Scale + sound button
│   ├── AvatarPicker.js       # Character selection grid
│   ├── ConfettiEffect.js     # Celebration animation
│   ├── ExerciseCard.js       # Quiz card (MC + fill-blank)
│   ├── Mascot.js             # Animated mascot with moods
│   ├── ProgressBar.js        # Animated progress indicator
│   └── StarCounter.js        # Animated star display
├── data/
│   ├── exercises.json        # 332 exercises
│   ├── lessons_arabic.json   # 26 Arabic lessons
│   ├── lessons_math.json     # 40 Math lessons
│   └── rewards.json          # Milestones, streaks, levels
├── screens/
│   ├── DailyChallengeScreen.js
│   ├── ExerciseScreen.js
│   ├── HomeScreen.js
│   ├── LessonListScreen.js
│   ├── LessonScreen.js
│   ├── ParentModeScreen.js
│   ├── ProfileScreen.js
│   ├── ResultScreen.js
│   ├── SettingsScreen.js
│   └── SplashScreen.js
└── utils/
    ├── AdaptiveDifficulty.js # Skill-based exercise selection
    ├── SoundManager.js       # Expo AV sound playback
    ├── StorageManager.js     # AsyncStorage wrapper
    └── theme.js              # Colors, fonts, avatars
```

---

## 🔑 Parent Mode

Default PIN: **1234**

Parent dashboard shows:
- Math/Arabic completion percentage
- Average scores per subject
- Total stars, streak, level
- Daily challenges completed

---

## 🎯 Sound Files

Replace the placeholder MP3s in `assets/sounds/` with real sound effects:
- `correct.mp3` — played on correct answer
- `wrong.mp3` — played on wrong answer
- `success.mp3` — played on lesson completion
- `click.mp3` — played on button press
