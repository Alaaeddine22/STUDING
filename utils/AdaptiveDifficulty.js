// Adaptive difficulty engine: adjusts exercise level based on performance

export function getAdaptiveLevel(lessonScores, currentLevel) {
  if (!lessonScores || Object.keys(lessonScores).length < 2) return currentLevel;

  const recentScores = Object.values(lessonScores).slice(-5);
  const avgScore = recentScores.reduce((sum, s) => sum + (s.correct / s.total), 0) / recentScores.length;

  if (avgScore >= 0.85 && currentLevel < 3) return currentLevel + 1;
  if (avgScore <= 0.4 && currentLevel > 1) return currentLevel - 1;
  return currentLevel;
}

export function selectExercises(allExercises, lessonId, maxCount = 5) {
  const lessonExercises = allExercises.filter(e => e.lessonId === lessonId);
  if (lessonExercises.length <= maxCount) return shuffleArray([...lessonExercises]);
  return shuffleArray([...lessonExercises]).slice(0, maxCount);
}

export function getDailyChallengeExercises(allExercises, completedLessons, count = 10) {
  const available = allExercises.filter(e => completedLessons.includes(e.lessonId));
  if (available.length === 0) return allExercises.slice(0, count);
  return shuffleArray([...available]).slice(0, count);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function calculateStars(correct, total) {
  const ratio = correct / total;
  if (ratio >= 0.9) return 3;
  if (ratio >= 0.7) return 2;
  if (ratio >= 0.5) return 1;
  return 0;
}

export function getEncouragingMessage(correct, total) {
  const ratio = correct / total;
  if (ratio === 1) return { title: "PERFECT! 🌟", message: "You got every single one right! Amazing!" };
  if (ratio >= 0.8) return { title: "Excellent! 🎉", message: "Almost perfect! You're a superstar!" };
  if (ratio >= 0.6) return { title: "Good Job! 👏", message: "Keep practicing and you'll be perfect!" };
  if (ratio >= 0.4) return { title: "Nice Try! 💪", message: "Practice makes perfect! Try again!" };
  return { title: "Keep Going! 😊", message: "Don't give up! Every try makes you smarter!" };
}
