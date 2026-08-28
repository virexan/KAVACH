import React from 'react';
import Select from '../ui/Select';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export const ScopeSelector: React.FC<Props> = ({ value, onChange }) => {
  const options = [
    { label: 'All Authorized Units', value: 'ALL' },
    { label: 'Unit 7 (Active)', value: 'Unit 7' },
    { label: 'Unit 9 (Reserves)', value: 'Unit 9' },
  ];

  return (
    <div className="w-full sm:w-64 select-none animate-fadeIn">
      <Select
        label="Select Scope"
        options={options}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};
export default ScopeSelector;
