import * as z from "zod";

export const slotSchema = z.object({
  name: z.string().min(1, "Slot name is required"),
  hours: z
    .number()
    .min(0, "Hours must be 0 or greater")
    .max(24, "Hours cannot exceed 24"),
});

export const onboardingFormSchema = z.object({
  desiredSleepHours: z
    .number()
    .min(0, "Sleep hours must be 0 or greater")
    .max(24, "Sleep hours cannot exceed 24"),
  slots: z.array(slotSchema),
  version: z.string(),
});

export type OnboardingFormData = z.infer<typeof onboardingFormSchema>;

export const studySlotSchema = z.object({
  name: z.string().min(1, "Slot name is required"),
  hours: z
    .number()
    .min(0.5, "Study time must be at least 30 minutes")
    .max(24, "Study time cannot exceed 24 hours"),
});

export const scheduleSchema = z.object({
  versionName: z
    .string()
    .min(1, "Version name is required")
    .max(50, "Version name must be 50 characters or less"),
  desiredSleepHours: z
    .number()
    .min(4, "Sleep hours must be at least 4")
    .max(12, "Sleep hours cannot exceed 12"),
  studySlots: z
    .array(studySlotSchema)
    .min(1, "At least one study slot is required"),
});

export type ScheduleFormData = z.infer<typeof scheduleSchema>;

export const dailyFormSchema = z.object({
  followedSchedule: z.enum(["yes", "no"]),
  productivity: z.string().min(1, "Please select a productivity rating"),
  tasksCompleted: z
    .number()
    .int()
    .min(0, "Tasks completed must be 0 or greater"),
  tasksPlanned: z.number().int().min(0, "Tasks planned must be 0 or greater"),
  sleptWell: z.enum(["yes", "no"]),
  distractions: z.enum(["yes", "no"]),
  distractionsList: z.string().optional(),
  mood: z.enum(["happy", "tired", "neutral", "stressed", "productive"]),
  hoursSlept: z.number().min(0, "Hours slept must be 0 or greater"),
  hoursWorked: z.array(z.object({ name: z.string(), hours: z.number() })),
  overWork: z.number().min(0),
});

export type DailyFormData = z.infer<typeof dailyFormSchema>;
