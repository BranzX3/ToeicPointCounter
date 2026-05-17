// Standard approximate TOEIC score conversion tables
// Index is the raw score (0-100), Value is the scaled score (5-495)

const generateListeningTable = () => {
  const table = new Array(101).fill(5);
  // Approximate mapping based on standard TOEIC conversion charts
  for (let i = 7; i <= 100; i++) {
    if (i <= 10) table[i] = 10 + (i - 7) * 5;
    else if (i <= 25) table[i] = 30 + (i - 11) * 5;
    else if (i <= 39) table[i] = 110 + (i - 26) * 5;
    else if (i <= 54) table[i] = 185 + (i - 40) * 5;
    else if (i <= 70) table[i] = 265 + (i - 55) * 5;
    else if (i <= 85) table[i] = 350 + (i - 71) * 5;
    else if (i <= 95) table[i] = 430 + (i - 86) * 5;
    else if (i <= 100) table[i] = 475 + (i - 96) * 5;
  }
  // Cap at 495
  for (let i = 0; i <= 100; i++) {
    if (table[i] > 495) table[i] = 495;
    if (i >= 98) table[i] = 495; // Usually 98-100 is 495
  }
  return table;
};

const generateReadingTable = () => {
  const table = new Array(101).fill(5);
  for (let i = 10; i <= 100; i++) {
    if (i <= 25) table[i] = 15 + (i - 10) * 5;
    else if (i <= 39) table[i] = 95 + (i - 26) * 5;
    else if (i <= 54) table[i] = 165 + (i - 40) * 5;
    else if (i <= 70) table[i] = 245 + (i - 55) * 5;
    else if (i <= 85) table[i] = 330 + (i - 71) * 5;
    else if (i <= 95) table[i] = 410 + (i - 86) * 5;
    else if (i <= 100) table[i] = 465 + (i - 96) * 5;
  }
  // Cap at 495
  for (let i = 0; i <= 100; i++) {
    if (table[i] > 495) table[i] = 495;
    if (i >= 99) table[i] = 495; 
  }
  return table;
};

export const listeningScores = generateListeningTable();
export const readingScores = generateReadingTable();

export const calculateScore = (listeningRaw, readingRaw) => {
  const lScore = listeningScores[Math.min(100, Math.max(0, listeningRaw))];
  const rScore = readingScores[Math.min(100, Math.max(0, readingRaw))];
  return {
    listening: lScore,
    reading: rScore,
    total: lScore + rScore
  };
};
