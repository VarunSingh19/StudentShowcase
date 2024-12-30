export interface Step {
  title: string;
  description: string;
  image: string;
}

export interface Theme {
  primary: string;
  secondary: string;
  text: string;
  border: string;
  success: string;
  error: string;
}

export interface StepsFlowProps {
  steps: Step[];
  theme?: Partial<Theme>;
  onComplete?: () => void;
  allowEditing?: boolean;
  showConfetti?: boolean;
}
