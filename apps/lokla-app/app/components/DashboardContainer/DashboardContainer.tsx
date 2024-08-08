import React from 'react';

const DashboardContainer = (props: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-row min-h-screen">
      <div className="w-64 bg-green-900"></div>
      <div className="flex-1 p-4">{props.children}</div>
    </div>
  );
};

export default DashboardContainer;
