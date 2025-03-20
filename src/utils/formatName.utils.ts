/**
 * Format icon name for multi-line display
 * @param name Original text to format
 * @param maxLength Maximum characters per line
 * @returns Array of lines, where each line doesn't exceed maxLength and no words are broken
 */
export const formatName = (name: string, maxLength: number): string[] => {
  if (name.length <= maxLength) return [name];

  const words = name.split(' ');

  if (words.length === 1) return [name];

  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    const testLine = currentLine.length === 0 ? word : `${currentLine} ${word}`;

    if (testLine.length <= maxLength) {
      currentLine = testLine;
    } else {
      if (currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        lines.push(word);
        currentLine = '';
      }
    }
  }

  if (currentLine.length > 0) {
    lines.push(currentLine);
  }

  return lines;
};
