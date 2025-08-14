import { GameState } from '@/lib/types';
import styles from './FeedbackBanner.module.scss';

interface FeedbackBannerProps {
  feedback: GameState['feedback'];
  show: boolean;
}

const getFeedbackIcon = (type: string): string => {
  switch (type) {
    case 'correct':
      return '🎉';
    case 'incorrect':
    case 'retry':
      return '🤔';
    case 'revealed':
      return '💡';
    default:
      return '';
  }
};

const getFeedbackClass = (type: string): string => {
  switch (type) {
    case 'correct':
      return 'success';
    case 'incorrect':
    case 'retry':
      return 'warning';
    case 'revealed':
      return 'info';
    default:
      return 'default';
  }
};

export default function FeedbackBanner({ feedback, show }: FeedbackBannerProps) {
  if (!show || !feedback.type || !feedback.message) {
    return null;
  }

  const feedbackClass = getFeedbackClass(feedback.type);
  const icon = getFeedbackIcon(feedback.type);

  return (
    <div 
      className={`${styles.banner} ${styles[feedbackClass]}`}
      role="alert"
      aria-live="polite"
    >
      <div className={styles.content}>
        {icon && (
          <span className={styles.icon} aria-hidden="true">
            {icon}
          </span>
        )}
        <span className={styles.message}>
          {feedback.message}
        </span>
      </div>
    </div>
  );
}
