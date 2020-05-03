const formatValue = (value: number): string =>
  Intl.NumberFormat([], {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

export default formatValue;
