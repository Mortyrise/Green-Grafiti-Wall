const { FONT_MATRIX, LETTER_WIDTH, LETTER_HEIGHT } = require('./font');

const SEPARATOR_WIDTH = 1;
const MAX_COLUMNS = 60;

function wordToMatrix(word) {
  if (typeof word !== 'string') {
    throw new Error('Input must be a string');
  }

  word = word.toUpperCase();

  for (let char of word) {
    if (!FONT_MATRIX[char]) {
      throw new Error(`Letter '${char}' is not defined in the font`);
    }
  }

  const totalWidth = word.length * LETTER_WIDTH + (word.length - 1) * SEPARATOR_WIDTH;
  if (totalWidth > MAX_COLUMNS) {
    throw new Error(`Word "${word}" is too long for GitHub graph. Required width: ${totalWidth}, maximum allowed: ${MAX_COLUMNS}`);
  }

  const result = [];
  for (let row = 0; row < LETTER_HEIGHT; row++) {
    result[row] = [];
  }

  for (let letterIndex = 0; letterIndex < word.length; letterIndex++) {
    const char = word[letterIndex];
    const letterMatrix = FONT_MATRIX[char];

    for (let row = 0; row < LETTER_HEIGHT; row++) {
      for (let col = 0; col < LETTER_WIDTH; col++) {
        result[row].push(letterMatrix[row][col]);
      }
    }

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

module.exports = {
  wordToMatrix,
  printMatrix,
  LETTER_WIDTH,
  LETTER_HEIGHT,
  SEPARATOR_WIDTH,
  MAX_COLUMNS
};

if (require.main === module) {
  try {
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