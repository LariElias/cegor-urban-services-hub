
import React from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, Send, Calendar } from 'lucide-react';

interface TimelineItemProps {
  date: string;
  title: string;
  description: string;
  status: 'completed' | 'pending' | 'cancelled' | 'current';
  isLast?: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ 
  date, 
  title, 
  description, 
  status, 
  isLast = false 
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'current':
        return <Clock className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed':
        return 'border-green-500';
      case 'cancelled':
        return 'border-red-500';
      case 'current':
        return 'border-blue-500';
      default:
        return 'border-gray-300';
    }
  };

  return (
    <div className="flex items-start space-x-4 pb-6 relative">
      {/* Linha vertical */}
      {!isLast && (
        <div className="absolute left-2.5 top-8 w-0.5 h-full bg-gray-200" />
      )}
      
      {/* Ícone */}
      <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 ${getStatusColor()} bg-white flex items-center justify-center z-10`}>
        {getStatusIcon()}
      </div>
      
      {/* Conteúdo */}
      <div className="flex-grow min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-sm font-medium text-gray-900">{title}</h4>
          <span className="text-xs text-gray-500">
            {new Date(date).toLocaleDateString('pt-BR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default TimelineItem;
