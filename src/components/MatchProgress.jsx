import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const MatchProgress = ({ percentage, size = 120 }) => {
  const getColor = (value) => {
    if (value >= 80) return '#10b981';
    if (value >= 60) return '#3b82f6';
    if (value >= 40) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div style={{ width: size, height: size }}>
      <CircularProgressbar
        value={percentage}
        text={`${percentage}%`}
        styles={buildStyles({
          pathColor: getColor(percentage),
          textColor: '#fff',
          trailColor: 'rgba(255, 255, 255, 0.1)',
          textSize: '20px',
          pathTransitionDuration: 1,
        })}
      />
    </div>
  );
};

export default MatchProgress;
