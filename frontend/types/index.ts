export interface Exercise {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  icon?: string;
  exercises: Exercise[];
}

export interface WorkoutSet {
  id: number;
  weight: string;
  reps: string;
  completed: boolean;
  isNew?: boolean;
}

export interface WorkoutSetDTO {
  id: number;
  weight: number;
  reps: number;
  exerciseName: string;
  exerciseId: number;
  date: string;
}

export interface WorkoutSessionDTO {
  id: number;
  date: string;
  sets: WorkoutSetDTO[];
}

export interface LogSet {
  weight: number;
  reps: number;
}

export interface LogEntry {
  date: string;
  totalVolume: number;
  sets: LogSet[];
}

export interface HeaderProps {
  exerciseName: string;
  onFinish: () => void;
}

export interface ActiveWorkoutProps {
  sets: WorkoutSet[];
  onAddSet: () => void;
  onUpdateSet: (id: number, field: 'weight' | 'reps', value: string) => void;
  onSaveSet: (id: number) => void;
  onDeleteSet: (id: number) => void;
}

export interface SidebarStatsProps {
  exerciseId: string;
  currentSets: WorkoutSet[];
}

export interface CategoryCardProps {
  category: Category;
  isOpen: boolean;
  onDelete: (id: number) => void;
  onEdit: (category: Category) => void;
}

export interface ExerciseListProps {
  exercises: Exercise[];
  onDeleteExercise: (id: number) => Promise<{ success: boolean; error?: string }>;
  onEditExercise: (exercise: Exercise) => void;
}

export interface EditNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (newName: string) => void;
  initialName: string;
  title: string;
}

export interface EditTarget {
  id: number;
  name: string;
  type: 'category' | 'exercise';
}
