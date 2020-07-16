import { useEffect, useRef } from "react"

export const useClickOutside = (
  setToggle: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const node = useRef() as React.MutableRefObject<any>

  function handleClick(e: MouseEvent) {
    if (!node.current.contains(e.target)) {
      setToggle(false)
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClick)
    document.addEventListener("contextmenu", handleClick)

    return () => {
      document.removeEventListener("click", handleClick)
      document.removeEventListener("contextmenu", handleClick)
    }
  }, [])

  return node
}
