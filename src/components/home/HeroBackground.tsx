import React from 'react';

export const HeroBackground = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-background bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
      <div className="absolute left-0 right-0 top-0 h-full w-full bg-[radial-gradient(circle_800px_at_50%_200px,#d5c5ff55,transparent)]"></div>
    </div>
  );
};
