#!/usr/bin/env node

const { generateCommits, getNextSunday, createGitRepo, getDefaultStartDate, getOptimalStartDate, getClosestSunday } = require('./git-commits');

function parseArguments(args, command) {
  const cmdArgs = args.slice(1);
  
  if (command === 'dry-run') {
    if (cmdArgs.length < 1) {
      throw new Error('dry-run requires at least a word');
    }
    
    const word = cmdArgs[0];
    
    const isDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(cmdArgs[1]);
    const isYearFormat = /^\d{4}$/.test(cmdArgs[1]);
    
    if (isDateFormat) {
      // Format: dry-run <word> <date> [intensity]
      return {
        word,
        date: getClosestSunday(new Date(cmdArgs[1])),
        path: null,
        intensity: cmdArgs[2] ? parseInt(cmdArgs[2]) : 2,
        usedAutoDate: false
      };
    } else if (isYearFormat) {
      // Format: dry-run <word> <year> [intensity]
      const year = parseInt(cmdArgs[1]);
      return {
        word,
        date: getOptimalStartDate(word, year),
        path: null,
        intensity: cmdArgs[2] ? parseInt(cmdArgs[2]) : 2,
        usedAutoDate: true,
        year
      };
    } else {
      // Format: dry-run <word> [intensity]
      return {
        word,
        date: getOptimalStartDate(word), // Use word-specific optimal date
        path: null,
        intensity: cmdArgs[1] ? parseInt(cmdArgs[1]) : 2,
        usedAutoDate: true
      };
    }
  } else if (command === 'create') {
    if (cmdArgs.length < 2) {
      throw new Error('create requires at least word and path');
    }
    
    const word = cmdArgs[0];
    
    // Check if second argument looks like a date (YYYY-MM-DD), year (YYYY), or path
    const isDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(cmdArgs[1]);
    const isYearFormat = /^\d{4}$/.test(cmdArgs[1]);
    
    if (isDateFormat) {
      // Format: create <word> <date> <path> [intensity]
      if (cmdArgs.length < 3) {
        throw new Error('create with date requires word, date, and path');
      }
      return {
        word,
        date: getClosestSunday(new Date(cmdArgs[1])),
        path: cmdArgs[2],
        intensity: cmdArgs[3] ? parseInt(cmdArgs[3]) : 2,
        usedAutoDate: false
      };
    } else if (isYearFormat) {
      // Format: create <word> <year> <path> [intensity]
      if (cmdArgs.length < 3) {
        throw new Error('create with year requires word, year, and path');
      }
      const year = parseInt(cmdArgs[1]);
      return {
        word,
        date: getOptimalStartDate(word, year),
        path: cmdArgs[2],
        intensity: cmdArgs[3] ? parseInt(cmdArgs[3]) : 2,
        usedAutoDate: true,
        year
      };
    } else {
      // Format: create <word> <path> [intensity]
      return {
        word,
        date: getOptimalStartDate(word), // Use word-specific optimal date
        path: cmdArgs[1],
        intensity: cmdArgs[2] ? parseInt(cmdArgs[2]) : 2,
        usedAutoDate: true
      };
    }
  }
  
  throw new Error(`Unknown command: ${command}`);
}

function showHelp() {
  console.log(`
Git Commits Generator CLI

Usage:
  node cli.js <command> [options]

Commands:
  create <word> [date|year] <path> [intensity]   Create repository with commits (interactive preview)
  dry-run <word> [date|year] [intensity]         Preview commits only (no execution)
  next-sunday                                     Show the next Sunday date

Date/Year Options:
  - If omitted, uses current year with optimal centering
  - YYYY-MM-DD format for specific date (auto-corrects to nearest Sunday)
  - YYYY format for specific year with optimal centering
  - Examples: 2024, 2025-06-02

Intensity Levels:
  1 - Light green (2-3 commits/day) - may not show well if you have existing commits
  2 - Medium green (4-7 commits/day) - default
  3 - Dark green (10-15 commits/day) - maximum visibility
  4 - Random mix (4-19 commits/day) - natural look

Examples:
  node cli.js create HELLO ./hello-pattern
  node cli.js create HELLO 2024 ./hello-2024
  node cli.js create HELLO 2024-01-07 ./hello-pattern 3
  node cli.js dry-run HELLO 2024 2
  node cli.js next-sunday

Notes:
  - Dates auto-correct to nearest Sunday
  - Words converted to uppercase automatically
  - Default intensity is 2 (medium green)

WARNINGS:
  - Modifies your public GitHub contribution graph
  - Changes appear immediately after git push
  - To undo: Delete repository
  - Test with private repositories first
`);
}

function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === 'help' || args[0] === '-h' || args[0] === '--help') {
    showHelp();
    return;
  }

  const command = args[0];

  try {
    switch (command) {
      case 'dry-run':
        const dryArgs = parseArguments(args, 'dry-run');
        if (dryArgs.usedAutoDate) {
          const yearMsg = dryArgs.year ? ` for year ${dryArgs.year}` : ` for current year (${dryArgs.date.getFullYear()})`;
          console.log(`Using auto-date: ${dryArgs.date.toDateString()} (centered${yearMsg})`);
        }
        const dryCount = generateCommits(dryArgs.word, dryArgs.date, true, dryArgs.intensity);
        console.log(`\nDry run completed. ${dryCount} commits would be created.`);
        break;

      case 'create':
        const createArgs = parseArguments(args, 'create');
        
        console.log(`Creating repository for "${createArgs.word}" at ${createArgs.path}`);
        if (createArgs.usedAutoDate) {
          const yearMsg = createArgs.year ? ` for year ${createArgs.year}` : ` for current year (${createArgs.date.getFullYear()})`;
          console.log(`Using auto-date: ${createArgs.date.toDateString()} (centered${yearMsg})`);
        }
        console.log(`Intensity: ${createArgs.intensity} (${require('./git-commits').getIntensityName(createArgs.intensity)})`);
        console.log('Preview of commits to be created:');
        console.log('-'.repeat(50));
        const previewCount = generateCommits(createArgs.word, createArgs.date, true, createArgs.intensity);
        console.log('-'.repeat(50));
        console.log(`Total commits: ${previewCount}`);
        console.log(`Repository path: ${createArgs.path}`);
        console.log(`\nWARNING: This will modify your GitHub contribution graph!`);
        console.log(`${previewCount} commits will be added to your public profile`);
        console.log(`To undo: Delete the repository`);
        console.log(`Consider using a private repository for testing\n`);
        
        console.log(`Next steps after creation:`);
        console.log(`  cd ${createArgs.path}`);
        console.log(`  git remote add origin https://github.com/yourusername/repo-name.git`);
        console.log(`  git push -u origin main`);
        
        process.stdout.write('Do you want to proceed? (y/N): ');
        process.stdin.setEncoding('utf8');
        process.stdin.once('data', (input) => {
          const answer = input.toString().trim().toLowerCase();
          if (answer === 'y' || answer === 'yes') {
            try {
              const result = createGitRepo(createArgs.word, createArgs.date, createArgs.path, false, createArgs.intensity);
              console.log(`\nRepository created successfully!`);
              console.log(`Location: ${result.repoPath}`);
              console.log(`Commits: ${result.commitCount} for "${result.word}"`);
              console.log(`Intensity: ${result.intensity}`);
              console.log(`Date range: ${result.startDate} to ${result.endDate}`);
              console.log(`\nNext steps:`);
              console.log(`  cd ${createArgs.path}`);
              console.log(`  git remote add origin https://github.com/yourusername/repo-name.git`);
              console.log(`  git push -u origin main`);
              console.log(`\nRemember: PUBLIC repos immediately affect your GitHub profile!`);
            } catch (error) {
              console.error('Error creating repository:', error.message);
              process.exit(1);
            }
          } else {
            console.log('Operation cancelled.');
          }
          process.exit(0);
        });
        break;

      case 'next-sunday':
        const nextSun = getNextSunday(new Date());
        console.log(`Next Sunday: ${nextSun.toISOString().split('T')[0]} (${nextSun.toDateString()})`);
        break;

      default:
        console.error(`Unknown command: ${command}`);
        showHelp();
        process.exit(1);
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
