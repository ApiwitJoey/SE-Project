import React from 'react';

interface InputFormProps {
  onInputChange: (value: string) => void;
  labelText: string;
  type?: string;
  inputClass?: string;
}

const InputForm = ({
  onInputChange,
  labelText,
  type,
  inputClass = "",
}: InputFormProps) => {
  return (
    <div>
      <label htmlFor={labelText} className="block text-sm font-medium text-emerald-700">
        {labelText}
      </label>
      <div className="mt-1">
        <input
          id={labelText}
          name={labelText}
          type={type || (labelText.toLowerCase().includes("password") ? "password" : "text")}
          required
          className={`block w-full rounded-lg border border-emerald-300 px-3 py-2 text-emerald-900 shadow-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 ${inputClass}`}
          onChange={(e) => onInputChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default InputForm;
