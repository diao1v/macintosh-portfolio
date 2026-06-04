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

/**
 * Produce a stable, cosmetic "disk space" string for a folder.
 *
 * The original implementation used Math.random() on every open, so a folder's
 * reported size changed each time it was reopened. This derives a deterministic
 * value from the file id (a simple string hash) combined with its child count,
 * so each folder always shows the same size while still looking varied.
 *
 * @param id Stable file identifier
 * @param childCount Number of items in the folder
 * @returns Disk space formatted to 2 decimals (e.g. "4.27")
 */
export const getDiskSpace = (id: string, childCount: number): string => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }

  // Map the hash to a per-item factor in [0.5, 2.5), mirroring the old range.
  const factor = 0.5 + (hash % 2000) / 1000;

  return (childCount * factor).toFixed(2);
};
