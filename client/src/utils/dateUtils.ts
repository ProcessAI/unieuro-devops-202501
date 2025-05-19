// formata “01031990” → “01/03/1990”
export function formatDate(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 8);
  return digits
    .replace(/^(\d{2})(\d)/, '$1/$2')
    .replace(/^(\d{2}\/\d{2})(\d)/, '$1/$2')
    .replace(/^(\d{2}\/\d{2}\/\d{4}).*/, '$1');
}

// valida DD/MM/AAAA
export function validateDate(value: string) {
  const [d, m, y] = value.split('/');
  if (!d || !m || !y) return false;
  const day = parseInt(d, 10),
        month = parseInt(m, 10) - 1,
        year = parseInt(y, 10);
  const date = new Date(year, month, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
  );
}

// "31/12/1990" → "1990-12-31"  (string ISO curta)
export function toISODate(brDate: string) {
  const [d, m, y] = brDate.split('/');
  if (d && m && y) return `${y}-${m.padStart(2, '0')}-${d.padStart(2, '0')}`;
  throw new Error('Formato de data inválido');
}