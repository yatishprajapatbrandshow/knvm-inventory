import React, { useEffect } from 'react';

const ErrorBox = ({ errors, setErrors, duration = 5000 }) => {
  useEffect(() => {
    if (errors.length > 0) {
      const timer = setTimeout(() => {
        setErrors([]);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [errors, setErrors, duration]);

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[100] ${
        errors.length === 0 ? 'hidden' : 'flex'
      }`}
    >
      <div className="relative  w-full max-w-md rounded border border-red-400 bg-red-100 p-4 text-red-700 shadow-lg">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-semibold">Errors</h2>
          <button
            className="text-red-700 hover:text-red-900"
            onClick={() => setErrors([])}
          >
            {/* &times; */}
            X
          </button>
        </div>
        <ul className="list-inside list-disc">
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ErrorBox;
