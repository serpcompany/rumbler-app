import React, { useMemo } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ScrollView,
  Text,
  View,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { colors, radii, spacing, typography } from '@design/rumbler_tokens';
import { ProfileResponse, UpdateProfilePayload, updateProfile } from '../lib/api';
import { trackEvent } from '../lib/analytics';

const disciplineOptions = [
  'Boxing',
  'Muay Thai',
  'Kickboxing',
  'BJJ',
  'MMA',
  'Wrestling',
];

const weightClasses = [
  'Flyweight',
  'Bantamweight',
  'Featherweight',
  'Lightweight',
  'Welterweight',
  'Middleweight',
  'Light Heavyweight',
  'Heavyweight',
];

const genderOptions: Array<{ label: string; value: UpdateProfilePayload['gender'] }> = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Non-binary', value: 'nonbinary' },
  { label: 'Prefer not to say', value: 'prefer_not_to_say' },
];

const experienceOptions: Array<{ label: string; value: UpdateProfilePayload['experienceLevel'] }> =
  [
    { label: 'Amateur', value: 'amateur' },
    { label: 'Pro', value: 'pro' },
  ];

const formSchema = z
  .object({
    gender: z.enum(['male', 'female', 'nonbinary', 'prefer_not_to_say']),
    dob: z
      .string()
      .nonempty('Date of birth is required')
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD format')
      .refine((value) => {
        const birthDate = new Date(value);
        if (Number.isNaN(birthDate.getTime())) return false;
        const now = new Date();
        let age = now.getFullYear() - birthDate.getFullYear();
        const m = now.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && now.getDate() < birthDate.getDate())) {
          age -= 1;
        }
        return age >= 18;
      }, 'Must be 18 or older'),
    disciplines: z.array(z.string()).min(1, 'Select at least one discipline'),
    stance: z.string().optional(),
    heightCm: z
      .string()
      .optional()
      .transform((value) => (value ? Number(value) : undefined))
      .refine((value) => value === undefined || (!Number.isNaN(value) && value >= 0), {
        message: 'Enter a valid height',
      }),
    reachCm: z
      .string()
      .optional()
      .transform((value) => (value ? Number(value) : undefined))
      .refine((value) => value === undefined || (!Number.isNaN(value) && value >= 0), {
        message: 'Enter a valid reach',
      }),
    weightClass: z.string().min(1, 'Select a weight class'),
    experienceLevel: z.enum(['amateur', 'pro']),
    amateurWins: z
      .string()
      .default('0')
      .transform((value) => Number(value))
      .refine((value) => Number.isInteger(value) && value >= 0, 'Wins must be a non-negative number'),
    amateurLosses: z
      .string()
      .default('0')
      .transform((value) => Number(value))
      .refine(
        (value) => Number.isInteger(value) && value >= 0,
        'Losses must be a non-negative number',
      ),
    amateurDraws: z
      .string()
      .default('0')
      .transform((value) => Number(value))
      .refine(
        (value) => Number.isInteger(value) && value >= 0,
        'Draws must be a non-negative number',
      ),
    proWins: z
      .string()
      .default('0')
      .transform((value) => Number(value || 0))
      .refine((value) => Number.isInteger(value) && value >= 0, 'Wins must be a non-negative number'),
    proLosses: z
      .string()
      .default('0')
      .transform((value) => Number(value || 0))
      .refine(
        (value) => Number.isInteger(value) && value >= 0,
        'Losses must be a non-negative number',
      ),
    proDraws: z
      .string()
      .default('0')
      .transform((value) => Number(value || 0))
      .refine(
        (value) => Number.isInteger(value) && value >= 0,
        'Draws must be a non-negative number',
      ),
    bio: z.string().max(280, 'Keep bio under 280 characters').optional(),
    gymAffiliation: z.string().optional(),
  })
  .transform((values) => ({
    ...values,
    proWins: values.proWins ?? 0,
    proLosses: values.proLosses ?? 0,
    proDraws: values.proDraws ?? 0,
  }));

type FormValues = z.infer<typeof formSchema>;

interface ProfileSetupScreenProps {
  profile: ProfileResponse;
}

export function ProfileSetupScreen({ profile }: ProfileSetupScreenProps) {
  const palette = colors.light;
  const queryClient = useQueryClient();

  const defaultValues = useMemo(() => {
    return {
      gender: profile.gender ?? 'male',
      dob: profile.dob ?? '',
      disciplines: profile.disciplines ?? [],
      stance: profile.stance ?? '',
      heightCm: profile.heightCm,
      reachCm: profile.reachCm,
      weightClass: profile.weightClass ?? '',
      experienceLevel: profile.experienceLevel ?? 'amateur',
      amateurWins: profile.amateurWins ?? 0,
      amateurLosses: profile.amateurLosses ?? 0,
      amateurDraws: profile.amateurDraws ?? 0,
      proWins: profile.proWins ?? 0,
      proLosses: profile.proLosses ?? 0,
      proDraws: profile.proDraws ?? 0,
      bio: profile.bio ?? '',
      gymAffiliation: profile.gymAffiliation ?? '',
    } satisfies FormValues;
  }, [profile]);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
    mode: 'onBlur',
  });

  const mutation = useMutation({
    mutationFn: async (values: FormValues) => {
      const transformed = formSchema.parse(values);
      const payload: UpdateProfilePayload = {
        gender: transformed.gender,
        dob: transformed.dob,
        disciplines: transformed.disciplines,
        stance: transformed.stance || undefined,
        heightCm: transformed.heightCm === undefined ? undefined : transformed.heightCm,
        reachCm: transformed.reachCm === undefined ? undefined : transformed.reachCm,
        weightClass: transformed.weightClass,
        experienceLevel: transformed.experienceLevel,
        amateurWins: transformed.amateurWins,
        amateurLosses: transformed.amateurLosses,
        amateurDraws: transformed.amateurDraws,
        proWins: transformed.proWins ?? 0,
        proLosses: transformed.proLosses ?? 0,
        proDraws: transformed.proDraws ?? 0,
        bio: transformed.bio || undefined,
        gymAffiliation: transformed.gymAffiliation || undefined,
        availability: profile.availability ?? [],
        photoUrl: profile.photoUrl,
      };
      return updateProfile(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      trackEvent({ name: 'profile_completed' });
      Alert.alert('Profile saved', 'Your profile is ready. You can start finding matches!');
    },
    onError: (error: Error) => {
      Alert.alert('Save failed', error.message);
    },
  });

  const selectedDisciplines = watch('disciplines');

  const toggleDiscipline = (value: string) => {
    const current = new Set(selectedDisciplines);
    if (current.has(value)) {
      current.delete(value);
    } else {
      current.add(value);
    }
    setValue('disciplines', Array.from(current));
  };

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: palette.background }}
      contentContainerStyle={{
        padding: spacing.xl,
        gap: spacing.lg,
      }}
    >
      <Text
        style={{
          fontSize: typography.display.fontSize,
          fontWeight: typography.display.fontWeight,
          color: palette.foreground,
        }}
      >
        Complete your profile
      </Text>
      <Text style={{ color: palette.mutedForeground, fontSize: typography.body.fontSize }}>
        Fill in the details below. These fields are required before you can access the deck.
      </Text>

      <FieldLabel text="Gender" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {genderOptions.map((option) => (
          <Controller
            key={option.value}
            control={control}
            name="gender"
            render={({ field: { onChange, value } }) => (
              <Pressable
                onPress={() => onChange(option.value)}
                style={{
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.md,
                  borderRadius: radii.md,
                  borderWidth: 1,
                  borderColor: value === option.value ? palette.primary : palette.border,
                  backgroundColor: value === option.value ? palette.primary : palette.card,
                }}
              >
                <Text
                  style={{
                    color: value === option.value ? palette.primaryForeground : palette.foreground,
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            )}
          />
        ))}
      </View>
      <ErrorText message={errors.gender?.message} />

      <Controller
        control={control}
        name="dob"
        render={({ field: { onChange, value } }) => (
          <FormTextInput
            label="Date of birth"
            placeholder="YYYY-MM-DD"
            value={value}
            onChangeText={onChange}
            keyboardType="numbers-and-punctuation"
            error={errors.dob?.message}
            containerStyle={{ width: '100%' }}
          />
        )}
      />

      <FieldLabel text="Disciplines" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
        {disciplineOptions.map((discipline) => {
          const isActive = selectedDisciplines.includes(discipline);
          return (
            <Pressable
              key={discipline}
              onPress={() => toggleDiscipline(discipline)}
              style={{
                paddingVertical: spacing.sm,
                paddingHorizontal: spacing.md,
                borderRadius: radii.md,
                borderWidth: 1,
                borderColor: isActive ? palette.primary : palette.border,
                backgroundColor: isActive ? palette.primary : palette.card,
              }}
            >
              <Text
                style={{
                  color: isActive ? palette.primaryForeground : palette.foreground,
                }}
              >
                {discipline}
              </Text>
            </Pressable>
          );
        })}
      </View>
      <ErrorText message={errors.disciplines?.message} />

      <Controller
        control={control}
        name="weightClass"
        render={({ field: { onChange, value } }) => (
          <View style={{ gap: spacing.xs }}>
            <FieldLabel text="Weight class" />
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: spacing.sm }}>
              {weightClasses.map((weight) => {
                const isActive = value === weight;
                return (
                  <Pressable
                    key={weight}
                    onPress={() => onChange(weight)}
                    style={{
                      paddingVertical: spacing.sm,
                      paddingHorizontal: spacing.md,
                      borderRadius: radii.md,
                      borderWidth: 1,
                      borderColor: isActive ? palette.primary : palette.border,
                      backgroundColor: isActive ? palette.primary : palette.card,
                    }}
                  >
                    <Text
                      style={{
                        color: isActive ? palette.primaryForeground : palette.foreground,
                      }}
                    >
                      {weight}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
            <ErrorText message={errors.weightClass?.message} />
          </View>
        )}
      />

      <FieldLabel text="Experience level" />
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        {experienceOptions.map((option) => (
          <Controller
            key={option.value}
            control={control}
            name="experienceLevel"
            render={({ field: { onChange, value } }) => (
              <Pressable
                onPress={() => onChange(option.value)}
                style={{
                  paddingVertical: spacing.sm,
                  paddingHorizontal: spacing.md,
                  borderRadius: radii.md,
                  borderWidth: 1,
                  borderColor: value === option.value ? palette.primary : palette.border,
                  backgroundColor: value === option.value ? palette.primary : palette.card,
                }}
              >
                <Text
                  style={{
                    color: value === option.value ? palette.primaryForeground : palette.foreground,
                  }}
                >
                  {option.label}
                </Text>
              </Pressable>
            )}
          />
        ))}
      </View>
      <ErrorText message={errors.experienceLevel?.message} />

      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <Controller
          control={control}
          name="heightCm"
          render={({ field: { onChange, value } }) => (
            <FormTextInput
              label="Height (cm)"
              placeholder="e.g. 180"
              value={value?.toString() ?? ''}
              onChangeText={onChange}
              keyboardType="numeric"
              error={errors.heightCm && 'Enter a valid height'}
              containerStyle={{ flex: 1 }}
            />
          )}
        />
        <Controller
          control={control}
          name="reachCm"
          render={({ field: { onChange, value } }) => (
            <FormTextInput
              label="Reach (cm)"
              placeholder="e.g. 185"
              value={value?.toString() ?? ''}
              onChangeText={onChange}
              keyboardType="numeric"
              error={errors.reachCm && 'Enter a valid reach'}
              containerStyle={{ flex: 1 }}
            />
          )}
        />
      </View>

      <Text style={{ fontWeight: '600', color: palette.foreground }}>Amateur record</Text>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <RecordInput control={control} name="amateurWins" label="Wins" error={errors.amateurWins} />
        <RecordInput
          control={control}
          name="amateurLosses"
          label="Losses"
          error={errors.amateurLosses}
        />
        <RecordInput
          control={control}
          name="amateurDraws"
          label="Draws"
          error={errors.amateurDraws}
        />
      </View>

      <Text style={{ fontWeight: '600', color: palette.foreground }}>Pro record (optional)</Text>
      <View style={{ flexDirection: 'row', gap: spacing.sm }}>
        <RecordInput control={control} name="proWins" label="Wins" error={errors.proWins} />
        <RecordInput control={control} name="proLosses" label="Losses" error={errors.proLosses} />
        <RecordInput control={control} name="proDraws" label="Draws" error={errors.proDraws} />
      </View>

      <Controller
        control={control}
        name="gymAffiliation"
        render={({ field: { onChange, value } }) => (
          <FormTextInput
            label="Gym affiliation (optional)"
            placeholder="Enter your home gym"
            value={value ?? ''}
            onChangeText={onChange}
            containerStyle={{ width: '100%' }}
          />
        )}
      />

      <Controller
        control={control}
        name="bio"
        render={({ field: { onChange, value } }) => (
          <FormTextInput
            label="Bio"
            placeholder="Share your style, accomplishments, goals..."
            value={value ?? ''}
            onChangeText={onChange}
            multiline
            numberOfLines={4}
            error={errors.bio?.message}
            containerStyle={{ width: '100%' }}
          />
        )}
      />

      <Pressable
        onPress={handleSubmit((values) => mutation.mutate(values))}
        disabled={mutation.isPending}
        style={{
          marginTop: spacing.lg,
          paddingVertical: spacing.md,
          borderRadius: radii.lg,
          backgroundColor: mutation.isPending ? palette.muted : palette.primary,
          alignItems: 'center',
        }}
      >
        {mutation.isPending ? (
          <ActivityIndicator color={palette.primaryForeground} />
        ) : (
          <Text
            style={{
              color: palette.primaryForeground,
              fontSize: typography.h2.fontSize,
              fontWeight: typography.h2.fontWeight,
            }}
          >
            Save profile
          </Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const FieldLabel = ({ text }: { text: string }) => (
  <Text
    style={{
      fontSize: typography.h2.fontSize,
      fontWeight: typography.h2.fontWeight,
      color: colors.light.foreground,
    }}
  >
    {text}
  </Text>
);

const ErrorText = ({ message }: { message?: string }) => {
  if (!message) return null;
  return (
    <Text style={{ color: colors.light.destructive, fontSize: typography.caption.fontSize }}>
      {message}
    </Text>
  );
};

interface FormTextInputProps {
  label: string;
  placeholder?: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: 'default' | 'numeric' | 'numbers-and-punctuation';
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
}

function FormTextInput({
  label,
  placeholder,
  value,
  onChangeText,
  keyboardType = 'default',
  multiline,
  numberOfLines,
  error,
  containerStyle,
}: FormTextInputProps) {
  const palette = colors.light;
  return (
    <View style={[{ gap: spacing.xs }, containerStyle]}>
      <Text style={{ color: palette.foreground, fontWeight: '600' }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={{
          borderWidth: 1,
          borderColor: error ? palette.destructive : palette.border,
          borderRadius: radii.md,
          paddingVertical: spacing.sm,
          paddingHorizontal: spacing.md,
          backgroundColor: palette.card,
          color: palette.foreground,
          minHeight: multiline ? spacing.xl * 2 : undefined,
        }}
        placeholderTextColor={palette.mutedForeground}
      />
      <ErrorText message={error} />
    </View>
  );
}

interface RecordInputProps {
  control: any;
  name: keyof FormValues;
  label: string;
  error?: { message?: string };
}

function RecordInput({ control, name, label, error }: RecordInputProps) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value } }) => (
        <FormTextInput
          label={label}
          placeholder="0"
          value={value?.toString() ?? ''}
          onChangeText={onChange}
          keyboardType="numeric"
          error={error?.message}
          containerStyle={{ width: '30%' }}
        />
      )}
    />
  );
}
