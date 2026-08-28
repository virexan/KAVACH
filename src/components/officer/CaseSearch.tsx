import React, { useEffect, useState } from 'react';
import Input from '../ui/Input';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export const CaseSearch: React.FC<Props> = ({ value, onChange }) => {
  const [innerVal, setInnerVal] = useState(value);

  useEffect(() => {
    setInnerVal(value);
  }, [value]);

  useEffect(() => {
    const handler = setTimeout(() => {
      onChange(innerVal);
    }, 300); // 300ms debounce
    return () => clearTimeout(handler);
  }, [innerVal, onChange]);

  return (
    <div className="w-full select-none animate-fadeIn">
      <Input
        label="Search Cases"
        placeholder="Search by ID or Unit..."
        value={innerVal}
        onChange={(e) => setInnerVal(e.target.value)}
        type="search"
      />
    </div>
  );
};
export default CaseSearch;
