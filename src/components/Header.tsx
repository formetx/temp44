
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="france-inter-bg text-white p-6 rounded-lg shadow-md">
      <div className="container mx-auto flex flex-col items-center text-center">
        <h1 className="darwin-font text-3xl md:text-4xl font-bold mb-2">
          Sur les épaules de Darwin
        </h1>
        <p className="text-lg opacity-90 max-w-2xl">
          Miroir local du podcast de Jean-Claude Ameisen sur France Inter
        </p>
      </div>
    </header>
  );
};

export default Header;
