import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { loadSounds } from './utils/SoundManager';

import SplashScreen from './screens/SplashScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import LessonListScreen from './screens/LessonListScreen';
import LessonScreen from './screens/LessonScreen';
import ExerciseScreen from './screens/ExerciseScreen';
import ResultScreen from './screens/ResultScreen';
import DailyChallengeScreen from './screens/DailyChallengeScreen';
import ParentModeScreen from './screens/ParentModeScreen';
import SettingsScreen from './screens/SettingsScreen';

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    loadSounds().catch(() => {});
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false, cardStyleInterpolator: ({ current }) => ({ cardStyle: { opacity: current.progress } }) }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="LessonList" component={LessonListScreen} />
        <Stack.Screen name="Lesson" component={LessonScreen} />
        <Stack.Screen name="Exercise" component={ExerciseScreen} />
        <Stack.Screen name="Result" component={ResultScreen} />
        <Stack.Screen name="DailyChallenge" component={DailyChallengeScreen} />
        <Stack.Screen name="ParentMode" component={ParentModeScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
