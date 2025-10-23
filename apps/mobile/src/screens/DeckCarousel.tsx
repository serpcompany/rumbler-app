import React, { useCallback, useRef, useState } from 'react';
import { Animated, Dimensions, PanResponder, Pressable, Text, View } from 'react-native';
import { DeckFighter, likeFighter, passFighter } from '../lib/api';
import { trackEvent } from '../lib/analytics';
import { radii, spacing, typography } from '@design/rumbler_tokens';
import { useQueryClient } from '@tanstack/react-query';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.25;

interface DeckCarouselProps {
  fighters: DeckFighter[];
  isLoading: boolean;
  error: string | null;
  palette: Record<string, string>;
}

export const DeckCarousel: React.FC<DeckCarouselProps> = ({
  fighters,
  isLoading,
  error,
  palette,
}) => {
  const [index, setIndex] = useState(0);
  const [items, setItems] = useState(fighters);
  const pan = useRef(new Animated.ValueXY()).current;
  const queryClient = useQueryClient();

  React.useEffect(() => {
    setItems(fighters);
    setIndex(0);
  }, [fighters]);

  const animateCard = (toValue: number, velocity: number, direction: 'like' | 'pass') => {
    Animated.timing(pan, {
      toValue: { x: toValue, y: 0 },
      duration: 200,
      useNativeDriver: false,
    }).start(async () => {
      pan.setValue({ x: 0, y: 0 });
      const fighter = items[index];
      if (!fighter) return;

      setIndex((prev) => prev + 1);

      try {
        if (direction === 'like') {
          const response = await likeFighter(fighter.fighterId);
          trackEvent({
            name: 'deck_swiped',
            payload: { fighterId: fighter.fighterId, direction: 'like' },
          });
          if (response.match) {
            trackEvent({ name: 'match_created', payload: { fighterId: fighter.fighterId } });
            queryClient.invalidateQueries({ queryKey: ['matches'] });
          }
        } else {
          await passFighter(fighter.fighterId);
          trackEvent({
            name: 'deck_swiped',
            payload: { fighterId: fighter.fighterId, direction: 'pass' },
          });
        }
      } catch (err) {
        console.error(err);
      }
    });
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        pan.setValue({ x: gestureState.dx, y: gestureState.dy });
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dx > SWIPE_THRESHOLD) {
          animateCard(width, gestureState.vx, 'like');
        } else if (gestureState.dx < -SWIPE_THRESHOLD) {
          animateCard(-width, gestureState.vx, 'pass');
        } else {
          Animated.spring(pan, {
            toValue: { x: 0, y: 0 },
            friction: 5,
            useNativeDriver: false,
          }).start();
        }
      },
    }),
  ).current;

  const current = items[index];

  const rotate = pan.x.interpolate({
    inputRange: [-width, 0, width],
    outputRange: ['-12deg', '0deg', '12deg'],
  });

  const cardStyle = {
    transform: [{ translateX: pan.x }, { translateY: pan.y }, { rotate }],
  };

  const likeOpacity = pan.x.interpolate({
    inputRange: [0, width * 0.5],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  const passOpacity = pan.x.interpolate({
    inputRange: [-width * 0.5, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const handleButtonSwipe = useCallback(
    (direction: 'like' | 'pass') => {
      animateCard(direction === 'like' ? width : -width, 5, direction);
    },
    [animateCard],
  );

  if (isLoading) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: palette.background,
        }}
      >
        <Text style={{ color: palette.mutedForeground }}>Loading deck…</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: palette.background,
          padding: spacing.xl,
        }}
      >
        <Text style={{ color: palette.destructive, textAlign: 'center' }}>{error}</Text>
      </View>
    );
  }

  if (!current) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: palette.background,
        }}
      >
        <Text style={{ color: palette.mutedForeground }}>You’re all caught up. Check back soon.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, padding: spacing.lg, gap: spacing.lg }}>
      <Animated.View
        {...panResponder.panHandlers}
        style={[
          {
            borderRadius: radii.lg,
            padding: spacing.lg,
            backgroundColor: palette.card,
            borderWidth: 1,
            borderColor: palette.border,
          },
          cardStyle,
        ]}
      >
        <Text
          style={{
            fontSize: typography.display.fontSize,
            fontWeight: typography.display.fontWeight,
            color: palette.foreground,
          }}
        >
          {current.name}
        </Text>
        <Text style={{ color: palette.mutedForeground, marginVertical: spacing.xs }}>
          {current.age} • {current.gender} • {current.weightClass}
        </Text>
        <Text style={{ color: palette.foreground, marginBottom: spacing.sm }}>
          Disciplines: {current.disciplines.join(', ')}
        </Text>
        <Text style={{ color: palette.foreground }}>
          Record: {current.record.amateur}
          {current.record.professional ? ` (Pro ${current.record.professional})` : ''}
        </Text>
        <Text style={{ color: palette.mutedForeground, marginTop: spacing.sm }}>
          {current.distanceKm} km away
        </Text>

        <Animated.Text
          style={{
            position: 'absolute',
            top: spacing.lg,
            left: spacing.lg,
            color: palette.destructive,
            fontSize: typography.h2.fontSize,
            opacity: passOpacity,
          }}
        >
          PASS
        </Animated.Text>

        <Animated.Text
          style={{
            position: 'absolute',
            top: spacing.lg,
            right: spacing.lg,
            color: palette.primary,
            fontSize: typography.h2.fontSize,
            opacity: likeOpacity,
          }}
        >
          LIKE
        </Animated.Text>
      </Animated.View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
        <SwipeButton
          label="Pass"
          backgroundColor={palette.muted}
          color={palette.foreground}
          onPress={() => handleButtonSwipe('pass')}
        />
        <SwipeButton
          label="Like"
          backgroundColor={palette.primary}
          color={palette.primaryForeground}
          onPress={() => handleButtonSwipe('like')}
        />
      </View>
    </View>
  );
};

const SwipeButton = ({
  label,
  backgroundColor,
  color,
  onPress,
}: {
  label: string;
  backgroundColor: string;
  color: string;
  onPress: () => void;
}) => (
  <Pressable
    onPress={onPress}
    style={{
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: radii.lg,
      backgroundColor,
    }}
  >
    <Text
      style={{
        color,
        fontSize: typography.h2.fontSize,
        fontWeight: typography.h2.fontWeight,
      }}
    >
      {label}
    </Text>
  </Pressable>
);
