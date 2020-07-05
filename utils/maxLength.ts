export const maxLength = (str: string, len = 30) => {
  if (str?.length > len) {
    return str.slice(0, len) + "..."
  }
  return str
}
