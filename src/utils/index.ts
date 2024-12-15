export type UserMessageCount = {
  [name: string]: number
}

const IGNORE_STRINGS = ['created group', 'added '] as const

export function validateWhatsappExport(content: string) {
  const newlineIndex = content.indexOf('\n')
  const firstLine = newlineIndex !== -1 ? content.substring(0, newlineIndex) : content
  if (!firstLine) return { isValid: false, err: 'Empty file contents.' }
  // This checks for chat export patterns of 12hr format with AM/PM and 24 hr format
  const exportedLinePattern = /^\d{2}\/\d{2}\/\d{2}, \s*\d{1,2}:\d{2}\s*([APap][mM])?\s*-\s*.+$/
  const isValid = exportedLinePattern.test(firstLine)
  debugger
  if (!isValid) return { isValid, err: 'The file contents are in an incorrect format' }
  return { isValid: true, err: '' }
}

function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/').map(Number)
  return new Date(year + 2000, month - 1, day) // Add 2000 to year to avoid centuries ambiguity
}

/** Keep `minDate` in dd/mm/yy format */
export function calculateUserChatCounts(fileContent: string, minDate?: Date): UserMessageCount {
  const lines = fileContent.split('\n') // Split file content into lines

  const userMessageCount = lines.reduce<UserMessageCount>((countMap, line) => {
    const matchDate = line.match(/^(\d{2}\/\d{2}\/\d{2})/)
    const match = line.match(/ - (.+?): /) // Match lines with the pattern `- <name>:`

    if (!match || !match[1] || !matchDate || !matchDate[1]) return countMap // Skip messages earlier than minDate
    const messageDate = parseDate(matchDate[1])

    if (minDate && messageDate < minDate) return countMap

    const userName = match[1].trim()
    if (IGNORE_STRINGS.some((str) => userName.includes(str))) return countMap

    countMap[userName] = (countMap[userName] || 0) + 1 // Increment user's message count
    return countMap
  }, {})

  return userMessageCount
}
