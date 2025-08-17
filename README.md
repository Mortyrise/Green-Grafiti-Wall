# Git Commits Generator for GitHub Contr# Generate commits (dry run)
const startDate = new Date('2024-01-07'); // Any date (auto-corrected to nearest Sunday)
const commitCount = generateCommits("HELLO", startDate, true);tion Graph

A Node.js module that generates Git commits based on 5×7 pixel font matrices to create words in your GitHub contribution graph.

## 📋 Overview

This project consists of three main modules:

- **`font.js`** - Contains 5×7 pixel font definitions for A-Z and space
- **`index.js`** - Word to matrix converter with validation
- **`git-commits.js`** - Git commit generator based on word matrices

## 🚀 Quick Start

### Basic Usage

```bash
# Show a word as pixel matrix
node index.js HELLO

# Create repository with interactive preview
node cli.js create HELLO 2024-01-07 ./hello-pattern

# Preview only (no interaction)
node cli.js dry-run HELLO 2024-01-07

# Get next Sunday date
node cli.js next-sunday
```

### Using as Node.js Module

```javascript
const { wordToMatrix } = require('./index');
const { generateCommits } = require('./git-commits');

// Convert word to matrix
const matrix = wordToMatrix("HELLO");
console.log(matrix); // 7×29 matrix

// Generate commits (dry run)
const startDate = new Date('2024-01-07'); // Must be Sunday
const commitCount = generateCommits("HELLO", startDate, true);
```

## 📁 File Structure

```
├── font.js          # Font matrix definitions (A-Z, space)
├── index.js         # Word to matrix converter
├── git-commits.js   # Git commit generator
├── cli.js           # Command-line interface
├── example.js       # Usage examples
└── package.json     # Project configuration
```

## 🔧 API Reference

### `wordToMatrix(word)`

Converts a word to a 7×N binary matrix.

- **Input**: `string` - Word in any case
- **Output**: `Array<Array<number>>` - 7 rows × N columns matrix
- **Throws**: Error if word contains undefined characters or exceeds max width

### `generateCommits(word, startDate, dryRun)`

Generates Git commits based on word matrix.

- **word**: `string` - Word to generate commits for
- **startDate**: `Date` - Starting date (automatically corrected to nearest Sunday)
- **dryRun**: `boolean` - If true, only shows commands without executing
- **Returns**: `number` - Number of commits created/would be created

### `validateDateRange(word, startDate)`

Validates if a start date is appropriate for the given word.

- **Returns**: Object with validation result and date information

## 🔧 CLI Commands

### Command Overview

```bash
# Interactive creation with preview
node cli.js create <word> <date> <path>

# Preview only (no execution)
node cli.js dry-run <word> <date>

# Utility
node cli.js next-sunday
```

### Commands Explained

#### `create` - Interactive repository creation
```bash
node cli.js create HELLO 2024-01-07 ./hello-pattern
```
- ✅ **Shows preview** of all commits first
- ✅ **Asks for confirmation** before executing
- ✅ **Creates clean repository** dedicated to the pattern
- ✅ **Provides next steps** for GitHub upload
- 🎯 **Ideal for**: GitHub profile showcase

#### `dry-run` - Preview only
```bash
node cli.js dry-run HELLO 2024-01-07
```
- ✅ **Preview commits** without any execution
- ✅ **Validate** word and date
- ✅ **No interaction** required

#### `next-sunday` - Get valid start date
```bash
node cli.js next-sunday
# Output: Next Sunday: 2024-08-18 (Sun Aug 18 2024)
```

## 📅 Date Handling

- **Auto-correction**: Any date is automatically corrected to the nearest Sunday
- **Format**: `YYYY-MM-DD` (e.g., `2024-01-08` → corrected to `2024-01-07`)
- **User-friendly**: No need to calculate Sunday dates manually
- **Clear feedback**: Shows original date and corrected date when auto-correction occurs

## ⚠️ Important Notes

1. **Interactive creation** shows preview and asks for confirmation
2. **Dates are automatically corrected** to nearest Sunday for proper GitHub graph alignment
3. **Maximum width is 60 columns** (approximately 8-10 characters depending on letters)
4. **Commits are empty commits** with specific dates for contribution graph
5. **Words are automatically converted to uppercase**
6. **Only creates clean repositories** (no mixing with existing projects)

## 📊 Practical Example

### Scenario: Create "HELLO" pattern for GitHub profile

```bash
# Step 1: Create repository (any date works - auto-corrected to Sunday)
node cli.js create HELLO 2024-01-08 ./hello-contribution
# → Shows: "📅 Date auto-corrected: Mon Jan 08 2024 → Sun Jan 07 2024"
# → Shows preview of all commits
# → Asks: "Do you want to proceed? (y/N):"
# → Creates repository if confirmed

# Step 2: Push to GitHub
cd hello-contribution
git remote add origin https://github.com/yourusername/hello-contribution.git
git push -u origin main
```

### Scenario: Just preview without creating

```bash
# Only see what would be created (no interaction)
node cli.js dry-run HELLO 2024-01-07
```

## 🎯 Workflow

1. **Create with any date**: `node cli.js create WORD ANY_DATE PATH`
2. **Auto-correction happens**: System finds nearest Sunday automatically
3. **Review preview** and confirm with 'y'
4. **Push to GitHub** for profile display

## 📈 Supported Characters

- **A-Z**: All uppercase letters
- **Space**: For word separation
- **Automatic conversion**: Lowercase letters are converted to uppercase

## 🚨 Safety Features

- **Dry-run mode**: Preview before execution
- **Validation**: Comprehensive input validation
- **Error handling**: Clear error messages
- **Non-destructive**: Only creates empty commits

---

**Created for educational purposes. Use responsibly and in accordance with GitHub's terms of service.**
