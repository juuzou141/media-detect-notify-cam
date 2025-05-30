
import React from 'react';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';

interface ProgressTrackerProps {
  percentage: number;
  stage: string;
  isComplete: boolean;
  hasError?: boolean;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  percentage,
  stage,
  isComplete,
  hasError = false
}) => {
  const getStatusIcon = () => {
    if (hasError) {
      return <AlertCircle className="w-6 h-6 text-red-500" />;
    }
    if (isComplete) {
      return <CheckCircle className="w-6 h-6 text-green-500" />;
    }
    return <Clock className="w-6 h-6 text-blue-500 animate-spin" />;
  };

  const getProgressColor = () => {
    if (hasError) return 'bg-red-500';
    if (isComplete) return 'bg-green-500';
    return 'bg-blue-500';
  };

  return (
    <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-white/20 p-6 shadow-lg">
      <div className="flex items-center space-x-4 mb-4">
        {getStatusIcon()}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800">Processing Video</h3>
          <p className="text-sm text-gray-600">{stage}</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-gray-800">{percentage}%</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div
          className={`h-full transition-all duration-500 ease-out ${getProgressColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>

      {/* Processing Stages */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {['Upload', 'Analysis', 'Detection', 'Complete'].map((step, index) => {
          const stepPercentage = (index + 1) * 25;
          const isActive = percentage >= stepPercentage;
          const isCurrent = percentage >= stepPercentage - 25 && percentage < stepPercentage;

          return (
            <div
              key={step}
              className={`text-center p-2 rounded-lg text-xs font-medium transition-colors ${
                isActive
                  ? 'bg-blue-100 text-blue-800'
                  : isCurrent
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-500'
              }`}
            >
              {step}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressTracker;
