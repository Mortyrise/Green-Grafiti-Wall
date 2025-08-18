# 🎨 GitHub Contribution Graph Word Generator

Transform your GitHub contribution graph into pixel art words! This Node.js tool generates carefully timed Git commits to spell out words in your GitHub profile's contribution calendar.

## ✨ Features

- 🔤 **5×7 Pixel Font** - Complete A-Z alphabet support
- 📅 **Smart Date Handling** - Automatic Sunday alignment and date correction
- 🎯 **Multiple Intensities** - Light, medium, dark, and random commit patterns
- 🖥️ **Interactive CLI** - Preview before creation with confirmation prompts
- ⚡ **Optional Dates** - Use automatic dates or specify your own
- 🔒 **Safety Features** - Comprehensive warnings and undo documentation

## 🚀 Quick Start

### 1. Clone and Navigate
```bash
git clone https://github.com/Mortyrise/Green-Grafiti-Wall.git
cd Green-Grafiti-Wall
```

### 2. Configure Git (Required)
```bash
# Make sure your Git is configured with your GitHub email
git config --global user.name "Your Name"
git config --global user.email "your-github-email@example.com"
```

### 3. Create Your First Pattern
```bash
# Simplest usage - automatic date and path
node cli.js create HELLO ./hello-pattern

# With specific date and intensity
node cli.js create HELLO 2024-01-07 ./hello-pattern 3

# Preview only (no repository creation)
node cli.js dry-run HELLO 2
```

## 📖 Usage Examples

### Basic Commands
```bash
# Create with automatic date (last Sunday)
node cli.js create CODE ./my-code-pattern

# Create with specific date (auto-corrects to nearest Sunday)
node cli.js create GITHUB 2024-06-10 ./github-pattern

# Preview without creating anything
node cli.js dry-run NODEJS 3
```

### Intensity Levels
- **1** - Light green (2-3 commits/day) - Subtle pattern
- **2** - Medium green (4-7 commits/day) - **Default**, good visibility
- **3** - Dark green (10-15 commits/day) - Maximum visibility
- **4** - Random mix (4-19 commits/day) - Natural, varied appearance

### Command Format
```bash
node cli.js <command> <word> [date] <path> [intensity]

# Examples:
node cli.js create HELLO ./hello-repo                    # Auto date, medium intensity
node cli.js create HELLO 2024-01-07 ./hello-repo        # Specific date, medium intensity  
node cli.js create HELLO ./hello-repo 4                 # Auto date, random intensity
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

## ⚠️ Important Warnings

### Before You Start
- **This modifies your public GitHub contribution graph**
- **Changes appear immediately after pushing to GitHub**
- **Make sure you understand the implications**
- **Test with private repositories first if unsure**

### Email Configuration Critical
Your Git email **must match** an email associated with your GitHub account:
1. Check your GitHub emails: https://github.com/settings/emails
2. Configure Git: `git config --global user.email "your-github-email@example.com"`

## 🔄 How to Undo

If you want to remove patterns from your contribution graph:

### Method 1: Delete Repository (Easiest)
1. Go to repository settings on GitHub
2. Scroll to "Danger Zone" → "Delete this repository"
3. Confirm deletion
4. Changes disappear from your graph within 24 hours

### Method 2: Fix Branch Issues
```bash
# If you have master/main branch issues
cd your-repository
./fix-branch.sh    # Linux/Mac
# or
fix-branch.bat     # Windows
```

See [UNDO.md](UNDO.md) for detailed instructions.

## 🔧 Technical Details

### How It Works
1. **Font Conversion** - Converts words to 5×7 binary matrices
2. **Date Calculation** - Maps matrix to GitHub's week-based calendar
3. **Commit Generation** - Creates multiple commits per "pixel" for visibility
4. **Repository Creation** - Builds clean Git repository with proper history

### Date Handling
- **Automatic Correction** - Any date gets corrected to nearest Sunday
- **Week Alignment** - GitHub weeks start on Sunday, tool handles this automatically
- **Range Calculation** - Shows exactly which dates will be affected

### Supported Characters
- **A-Z** - Complete uppercase alphabet
- **Space** - For word separation
- **Auto-conversion** - Lowercase letters converted automatically
- **Maximum width** - ~8-10 characters depending on letters (60 columns total)

## 🎯 Tips for Best Results

- **Start with short words** (3-5 letters) to test
- **Use intensity 2 or 3** for good visibility
- **Check preview carefully** before confirming
- **Verify your email configuration** before creating patterns
- **Consider using private repos** for experimentation
- **Remember patterns span multiple weeks** - plan accordingly

---

**Created for educational purposes. Use responsibly! 🚀**