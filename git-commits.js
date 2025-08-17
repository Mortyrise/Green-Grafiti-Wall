/**
 * Git Commit Generator for 7×N Binary Matrix
 * Generates Git commits based on word matrices for GitHub contribution graph
 */

const { execSync } = require('child_process');
const { wordToMatrix, MAX_COLUMNS } = require('./index');
const fs = require('fs');

/**
 * Generates Git commits based on a word matrix
 * @param {string} word - Word to convert to commits
 * @param {Date} startDate - Starting date (should be a Sunday)
 * @param {boolean} dryRun - If true, only prints commands without executing
 * @param {number} intensity - Commit intensity: 1=light, 2=medium, 3=dark, 4=random
 * @returns {number} Number of commits that would be/were created
 */
function generateCommits(word, startDate, dryRun = false, intensity = 2) {
  if (typeof word !== 'string') {
    throw new Error('Word must be a string');
  }

  if (!(startDate instanceof Date)) {
    throw new Error('Start date must be a Date object');
  }

  const matrix = wordToMatrix(word);
  const totalWidth = matrix[0].length;

  if (totalWidth > MAX_COLUMNS) {
    throw new Error(`Word matrix exceeds maximum width: ${totalWidth} > ${MAX_COLUMNS}`);
  }

  if (startDate.getDay() !== 0) {
    // Auto-correct to closest Sunday
    const originalDate = new Date(startDate);
    startDate = getClosestSunday(startDate);
    
    if (dryRun) {
      console.log(`📅 Date auto-corrected: ${originalDate.toDateString()} → ${startDate.toDateString()} (closest Sunday)`);
    }
  }

  // Intensity mapping for commit counts
  const getCommitCount = (intensityLevel) => {
    switch (intensityLevel) {
      case 1: return 2;  // Light green (2-3 commits)
      case 2: return Math.random() < 0.5 ? 5 : 6;  // Medium green (4-7 commits)
      case 3: return Math.random() < 0.5 ? 12 : 15; // Dark green (10-15 commits)
      case 4: // Random mix for natural look
        const rand = Math.random();
        if (rand < 0.3) return Math.floor(Math.random() * 3) + 4;  // 4-6 (medium)
        if (rand < 0.7) return Math.floor(Math.random() * 4) + 7;  // 7-10 (medium-dark)
        return Math.floor(Math.random() * 8) + 12; // 12-19 (dark)
      default: return 5;
    }
  };

  let commitCount = 0;
  const commands = [];

  // Process each column (week) and row (day)
  for (let col = 0; col < matrix[0].length; col++) {
    for (let row = 0; row < matrix.length; row++) {
      if (matrix[row][col] === 1) {
        const commitDate = new Date(startDate);
        commitDate.setDate(startDate.getDate() + (col * 7) + row);
        
        const dateStr = commitDate.toISOString().split('T')[0];
        const commitsForThisDay = getCommitCount(intensity);
        
        // Generate multiple commits for this day
        for (let i = 0; i < commitsForThisDay; i++) {
          const hours = 9 + Math.floor(Math.random() * 8); // Random hour between 9-16
          const minutes = Math.floor(Math.random() * 60);
          const timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
          
          const command = `git commit --allow-empty --date="${dateStr}T${timeStr}" -m "Contribution for ${word} #${i + 1}"`;
          commands.push(command);
          commitCount++;
        }
      }
    }
  }

  if (dryRun) {
    const matrix = wordToMatrix(word);
    printMatrixWithIntensity(matrix, word, intensity);
    console.log(`\nCommit Details:`);
    console.log(`Intensity level: ${intensity} (${getIntensityName(intensity)})`);
    console.log(`Total commits: ${commitCount}`);
    console.log(`Sample commands (showing first 5):`);
    commands.slice(0, 5).forEach(cmd => console.log(cmd));
    if (commands.length > 5) {
      console.log(`... and ${commands.length - 5} more commits`);
    }
  } else {
    commands.forEach(cmd => {
      try {
        execSync(cmd, { stdio: 'ignore' });
      } catch (error) {
        throw new Error(`Failed to execute Git command: ${cmd}`);
      }
    });
  }

  return commitCount;
}

/**
 * Gets intensity level name for display
 * @param {number} intensity - Intensity level
 * @returns {string} Human readable intensity name
 */
function getIntensityName(intensity) {
  switch (intensity) {
    case 1: return 'Light green (2-3 commits/day)';
    case 2: return 'Medium green (4-7 commits/day)';
    case 3: return 'Dark green (10-15 commits/day)';
    case 4: return 'Random mix (4-19 commits/day, natural look)';
    default: return 'Medium green (default)';
  }
}

/**
 * Gets ANSI color code for intensity level
 * @param {number} intensity - Intensity level
 * @returns {string} ANSI color code
 */
function getIntensityColor(intensity) {
  switch (intensity) {
    case 1: return '\x1b[42m'; // Light green background
    case 2: return '\x1b[102m'; // Medium green background  
    case 3: return '\x1b[32m'; // Dark green background
    case 4: return '\x1b[96m'; // Cyan for random (to distinguish)
    default: return '\x1b[102m'; // Default medium green
  }
}

/**
 * Prints a matrix with colors representing commit intensity
 * @param {Array<Array<number>>} matrix - Matrix to print
 * @param {string} word - Original word (for title)
 * @param {number} intensity - Intensity level for coloring
 */
function printMatrixWithIntensity(matrix, word, intensity = 2) {
  const reset = '\x1b[0m';
  const color = getIntensityColor(intensity);
  
  console.log(`\nVisual preview for "${word}" with ${getIntensityName(intensity)}:`);
  console.log('─'.repeat(matrix[0].length * 2 + 2));
  
  for (let row of matrix) {
    let line = '│';
    for (let cell of row) {
      if (cell) {
        line += color + '██' + reset;
      } else {
        line += '  ';
      }
    }
    line += '│';
    console.log(line);
  }
  
  console.log('─'.repeat(matrix[0].length * 2 + 2));
  console.log(`Dimensions: ${matrix.length} rows × ${matrix[0].length} columns`);
  
  // Legend
  console.log('\nIntensity Legend:');
  console.log(`${getIntensityColor(1)}██${reset} Light (2-3 commits/day)`);
  console.log(`${getIntensityColor(2)}██${reset} Medium (4-7 commits/day) - Default`);
  console.log(`${getIntensityColor(3)}██${reset} Dark (10-15 commits/day)`);
  console.log(`${getIntensityColor(4)}██${reset} Random (4-19 commits/day)`);
}

/**
 * Validates if a start date is appropriate for the given word
 * @param {string} word - Word to validate
 * @param {Date} startDate - Proposed start date
 * @returns {Object} Validation result with isValid boolean and message
 */
function validateDateRange(word, startDate) {
  try {
    const matrix = wordToMatrix(word);
    const totalWidth = matrix[0].length;
    
    // Auto-correct to Sunday if needed
    let correctedDate = startDate;
    if (startDate.getDay() !== 0) {
      correctedDate = getClosestSunday(startDate);
    }

    const endDate = new Date(correctedDate);
    endDate.setDate(correctedDate.getDate() + (totalWidth * 7) - 1);

    const message = startDate.getDay() !== 0 
      ? `Date auto-corrected to Sunday: ${correctedDate.toDateString()}`
      : `Valid date range: ${correctedDate.toDateString()}`;

    return {
      isValid: true,
      message: `${message} to ${endDate.toDateString()}`,
      totalWeeks: totalWidth,
      startDate: correctedDate,
      endDate: endDate,
      wasAutocorrected: startDate.getDay() !== 0
    };
  } catch (error) {
    return {
      isValid: false,
      message: error.message
    };
  }
}

/**
 * Gets the closest Sunday to a given date (before or on the date)
 * @param {Date} date - Reference date
 * @returns {Date} Closest Sunday (same date if already Sunday, or previous Sunday)
 */
function getClosestSunday(date) {
  const sunday = new Date(date);
  const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, etc.
  
  if (dayOfWeek === 0) {
    // Already a Sunday
    return sunday;
  }
  
  // Go back to the previous Sunday
  sunday.setDate(date.getDate() - dayOfWeek);
  return sunday;
}

/**
 * Gets the default start date (last Sunday)
 * @returns {Date} Last Sunday (or today if today is Sunday)
 */
function getDefaultStartDate() {
  const today = new Date();
  const daysBack = today.getDay(); // 0=Sunday, 1=Monday, etc.
  const lastSunday = new Date(today);
  lastSunday.setDate(today.getDate() - daysBack);
  return lastSunday;
}

/**
 * Gets the next Sunday from a given date
 * @param {Date} date - Reference date
 * @returns {Date} Next Sunday
 */
function getNextSunday(date) {
  const nextSunday = new Date(date);
  const daysUntilSunday = 7 - date.getDay();
  nextSunday.setDate(date.getDate() + (daysUntilSunday % 7));
  return nextSunday;
}

/**
 * Creates a complete Git repository with commits for a word
 * @param {string} word - Word to create commits for
 * @param {Date} startDate - Starting date (must be Sunday)
 * @param {string} repoPath - Path where to create the repository
 * @param {boolean} dryRun - If true, only shows what would be done
 * @param {number} intensity - Commit intensity level (1-4)
 * @returns {Object} Result with commit count and repository info
 */
function createGitRepo(word, startDate, repoPath = '.', dryRun = false, intensity = 2) {
  const validation = validateDateRange(word, startDate);
  if (!validation.isValid) {
    throw new Error(validation.message);
  }

  // Use the auto-corrected date
  const correctedStartDate = validation.startDate || startDate;

  const initCommands = [
    `git init ${repoPath}`,
    `cd ${repoPath}`,
    'git config user.name "GitHub Contribution Bot"',
    'git config user.email "bot@example.com"',
    'git config init.defaultBranch main',
    'echo "# Contribution Pattern" > README.md',
    'git add README.md',
    'git commit -m "Initial commit"',
    'git branch -M main'
  ];

  if (dryRun) {
    console.log('Repository initialization commands:');
    initCommands.forEach(cmd => console.log(cmd));
    console.log('');
  } else {
    try {
      execSync(`git init ${repoPath}`, { stdio: 'ignore' });
      process.chdir(repoPath);
      execSync('git config user.name "GitHub Contribution Bot"', { stdio: 'ignore' });
      execSync('git config user.email "bot@example.com"', { stdio: 'ignore' });
      execSync('git config init.defaultBranch main', { stdio: 'ignore' });
      
      // Create initial README and commit
      const fs = require('fs');
      fs.writeFileSync('README.md', `# ${word} Contribution Pattern\n\nGenerated using Git Commits Generator\n`);
      execSync('git add README.md', { stdio: 'ignore' });
      execSync('git commit -m "Initial commit"', { stdio: 'ignore' });
      execSync('git branch -M main', { stdio: 'ignore' });
    } catch (error) {
      throw new Error('Failed to initialize Git repository');
    }
  }

  const commitCount = generateCommits(word, correctedStartDate, dryRun, intensity);

  return {
    word,
    startDate: correctedStartDate.toDateString(),
    endDate: validation.endDate.toDateString(),
    commitCount,
    totalWeeks: validation.totalWeeks,
    repoPath,
    intensity: getIntensityName(intensity),
    wasAutocorrected: validation.wasAutocorrected
  };
}

module.exports = {
  generateCommits,
  validateDateRange,
  getNextSunday,
  getClosestSunday,
  getDefaultStartDate,
  createGitRepo,
  getIntensityName,
  printMatrixWithIntensity,
  getIntensityColor
};
