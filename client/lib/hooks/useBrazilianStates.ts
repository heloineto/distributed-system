import { useMemo } from 'react';

const useBrazilianStates = () => {
  const brazilianStates = useMemo(
    () => [
      { name: 'Acre', abbr: 'AC' },
      { name: 'Alagoas', abbr: 'AL' },
      { name: 'Amazonas', abbr: 'AM' },
      { name: 'Amapá', abbr: 'AP' },
      { name: 'Bahia', abbr: 'BA' },
      { name: 'Ceará', abbr: 'CE' },
      { name: 'Distrito Federal', abbr: 'DF' },
      { name: 'Espírito Santo', abbr: 'ES' },
      { name: 'Goiás', abbr: 'GO' },
      { name: 'Maranhão', abbr: 'MA' },
      { name: 'Minas Gerais', abbr: 'MG' },
      { name: 'Mato Grosso do Sul', abbr: 'MS' },
      { name: 'Mato Grosso', abbr: 'MT' },
      { name: 'Pará', abbr: 'PA' },
      { name: 'Paraíba', abbr: 'PB' },
      { name: 'Pernambuco', abbr: 'PE' },
      { name: 'Piauí', abbr: 'PI' },
      { name: 'Paraná', abbr: 'PR' },
      { name: 'Rio de Janeiro', abbr: 'RJ' },
      { name: 'Rio Grande do Norte', abbr: 'RN' },
      { name: 'Rondônia', abbr: 'RO' },
      { name: 'Roraima', abbr: 'RR' },
      { name: 'Rio Grande do Sul', abbr: 'RS' },
      { name: 'Santa Catarina', abbr: 'SC' },
      { name: 'Sergipe', abbr: 'SE' },
      { name: 'São Paulo', abbr: 'SP' },
      { name: 'Tocantins', abbr: 'TO' },
    ],
    []
  );

  return brazilianStates;
};

export default useBrazilianStates;
