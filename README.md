# GitHub Contribution Graph Word Generator

Transform your GitHub contribution graph into pixel art words using carefully timed Git commits.

## Features

- Complete A-Z alphabet support (5×7 pixel font)
- Smart date handling with automatic Sunday alignment
- Multiple intensity levels for commit patterns
- Interactive CLI with preview and confirmation
- Automatic date calculation or custom dates
- Safety warnings and undo documentation

## Quick Start

### 1. Clone and Navigate
```bash
git clone https://github.com/Mortyrise/Green-Grafiti-Wall.git
cd Green-Grafiti-Wall
```

### 2. Configure Git (Required)
```bash
git config --global user.name "Your Name"
git config --global user.email "your-github-email@example.com"
```

### 3. Create Your First Pattern
```bash
# Automatic date and settings
node cli.js create HELLO ./hello-pattern

# Specific year and intensity
node cli.js create HELLO 2024 ./hello-pattern 3

# Preview only
node cli.js dry-run HELLO 2
```

## Usage Examples

### Basic Commands
```bash
# Create with automatic date
node cli.js create CODE ./my-code-pattern

# Create with specific year
node cli.js create GITHUB 2024 ./github-pattern

# Preview without creating anything
node cli.js dry-run NODEJS 3
```

### Intensity Levels
- **1** - Light green (2-3 commits/day)
- **2** - Medium green (4-7 commits/day) - Default
- **3** - Dark green (10-15 commits/day) - Maximum visibility
- **4** - Random mix (4-19 commits/day) - Natural appearance

### Command Format
```bash
node cli.js <command> <word> [year|date] <path> [intensity]

# Examples:
node cli.js create HELLO ./hello-repo                    # Auto date, medium intensity
node cli.js create HELLO 2024 ./hello-2024              # Specific year  
node cli.js create HELLO 2024-01-07 ./hello-repo 3      # Specific date, dark intensity
```

## 📁 Project Structure

```
├── font.js              # 5×7 pixel font definitions (A-Z + space)
├── index.js             # Word to matrix converter
├── git-commits.js       # Git commit generator with date handling
├── cli.js               # Interactive command-line interface
├── fix-branch.sh/bat    # Branch name correction utilities
├── UNDO.md              # How to remove/undo contribution patterns
└── README.md            # This file
```

## Important Warnings

### Before You Start
- This modifies your public GitHub contribution graph
- Changes appear immediately after pushing to GitHub
- Make sure you understand the implications
- Test with private repositories first if unsure

### Email Configuration Critical
Your Git email must match an email associated with your GitHub account:
1. Check your GitHub emails: https://github.com/settings/emails
2. Configure Git: `git config --global user.email "your-github-email@example.com"`

## How to Undo

### Method 1: Delete Repository (Easiest)
1. Go to repository settings on GitHub
2. Scroll to "Danger Zone" → "Delete this repository"
3. Confirm deletion
4. Changes disappear from your graph within 24 hours

### Method 2: Fix Branch Issues
```bash
cd your-repository
./fix-branch.sh    # Linux/Mac
# or
fix-branch.bat     # Windows
```

See [UNDO.md](UNDO.md) for detailed instructions.

## Technical Details

### How It Works
1. Converts words to 5×7 binary matrices
2. Maps matrix to GitHub's week-based calendar
3. Creates multiple commits per "pixel" for visibility
4. Builds clean Git repository with proper history

### Date Handling
- Automatic correction to nearest Sunday
- GitHub weeks start on Sunday, tool handles this automatically
- Shows exactly which dates will be affected

### Supported Characters
- A-Z complete uppercase alphabet
- Space for word separation
- Auto-conversion of lowercase letters
- Maximum width: ~8-10 characters depending on letters (60 columns total)

## Tips for Best Results

- Start with short words (3-5 letters) to test
- Use intensity 2 or 3 for good visibility
- Check preview carefully before confirming
- Verify your email configuration before creating patterns
- Consider using private repos for experimentation
- Remember patterns span multiple weeks - plan accordingly

---

**Created for educational purposes. Use responsibly!**