export type Order = 'asc' | 'desc';

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  const aVal = a[orderBy];
  const bVal = b[orderBy];
  
  const aComp = aVal instanceof Date ? aVal.getTime() : aVal;
  const bComp = bVal instanceof Date ? bVal.getTime() : bVal;
  
  if (bComp < aComp) return -1;
  if (bComp > aComp) return 1;
  return 0;
}

export function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): <T extends Record<Key, number | string | Date | null>>(a: T, b: T) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}