import { useState, useCallback } from 'react';
import { SetorResultado, ResultadosData } from '../types';

export function useSetorResultados() {
  const [setoresResultados, setSetoresResultados] = useState<SetorResultado[]>(
    []
  );

  const atualizarResultados = useCallback(
    (setor: string, resultados: ResultadosData) => {
      setSetoresResultados((prev) => {
        const index = prev.findIndex((item) => item.setor === setor);
        if (index >= 0) {
          const newResults = [...prev];
          newResults[index] = { setor, resultados };
          return newResults;
        }
        return [...prev, { setor, resultados }];
      });
    },
    []
  );

  const limparResultados = useCallback(() => {
    setSetoresResultados([]);
  }, []);

  return {
    setoresResultados,
    atualizarResultados,
    limparResultados,
  };
}
