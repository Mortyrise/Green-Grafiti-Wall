# 🔄 How to Undo GitHub Contribution Graph Changes

If you've used this tool and want to revert the changes to your GitHub contribution graph, here are your options:

## 🗑️ Option 1: Delete the Repository (Easiest)

1. Go to your repository on GitHub
2. Click **Settings** → **General** → scroll down to **Danger Zone**
3. Click **Delete this repository**
4. Type the repository name to confirm
5. Click **I understand the consequences, delete this repository**

**Result**: Complete removal of all commits from your contribution graph within 24 hours.

## 🔧 Option 2: Remove Specific Commits (Advanced)

### Remove commits by date range:
```bash
# Navigate to your repository
cd your-repository

# Remove all commits from a specific date
git filter-branch --commit-filter '
  commit_date=$(git show -s --format=%ci $GIT_COMMIT)
  if [[ "$commit_date" == "2024-01-07"* ]]; then
    skip_commit "$@";
  else
    git commit-tree "$@";
  fi' HEAD

# Force push the changes
git push --force-with-lease origin main
```

### Remove commits by message pattern:
```bash
# Remove all commits with "Contribution for" in message
git filter-branch --commit-filter '
  if git log --format=%B -n 1 $GIT_COMMIT | grep -q "Contribution for"; then
    skip_commit "$@";
  else
    git commit-tree "$@";
  fi' HEAD

git push --force-with-lease origin main
```

## 🔒 Option 3: Make Repository Private

If you want to keep the repository but hide it from your public contribution graph:

1. Go to **Settings** → **General**
2. Scroll to **Danger Zone**
3. Click **Change repository visibility**
4. Select **Make private**

**Result**: Commits disappear from public contribution graph but repository remains accessible to you.

## ⚠️ Important Notes

- Changes may take **up to 24 hours** to reflect on your GitHub profile
- `git filter-branch` rewrites history - use with caution
- Always backup your repository before using `filter-branch`
- Private repositories don't affect public contribution graphs
- Force pushing (`--force-with-lease`) overwrites remote history

## 🛡️ Prevention for Future Use

- Test with **private repositories** first
- Use dates in the **distant past** for experimentation
- Consider using a **separate GitHub account** for testing
- Always review the preview before confirming creation

## 🆘 Need Help?

If you're having trouble with these commands:

1. **GitHub Support**: [https://support.github.com/](https://support.github.com/)
2. **Git Documentation**: [https://git-scm.com/docs/git-filter-branch](https://git-scm.com/docs/git-filter-branch)
3. **Stack Overflow**: Search for "remove commits from github contribution graph"

Remember: **Deleting the repository is usually the simplest solution!**
