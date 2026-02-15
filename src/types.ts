import { LucideIcon } from 'lucide-react';

export interface FeatureProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface StepProps {
  number: string;
  title: string;
  description: string;
  isLast?: boolean;
}
