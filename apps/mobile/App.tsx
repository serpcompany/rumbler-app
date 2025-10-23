import 'react-native-gesture-handler';
import React, { useMemo } from 'react';
import { ActivityIndicator, Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';
import { useColorScheme } from 'react-native';
import { colors, radii, spacing, typography } from '@design/rumbler_tokens';
import {
  ApiConfig,
  DeckFighter,
  ProfileResponse,
  fetchDeck,
  fetchMatches,
  fetchProfile,
  likeFighter,
  passFighter,
} from './src/lib/api';
import { ProfileSetupScreen } from './src/screens/ProfileSetupScreen';
import { DeckCarousel } from './src/screens/DeckCarousel';

enableScreens(true);

const queryClient = new QueryClient();
const Tab = createBottomTabNavigator();

function useThemeColors() {
  const scheme = useColorScheme();
  return colors[scheme === 'dark' ? 'dark' : 'light'];
}

type CompleteProfile = ProfileResponse & {
  profileCompleted: true;
  kycVerified: true;
  gender: string;
  dob: string;
  disciplines: string[];
  weightClass: string;
  experienceLevel: 'amateur' | 'pro';
  amateurWins: number;
  amateurLosses: number;
  amateurDraws: number;
  proWins: number;
  proLosses: number;
  proDraws: number;
};

const DeckScreen: React.FC = () => {
  const palette = useThemeColors();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['deck'],
    queryFn: () => fetchDeck(),
    staleTime: 1000 * 30,
  });

  return (
    <View style={{ flex: 1, backgroundColor: palette.background }}>
      <DeckCarousel
        palette={palette}
        fighters={(data?.results ?? []) as DeckFighter[]}
        isLoading={isLoading}
        error={isError ? (error instanceof Error ? error.message : 'Unable to load deck.') : null}
      />
    </View>
  );
};

const MatchesScreen = () => {
  const palette = useThemeColors();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
    staleTime: 1000 * 10,
  });

  const results = data?.results ?? [];

  if (isLoading) {
    return (
      <View style={[styles.centered, { backgroundColor: palette.background }]}>
        <ActivityIndicator color={palette.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.centered, { backgroundColor: palette.background }]}>
        <Text style={{ color: palette.destructive }}>
          {error instanceof Error ? error.message : 'Failed to load matches.'}
        </Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  if (!results.length) {
    return (
      <View style={[styles.centered, { backgroundColor: palette.background, padding: spacing.xl }]}>
        <Text style={{ color: palette.mutedForeground }}>No matches yet. Keep swiping!</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: palette.background }}
      contentContainerStyle={[styles.screenContainer, { backgroundColor: palette.background }]}
    >
      <Text style={[styles.sectionHeading, { color: palette.foreground }]}>Matches</Text>
      {results.map((match) => (
        <View
          key={match.fighterId}
          style={{
            padding: spacing.lg,
            borderRadius: radii.lg,
            borderWidth: 1,
            borderColor: palette.border,
            backgroundColor: palette.card,
            gap: spacing.sm,
          }}
        >
          <Text style={{ color: palette.foreground, fontSize: typography.h2.fontSize }}>
            Fighter {match.fighterId}
          </Text>
          <Text style={{ color: palette.mutedForeground }}>{match.lastMessage}</Text>
          <Text style={{ color: palette.mutedForeground }}>
            Matched at {new Date(match.matchedAt).toLocaleString()}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

const ChatScreen = () => {
  const palette = useThemeColors();
  return (
    <View style={[styles.screenContainer, { backgroundColor: palette.background }]}>
      <Text style={[styles.sectionHeading, { color: palette.foreground }]}>Chat</Text>
      <Text style={[styles.bodyText, { color: palette.mutedForeground }]}>
        Real-time chat via Durable Objects will land here. Hook up `/matches/:id/chat` when the API
        is ready.
      </Text>
    </View>
  );
};

const ProfileScreen: React.FC<{ profile: CompleteProfile }> = ({ profile }) => {
  const palette = useThemeColors();
  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: palette.background }}
      contentContainerStyle={[styles.screenContainer, { backgroundColor: palette.background }]}
    >
      <Text style={[styles.sectionHeading, { color: palette.foreground }]}>My profile</Text>
      <Text style={[styles.bodyText, { color: palette.foreground }]}>
        Gender: {profile.gender}{'\n'}
        Date of birth: {profile.dob}{'\n'}
        Disciplines: {profile.disciplines.join(', ')}{'\n'}
        Weight class: {profile.weightClass}{'\n'}
        Experience: {profile.experienceLevel.toUpperCase()}
      </Text>
      <Text style={[styles.bodyText, { color: palette.foreground }]}>
        Amateur record: {profile.amateurWins}-{profile.amateurLosses}-{profile.amateurDraws}
      </Text>
      <Text style={[styles.bodyText, { color: palette.foreground }]}>
        Pro record: {profile.proWins}-{profile.proLosses}-{profile.proDraws}
      </Text>
      <Text style={[styles.captionText, { color: palette.mutedForeground }]}>
        Updated: {profile.updatedAt ?? '—'}
      </Text>
    </ScrollView>
  );
};

function RootNavigator({ profile }: { profile: CompleteProfile }) {
  const scheme = useColorScheme();
  const palette = useThemeColors();

  const navigationTheme = useMemo(
    () => ({
      ...(scheme === 'dark' ? DarkTheme : DefaultTheme),
      colors: {
        ...(scheme === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
        background: palette.background,
        card: palette.card,
        border: palette.border,
        text: palette.foreground,
        primary: palette.primary,
      },
    }),
    [palette, scheme],
  );

  return (
    <NavigationContainer theme={navigationTheme}>
      <Tab.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: palette.card,
          },
          headerTitleStyle: {
            color: palette.foreground,
            fontSize: typography.h2.fontSize,
            fontWeight: typography.h2.fontWeight,
          },
          tabBarStyle: {
            backgroundColor: palette.sidebar,
            borderTopColor: palette.sidebarBorder ?? palette.border,
            paddingVertical: 6,
            height: 64,
          },
          tabBarActiveTintColor: palette.primary,
          tabBarInactiveTintColor: palette.mutedForeground,
          tabBarLabelStyle: {
            fontSize: typography.label.fontSize,
            fontWeight: typography.label.fontWeight,
            marginBottom: spacing.xxs,
          },
        }}
      >
        <Tab.Screen name="Deck" component={DeckScreen} />
        <Tab.Screen name="Matches" component={MatchesScreen} />
        <Tab.Screen name="Chat" component={ChatScreen} />
        <Tab.Screen name="Profile">
          {() => <ProfileScreen profile={profile} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function AppShell() {
  const palette = useThemeColors();

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    staleTime: 1000 * 60,
  });

  if (isLoading || isFetching) {
    return (
      <View style={[styles.centered, { backgroundColor: palette.background }]}>
        <ActivityIndicator color={palette.primary} />
        <Text style={{ color: palette.mutedForeground, marginTop: spacing.sm }}>Loading...</Text>
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={[styles.centered, { backgroundColor: palette.background, padding: spacing.xl }]}>
        <Text style={{ color: palette.destructive, marginBottom: spacing.md }}>
          {error instanceof Error ? error.message : 'Unable to load profile.'}
        </Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );
  }

  if (!data.profileCompleted || !data.kycVerified) {
    return <ProfileSetupScreen profile={data} />;
  }

  const completeProfile = data as CompleteProfile;
  return <RootNavigator profile={completeProfile} />;
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AppShell />
          <StatusBar style="auto" />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flexGrow: 1,
    paddingVertical: spacing.lg,
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  sectionHeading: {
    fontSize: typography.h1.fontSize,
    fontWeight: typography.h1.fontWeight,
    lineHeight: typography.h1.lineHeight,
  },
  bodyText: {
    fontSize: typography.body.fontSize,
    lineHeight: typography.body.lineHeight,
  },
  captionText: {
    fontSize: typography.caption.fontSize,
    lineHeight: typography.caption.lineHeight,
  },
  card: {
    borderRadius: radii.lg,
    padding: spacing.lg,
    gap: spacing.xs,
    borderWidth: 1,
  },
  cardTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: typography.h2.fontWeight,
    lineHeight: typography.h2.lineHeight,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
