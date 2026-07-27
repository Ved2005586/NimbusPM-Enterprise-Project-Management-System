// Design tokens for Nimbus — kept separate from the MUI theme so both the
// MUI theme and any raw CSS/inline styles can reference the same values.

export const colors = {
  // Neutrals — a graphite/slate scale, not pure black/white
  ink: '#12141C',        // near-black text / dark surface base
  slate900: '#1A1D29',
  slate800: '#242838',
  slate700: '#343B52',
  slate500: '#6B7290',
  slate300: '#B8BDD1',
  slate100: '#E7E9F2',
  paper: '#FBFBFE',
  paperDark: '#1E2130',

  // Signature accent — Signal Indigo. Used sparingly: primary actions,
  // active nav state, the brand mark.
  signal: '#5B5FEF',
  signalDark: '#4347C4',
  signalTint: '#EEEEFC',

  // Status-coded kanban / priority colors — these carry real meaning
  // (they mirror the task's actual state), not decoration.
  backlog: '#8B93A7',
  todo: '#3B82F6',
  inProgress: '#F59E0B',
  testing: '#A855F7',
  done: '#22C55E',

  priorityLowest: '#8B93A7',
  priorityLow: '#3B82F6',
  priorityMedium: '#F59E0B',
  priorityHigh: '#F97316',
  priorityHighest: '#EF4444',

  danger: '#EF4444',
  warning: '#F59E0B',
  success: '#22C55E',
};

export const fonts = {
  display: '"Sora", "Inter", sans-serif',
  body: '"Inter", sans-serif',
  mono: '"JetBrains Mono", monospace',
};

export const statusMeta = {
  BACKLOG: { label: 'Backlog', color: colors.backlog },
  TODO: { label: 'To Do', color: colors.todo },
  IN_PROGRESS: { label: 'In Progress', color: colors.inProgress },
  TESTING: { label: 'Testing', color: colors.testing },
  DONE: { label: 'Done', color: colors.done },
};

export const priorityMeta = {
  LOWEST: { label: 'Lowest', color: colors.priorityLowest },
  LOW: { label: 'Low', color: colors.priorityLow },
  MEDIUM: { label: 'Medium', color: colors.priorityMedium },
  HIGH: { label: 'High', color: colors.priorityHigh },
  HIGHEST: { label: 'Highest', color: colors.priorityHighest },
};
