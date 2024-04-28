export function isLikeNumber(value?: string): boolean {
  if (!value)
    return false
  return !Number.isNaN(+value!)
}

export function isLikeBoolean(value?: string): boolean {
  if (!value)
    return false
  return value === 'true' || value === 'false'
}

export function getLikeType(value: string) {
  if (isLikeNumber(value))
    return 'number'

  if (isLikeBoolean(value))
    return 'boolean'

  return 'string'
}
