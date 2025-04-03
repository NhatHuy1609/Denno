import { useRouter, usePathname, useSearchParams} from "next/navigation"
import { useState, useCallback, useEffect } from "react"
import { attempt, withFallback } from "@/utils/attempt"

const parseValue = <T>(value: any): T => 
  withFallback(
    attempt(() => JSON.parse(value) as T),
    value as T
  )

export const useQueryParamState = <T extends number | string>(
  key: string,
  defaultValue: T
) => {
  const [value, setValue] = useState<T>(defaultValue);

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const paramValue = searchParams.get(key);
    if (paramValue !== null) {
      const newValue = parseValue<T>(paramValue);
      if (newValue !== value) {
        setValue(newValue);
      }
    }
  }, [searchParams, key, value]);

  const onChange = useCallback(
    (newValue: T) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(key, String(newValue))

      router.push(`${pathname}?${params.toString()}`)
    },
    [key, pathname, searchParams, router]
  )

  return [value, onChange] as const
}
