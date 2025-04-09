export const arrayToMap = <T extends { [key: string]: any }>(
  array: T[] | undefined,
  keyField: keyof T
): Map<string, T> => {
  return (
    array?.reduce((acc, item) => {
      acc.set(item[keyField], item)
      return acc
    }, new Map()) ?? new Map()
  )
}