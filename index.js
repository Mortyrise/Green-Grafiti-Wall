/**
 * 5×7 Pixel Font Matrix Word Generator
 * Node.js module for converting words to pixel matrices
 */

const { FONT_MATRIX, LETTER_WIDTH, LETTER_HEIGHT } = require('./font');

// Configuration
const SEPARATOR_WIDTH = 1;
const MAX_COLUMNS = 60; // Maximum width for GitHub graph

/**
 * Converts an uppercase word to a combined matrix
 * @param {string} word - Word in uppercase
 * @returns {Array<Array<number>>} Matrix of 7 rows × (5×N + spaces)
 */
function wordToMatrix(word) {
  if (typeof word !== 'string') {
    throw new Error('Input must be a string');
  }

  word = word.toUpperCase();

  // Validate that all letters exist in the font
  for (let char of word) {
    if (!FONT_MATRIX[char]) {
      throw new Error(`Letter '${char}' is not defined in the font`);
    }
  }

  const totalWidth = word.length * LETTER_WIDTH + (word.length - 1) * SEPARATOR_WIDTH;
  if (totalWidth > MAX_COLUMNS) {
    throw new Error(`Word "${word}" is too long for GitHub graph. Required width: ${totalWidth}, maximum allowed: ${MAX_COLUMNS}`);
  }

  // Create result matrix
  const result = [];
  for (let row = 0; row < LETTER_HEIGHT; row++) {
    result[row] = [];
  }

  // Process each letter
  for (let letterIndex = 0; letterIndex < word.length; letterIndex++) {
    const char = word[letterIndex];
    const letterMatrix = FONT_MATRIX[char];

    // Add letter to result matrix
    for (let row = 0; row < LETTER_HEIGHT; row++) {
      for (let col = 0; col < LETTER_WIDTH; col++) {
        result[row].push(letterMatrix[row][col]);
      }
    }

    // Add separator between letters (except after last letter)
    if (letterIndex < word.length - 1) {
      for (let row = 0; row < LETTER_HEIGHT; row++) {
        for (let sep = 0; sep < SEPARATOR_WIDTH; sep++) {
          result[row].push(0);
        }
      }
    }
  }

  return result;
}

/**
 * Prints a matrix to console in visual format
 * @param {Array<Array<number>>} matrix - Matrix to print
 * @param {string} word - Original word (for title)
 */
function printMatrix(matrix, word) {
  console.log(`\nMatrix for word "${word}":`);
  console.log('─'.repeat(matrix[0].length * 2 + 2));
  
  for (let row of matrix) {
    let line = '│';
    for (let cell of row) {
      line += cell ? '██' : '  ';
    }
    line += '│';
    console.log(line);
  }
  
  console.log('─'.repeat(matrix[0].length * 2 + 2));
  console.log(`Dimensions: ${matrix.length} rows × ${matrix[0].length} columns`);
}

// Export functions for module use
module.exports = {
  wordToMatrix,
  printMatrix,
  LETTER_WIDTH,
  LETTER_HEIGHT,
  SEPARATOR_WIDTH,
  MAX_COLUMNS
};

// Run example if file is executed directly
if (require.main === module) {
  try {
    // Get word from command line arguments
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
      console.log('Usage: node index.js <word>');
      console.log('Example: node index.js HELLO');
      console.log('Example: node index.js "HELLO WORLD"');
      process.exit(1);
    }
    
    const word = args.join(' ').toUpperCase();
    const matrix = wordToMatrix(word);
    printMatrix(matrix, word);
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}