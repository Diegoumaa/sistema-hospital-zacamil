import React, { useState, useRef, useEffect } from 'react';

interface CamaOption {
  value: string;
  label: string;
}

const CAMAS_MOCK: CamaOption[] = [
  { value: '101', label: 'Cama 101 - Observación' },
  { value: '102', label: 'Cama 102 - Recuperación' },
  { value: '103', label: 'Cama 103 - Observación' },
  { value: '201', label: 'Cama 201 - Pediatría' },
  { value: '205', label: 'Cama 205 - Cuidados Intensivos' },
  { value: '301', label: 'Cama 301 - Maternidad' },
];

interface ComboboxCamasProps {
  value: string;
  onChange: (value: string) => void;
  options?: CamaOption[];
}

export const ComboboxCamas: React.FC<ComboboxCamasProps> = ({ value, onChange, options = CAMAS_MOCK }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selected = options.find(opt => opt.value === value);
    if (!isOpen) {
      if (selected) {
        setQuery(selected.label);
      } else {
        setQuery('');
      }
    }
  }, [value, options, isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = query === ''
    ? options
    : options.filter((cama) =>
        cama.label.toLowerCase().includes(query.toLowerCase()) || 
        cama.value.toLowerCase().includes(query.toLowerCase())
      );

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <input
          type="text"
          className="w-full rounded-md border border-gray-300 px-3 py-2.5 text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white transition-shadow pr-10"
          placeholder="Buscar cama por número o nombre de área..."
          value={isOpen ? query : (options.find(o => o.value === value)?.label || '')}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (e.target.value === '') {
                onChange(''); // Clear
            }
          }}
          onFocus={() => {
            setQuery('');
            setIsOpen(true);
          }}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
          </svg>
        </div>
      </div>

      {isOpen && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm animate-in fade-in slide-in-from-top-2 duration-200">
          {filteredOptions.length === 0 ? (
            <li className="relative cursor-default select-none py-2 px-4 text-gray-500 italic">
              No se encontraron camas.
            </li>
          ) : (
            filteredOptions.map((cama) => (
              <li
                key={cama.value}
                className={`relative cursor-pointer select-none py-2 pl-3 pr-9 transition-colors ${
                  value === cama.value ? 'bg-blue-50 text-blue-900 font-medium' : 'text-gray-900 hover:bg-slate-50'
                }`}
                onClick={() => {
                  onChange(cama.value);
                  setIsOpen(false);
                }}
              >
                <div className="flex flex-col">
                  <span>{cama.label}</span>
                </div>
                {value === cama.value && (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};
