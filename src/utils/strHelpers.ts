export type UserMessageCount = {
  [name: string]: number
}

const IGNORE_STRINGS = ['created group', 'added you to a group in the community'] as const

export function validateWhatsappExport(content: string) {
  const newlineIndex = content.indexOf('\n')
  const firstLine = newlineIndex !== -1 ? content.substring(0, newlineIndex) : content
  if (!firstLine) return { isValid: false, err: 'Empty file contents.' }
  // This checks for chat export patterns of 12hr format with AM/PM and 24 hr format
  const exportedLinePattern = /^\d{2}\/\d{2}\/\d{2}, \s*\d{1,2}:\d{2}\s*([APap][mM])?\s*-\s*.+$/
  const isValid = exportedLinePattern.test(firstLine)
  if (!isValid) return { isValid, err: 'The file contents are in an incorrect format' }
  return { isValid: true, err: '' }
}

function parseDate(dateStr: string): Date {
  const [day, month, year] = dateStr.split('/').map(Number)
  return new Date(year + 2000, month - 1, day) // Add 2000 to year to avoid centuries ambiguity
}

/** Keep `minDate` in dd/mm/yy format */
export function calculateUserChatCounts(
  fileContent: string,
  minDate?: Date | null,
  maxDate?: Date | null,
  filterStr?: string,
): UserMessageCount {
  // This is done to ignore the time component set from the date component
  const normalizedMinDate = minDate
    ? new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
    : null
  const normalizedMaxDate = maxDate
    ? new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate())
    : null

  /**
   * Regular expression for identifying WhatsApp message boundaries.
   * The regex uses a positive lookahead to effectively segment messages based on the typical format:
   * `dd/mm/yy, HH:MM - Name:` or `dd/mm/yy, hh:mm AM/PM - Name:`
   *
   * (?=                         : Positive lookahead ensures matching the following pattern.
   *   \d{2}\/\d{2}\/\d{2},      : Date in dd/mm/yy format followed by a comma, Eg `16/12/24,`.
   *   \s*                       : Optional whitespace after the comma.
   *   \d{1,2}:\d{2}             : Time in HH:MM or H:MM format, matches both 24-hour and 12-hour clocks.
   *   (?:\s*[APap][Mm])?        : Non-capturing group for optional AM/PM or am/pm, with possible leading whitespace.
   *   \s*-                      : Optional whitespace and dash separator.
   *   \s*                       : Optional whitespace after the dash.
   *   .+?                       : Lazily matches any character(s) representing the name before the colon.
   *   :                         : Literal colon marking the end of name and beginning of message text.
   * )
   */
  const messagePattern = /(?=\d{2}\/\d{2}\/\d{2},\s*\d{1,2}:\d{2}(?:\s*[APap][Mm])?\s*-\s*.+?:)/g
  // Split the content based on the pattern
  const lines = fileContent.split(messagePattern)

  const userMessageCount: UserMessageCount = {}
  for (const line of lines) {
    const matchDate = line.match(/^(\d{2}\/\d{2}\/\d{2})/)
    const matchName = line.match(/ - (.+?): /) // Match lines with the pattern `- <name>:`

    if (!matchName || !matchName[1] || !matchDate || !matchDate[1]) continue

    const messageDate = parseDate(matchDate[1])
    if (normalizedMinDate && messageDate < normalizedMinDate) continue
    if (normalizedMaxDate && messageDate > normalizedMaxDate) continue

    const userName = matchName[1].trim()
    if (IGNORE_STRINGS.some((str) => userName.includes(str))) continue

    if (filterStr && !new RegExp(filterStr, 'i').test(line)) continue

    // Increment user's message count
    userMessageCount[userName] = (userMessageCount[userName] || 0) + 1
  }

  return userMessageCount
}
