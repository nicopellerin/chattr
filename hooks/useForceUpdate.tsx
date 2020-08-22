import { useCallback, useState } from "react"

const useForceUpdate = () => {
  const [, forceUpdate] = useState()

  return useCallback(() => {
    forceUpdate((s: any) => !s)
  }, [])
}

export default useForceUpdate
