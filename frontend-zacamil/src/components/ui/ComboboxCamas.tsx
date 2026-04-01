import React, { useState, useRef, useEffect } from 'react';
import apiClient from '../../api/axiosClient';

interface CamaOption {
  value: string;
  label: string;
}

interface ComboboxCamasProps {
  value: string;
  onChange: (value: string) => void;
}

export const ComboboxCamas: React.FC<ComboboxCamasProps> = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [options, setOptions] = useState<CamaOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchCamas = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Hacemos el request usando nuestro cliente centralizado apuntando al API Gateway
        const response = await apiClient.get('/consultas/camas/disponibilidad', {
          signal: controller.signal
        });
        const data = response.data;
        
        console.log("Respuesta de Cosmos DB (Raw Axios Data):", data);

        // 🛡️ Programación defensiva para descubrir dónde viene el Array
        let camasArray = [];
        if (Array.isArray(data)) {
            camasArray = data;
        } else if (data && Array.isArray(data.content)) {
            camasArray = data.content;
        } else if (data && data._embedded) {
            // Spring Data REST o HATEOAS suele meterlo acá (ej: _embedded.camaViews)
            const firstKey = Object.keys(data._embedded)[0]; 
            camasArray = data._embedded[firstKey] || [];
        } else if (data && Array.isArray(data.data)) {
            camasArray = data.data;
        }

        if (!Array.isArray(camasArray)) {
            console.error("❌ Array de camas no encontrado o estructura desconocida:", data);
            if (!controller.signal.aborted) {
                setOptions([]); // Mantenemos el componente vivo vacío
                setIsLoading(false);
            }
            return;
        }

        // Filtramos las camas que NO están disponibles (podemos dar de alta a pacientes en ellas)
        // Y las mapeamos al formato requerido por nuestro dropdown
        const camasOcupadas = camasArray
          .filter((cama: any) => cama.estado !== 'DISPONIBLE')
          .map((cama: any) => ({
            value: cama.numeroCama,
            label: `Cama ${cama.numeroCama} - ${cama.estado} (Paciente: ${cama.pacienteActual || 'Desconocido'})`
          }));

        if (!controller.signal.aborted) {
            setOptions(camasOcupadas);
            setIsLoading(false);
        }
      } catch (err: any) {
        if (err.name === 'CanceledError') {
            console.log("Petición de camas cancelada (componente desmontado).");
        } else if (!controller.signal.aborted) {
            console.error("Error cargando camas desde Cosmos DB:", err);
            setError("Error de red");
            setIsLoading(false);
        }
      }
    };

    fetchCamas();

    return () => {
      controller.abort();
    };
  }, []);

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
          placeholder={isLoading ? "Buscando camas ocupadas..." : error ? "No se pudieron cargar las camas" : "Buscar cama o paciente..."}
          value={isOpen ? query : (options.find(o => o.value === value)?.label || '')}
          disabled={isLoading || error !== null}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            if (e.target.value === '') {
                onChange(''); // Clear the selected value correctly
            }
          }}
          onFocus={() => {
            setQuery('');
            setIsOpen(true);
          }}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400">
           {isLoading ? (
             <svg className="animate-spin h-4 w-4 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
             </svg>
           ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
           )}
        </div>
      </div>

      {isOpen && !isLoading && !error && (
        <ul className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm animate-in fade-in slide-in-from-top-2 duration-200">
          {filteredOptions.length === 0 ? (
            <li className="relative cursor-default select-none py-2 px-4 text-gray-500 italic">
              No se encontraron camas ocupadas en el historial.
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
