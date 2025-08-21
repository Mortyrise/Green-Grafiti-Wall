const { execSync } = require('child_process');
const { wordToMatrix, MAX_COLUMNS } = require('./index');
const fs = require('fs');

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
    const originalDate = new Date(startDate);
    startDate = getClosestSunday(startDate);
    
    if (dryRun) {
      console.log(`Date auto-corrected: ${originalDate.toDateString()} → ${startDate.toDateString()} (closest Sunday)`);
    }
  }

  const getCommitCount = (intensityLevel) => {
    switch (intensityLevel) {
      case 1: return 2;
      case 2: return Math.random() < 0.5 ? 5 : 6;
      case 3: return Math.random() < 0.5 ? 12 : 15;
      case 4:
        const rand = Math.random();
        if (rand < 0.3) return Math.floor(Math.random() * 3) + 4;
        if (rand < 0.7) return Math.floor(Math.random() * 4) + 7;
        return Math.floor(Math.random() * 8) + 12;
      default: return 5;
    }
  };

  let commitCount = 0;
  const commands = [];

  for (let col = 0; col < matrix[0].length; col++) {
    for (let row = 0; row < matrix.length; row++) {
      if (matrix[row][col] === 1) {
        const commitDate = new Date(startDate);
        // Correct the offset: ensure Sunday alignment
        commitDate.setDate(startDate.getDate() + (col * 7) + row + 1);
        
        const dateStr = commitDate.toISOString().split('T')[0];
        const commitsForThisDay = getCommitCount(intensity);
        
        for (let i = 0; i < commitsForThisDay; i++) {
          const hours = 9 + Math.floor(Math.random() * 8);
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

function getIntensityName(intensity) {
  switch (intensity) {
    case 1: return 'Light green (2-3 commits/day)';
    case 2: return 'Medium green (4-7 commits/day)';
    case 3: return 'Dark green (10-15 commits/day)';
    case 4: return 'Random mix (4-19 commits/day, natural look)';
    default: return 'Medium green (default)';
  }
}

function getIntensityColor(intensity) {
  switch (intensity) {
    case 1: return '\x1b[42m';
    case 2: return '\x1b[102m';
    case 3: return '\x1b[32m';
    case 4: return '\x1b[96m';
    default: return '\x1b[102m';
  }
}

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
  
  console.log('\nIntensity Legend:');
  console.log(`${getIntensityColor(1)}██${reset} Light (2-3 commits/day)`);
  console.log(`${getIntensityColor(2)}██${reset} Medium (4-7 commits/day) - Default`);
  console.log(`${getIntensityColor(3)}██${reset} Dark (10-15 commits/day)`);
  console.log(`${getIntensityColor(4)}██${reset} Random (4-19 commits/day)`);
}

function validateDateRange(word, startDate) {
  try {
    const matrix = wordToMatrix(word);
    const totalWeeks = matrix[0].length;
    
    let correctedDate = startDate;
    if (startDate.getDay() !== 0) {
      correctedDate = getClosestSunday(startDate);
    }

    const endDate = new Date(correctedDate);
    endDate.setDate(correctedDate.getDate() + (totalWeeks * 7) - 1);

    const message = startDate.getDay() !== 0 
      ? `Date auto-corrected to Sunday: ${correctedDate.toDateString()}`
      : `Valid date range: ${correctedDate.toDateString()}`;

    return {
      isValid: true,
      message: `${message} to ${endDate.toDateString()}`,
      totalWeeks: totalWeeks,
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

function getClosestSunday(date) {
  const sunday = new Date(date);
  const dayOfWeek = date.getDay();
  
  if (dayOfWeek === 0) {
    return sunday;
  }
  
  sunday.setDate(date.getDate() - dayOfWeek);
  return sunday;
}

function getOptimalStartDate(word = "HELLO", year = null) {
  const today = new Date();
  const targetYear = year || today.getFullYear();
  
  try {
    const matrix = wordToMatrix(word);
    const patternWeeks = matrix[0].length;
    
    // Start from beginning of year and calculate center
    const yearStart = new Date(targetYear, 0, 1);
    const firstSunday = getNextSunday(yearStart);
    
    // Center the pattern in the year (52 weeks total)
    const weeksInYear = 52;
    const startOffsetWeeks = Math.floor((weeksInYear - patternWeeks) / 2);
    
    const startDate = new Date(firstSunday);
    startDate.setDate(firstSunday.getDate() + (startOffsetWeeks * 7));
    
    return getClosestSunday(startDate);
    
  } catch (error) {
    const fallbackDate = new Date(targetYear, 5, 15);
    return getClosestSunday(fallbackDate);
  }
}

function getDefaultStartDate() {
  return getOptimalStartDate();
}

function getNextSunday(date) {
  const nextSunday = new Date(date);
  const daysUntilSunday = 7 - date.getDay();
  nextSunday.setDate(date.getDate() + (daysUntilSunday % 7));
  return nextSunday;
}

function createGitRepo(word, startDate, repoPath = '.', dryRun = false, intensity = 2) {
  const validation = validateDateRange(word, startDate);
  if (!validation.isValid) {
    throw new Error(validation.message);
  }

  const correctedStartDate = validation.startDate || startDate;

  const initCommands = [
    `git init ${repoPath}`,
    `cd ${repoPath}`,
    'git config user.name "$(git config --global user.name || echo \'Contribution Generator\')"',
    'git config user.email "$(git config --global user.email || echo \'Please set your git email\')"',
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
      
      try {
        const globalName = execSync('git config --global user.name', { encoding: 'utf8' }).trim();
        const globalEmail = execSync('git config --global user.email', { encoding: 'utf8' }).trim();
        
        if (!globalEmail) {
          throw new Error('No email configured. Please run: git config --global user.email "your-email@github.com"');
        }
        
        execSync(`git config user.name "${globalName}"`, { stdio: 'ignore' });
        execSync(`git config user.email "${globalEmail}"`, { stdio: 'ignore' });
      } catch (configError) {
        throw new Error('Git user not configured. Please run:\n  git config --global user.name "Your Name"\n  git config --global user.email "your-email@github.com"');
      }
      
      execSync('git config init.defaultBranch main', { stdio: 'ignore' });
      
      fs.writeFileSync('README.md', `# ${word} Contribution Pattern\n\nGenerated using Git Commits Generator\n`);
      execSync('git add README.md', { stdio: 'ignore' });
      execSync('git commit -m "Initial commit"', { stdio: 'ignore' });
      execSync('git branch -M main', { stdio: 'ignore' });
    } catch (error) {
      throw new Error(`Failed to initialize Git repository: ${error.message}`);
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
  getOptimalStartDate,
  createGitRepo,
  getIntensityName,
  printMatrixWithIntensity,
  getIntensityColor
};
