import React from 'react';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  title = "No Result Found", 
  description = "Your map pin list will show in here." 
}) => {
  return (
    <div className="w-[360px] h-auto flex flex-col items-center justify-center py-16">
      {/* Magnifying glass icon */}
      <div className="mb-5">
        <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z" fill="#89898A"/>
        </svg>
      </div>
      
      {/* Title */}
      <h3 className="text-lg font-medium text-gray-900 mb-2" style={{ height: '22px' }}>
        {title}
      </h3>
      
      {/* Description */}
      <p className="text-sm text-gray-500 text-center" style={{ height: '17px' }}>
        {description}
      </p>
    </div>
  );
};
