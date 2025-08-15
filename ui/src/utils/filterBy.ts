export function filterBy<T>(
  items: T[],
  check: (val: T) => boolean
): T[] {
  return items.filter(item => check(item));
}