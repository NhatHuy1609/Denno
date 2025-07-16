export function includesBy<T>(
  items: T[], 
  check: (val: T) => boolean
): boolean {
  return items.some(item => check(item))
}