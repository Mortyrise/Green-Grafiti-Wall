#!/usr/bin/env node

/**
 * CLI for Git Commits Generator
 * Command-line interface for generating Git commits based on word matrices
 */

const { generateCommits, getNextSunday, createGitRepo, getDefaultStartDate } = require('./git-commits');

/**
 * Parses CLI arguments to detect if date is provided or should use automatic date
 * @param {string[]} args - CLI arguments
 * @param {string} command - Command name ('create' or 'dry-run')
 * @returns {object} Parsed arguments with word, date, path, intensity
 */
function parseArguments(args, command) {
  // Remove command from args
  const cmdArgs = args.slice(1);
  
  if (command === 'dry-run') {
    if (cmdArgs.length < 1) {
      throw new Error('dry-run requires at least a word');
    }
    
    const word = cmdArgs[0];
    
    // Check if second argument looks like a date (YYYY-MM-DD format)
    const isDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(cmdArgs[1]);
    
    if (isDateFormat) {
      // Format: dry-run <word> <date> [intensity]
      return {
        word,
        date: new Date(cmdArgs[1]),
        path: null,
        intensity: cmdArgs[2] ? parseInt(cmdArgs[2]) : 2,
        usedAutoDate: false
      };
    } else {
      // Format: dry-run <word> [intensity]
      return {
        word,
        date: getDefaultStartDate(),
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
    
    // Check if second argument looks like a date
    const isDateFormat = /^\d{4}-\d{2}-\d{2}$/.test(cmdArgs[1]);
    
    if (isDateFormat) {
      // Format: create <word> <date> <path> [intensity]
      if (cmdArgs.length < 3) {
        throw new Error('create with date requires word, date, and path');
      }
      return {
        word,
        date: new Date(cmdArgs[1]),
        path: cmdArgs[2],
        intensity: cmdArgs[3] ? parseInt(cmdArgs[3]) : 2,
        usedAutoDate: false
      };
    } else {
      // Format: create <word> <path> [intensity]
      return {
        word,
        date: getDefaultStartDate(),
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
  create <word> [date] <path> [intensity]   Create repository with commits (interactive preview)
  dry-run <word> [date] [intensity]         Preview commits only (no execution)
  next-sunday                               Show the next Sunday date

Date Options:
  - If date is omitted, uses last Sunday automatically
  - If date is provided, auto-corrects to nearest Sunday
  - Format: YYYY-MM-DD (e.g., 2024-01-07)

Intensity Levels:
  1 - Light green (2-3 commits/day) - may not show well if you have existing commits
  2 - Medium green (4-7 commits/day) - default, good visibility
  3 - Dark green (10-15 commits/day) - maximum visibility
  4 - Random mix (4-19 commits/day) - natural look with varied intensity

Workflow:
  1. 'create' shows preview and asks for confirmation
  2. Only creates clean, dedicated repositories
  3. Multiple commits per pixel for better visibility

Examples:
  # Automatic date (last Sunday) with default intensity
  node cli.js create HELLO ./hello-pattern
  
  # Specific date with auto-correction
  node cli.js create HELLO 2024-01-07 ./hello-pattern
  
  # Dark intensity for maximum visibility
  node cli.js create HELLO 2024-01-07 ./hello-dark 3
  
  # Automatic date with random natural look
  node cli.js create HELLO ./hello-natural 4
  
  # Preview with automatic date
  node cli.js dry-run HELLO 2
  
  # Preview with specific date
  node cli.js dry-run HELLO 2024-01-07 2
  
  # Get next valid Sunday date
  node cli.js next-sunday

Notes:
  - Any date format YYYY-MM-DD (auto-corrects to closest Sunday)
  - Word will be converted to uppercase
  - Default intensity is 2 (medium green)
  - Higher intensity = better visibility over existing commits
  - Dates are automatically adjusted to the nearest Sunday for GitHub alignment

⚠️  IMPORTANT WARNINGS:
  - This WILL modify your public GitHub contribution graph
  - Commits become visible immediately after 'git push'
  - To undo: Delete repository or use 'git filter-branch'
  - Consider private repositories for experimentation
  - Use responsibly and in accordance with GitHub's terms
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
          console.log(`📅 Using automatic date: ${dryArgs.date.toDateString()} (last Sunday)`);
        }
        const dryCount = generateCommits(dryArgs.word, dryArgs.date, true, dryArgs.intensity);
        console.log(`\nDry run completed. ${dryCount} commits would be created.`);
        break;

      case 'create':
        const createArgs = parseArguments(args, 'create');
        
        // Show preview first
        console.log(`Creating repository for "${createArgs.word}" at ${createArgs.path}`);
        if (createArgs.usedAutoDate) {
          console.log(`📅 Using automatic date: ${createArgs.date.toDateString()} (last Sunday)`);
        }
        console.log(`Intensity: ${createArgs.intensity} (${require('./git-commits').getIntensityName(createArgs.intensity)})`);
        console.log('Preview of commits to be created:');
        console.log('-'.repeat(50));
        const previewCount = generateCommits(createArgs.word, createArgs.date, true, createArgs.intensity);
        console.log('-'.repeat(50));
        console.log(`Total commits: ${previewCount}`);
        console.log(`Repository path: ${createArgs.path}`);
        console.log(`\n⚠️  IMPORTANT: This will modify your GitHub contribution graph!`);
        console.log(`📊 ${previewCount} commits will be added to your public profile`);
        console.log(`🔄 To undo: Delete the repository or use git filter-branch`);
        console.log(`🔒 Consider using a private repository if experimenting\n`);
        
        console.log(`Next steps after creation:`);
        console.log(`  cd ${createArgs.path}`);
        console.log(`  # For PUBLIC repository (affects your contribution graph):`);
        console.log(`  git remote add origin https://github.com/yourusername/repo-name.git`);
        console.log(`  git push -u origin main`);
        console.log(`  `);
        console.log(`  # For PRIVATE repository (safe experimentation):`);
        console.log(`  gh repo create repo-name --private --source=. --push`);
        
        // Ask for confirmation
        process.stdout.write('Do you want to proceed? (y/N): ');
        process.stdin.setEncoding('utf8');
        process.stdin.once('data', (input) => {
          const answer = input.toString().trim().toLowerCase();
          if (answer === 'y' || answer === 'yes') {
            try {
              const result = createGitRepo(createArgs.word, createArgs.date, createArgs.path, false, createArgs.intensity);
              console.log(`\n✅ Repository created successfully!`);
              console.log(`📁 Location: ${result.repoPath}`);
              console.log(`📊 Commits: ${result.commitCount} for "${result.word}"`);
              console.log(`🎨 Intensity: ${result.intensity}`);
              console.log(`📅 Date range: ${result.startDate} to ${result.endDate}`);
              console.log(`\n🚀 Next steps - Choose your upload method:`);
              console.log(`  cd ${createArgs.path}`);
              console.log(`  `);
              console.log(`  📊 PUBLIC (affects contribution graph):`);
              console.log(`    git remote add origin https://github.com/yourusername/repo-name.git`);
              console.log(`    git push -u origin main`);
              console.log(`  `);
              console.log(`  🔒 PRIVATE (safe experimentation):`);
              console.log(`    gh repo create repo-name --private --source=. --push`);
              console.log(`  `);
              console.log(`  ⚠️  Remember: PUBLIC repos immediately affect your GitHub profile!`);
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
