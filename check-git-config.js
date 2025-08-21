#!/usr/bin/env node

/**
 * Git Configuration Checker
 * Verifies that Git is properly configured for GitHub contributions
 */

const { execSync } = require('child_process');

function checkGitConfig() {
  console.log('🔧 Checking Git configuration for GitHub contributions...\n');

  try {
    // Check if git is installed
    execSync('git --version', { stdio: 'ignore' });
    console.log('✅ Git is installed');
  } catch (error) {
    console.log('❌ Git is not installed or not in PATH');
    return false;
  }

  let hasValidConfig = true;

  // Check user name
  try {
    const name = execSync('git config --global user.name', { encoding: 'utf8' }).trim();
    if (name) {
      console.log(`✅ Git user.name: "${name}"`);
    } else {
      console.log('❌ Git user.name is not set');
      hasValidConfig = false;
    }
  } catch (error) {
    console.log('❌ Git user.name is not set');
    hasValidConfig = false;
  }

  // Check user email
  try {
    const email = execSync('git config --global user.email', { encoding: 'utf8' }).trim();
    if (email) {
      console.log(`✅ Git user.email: "${email}"`);
      
      // Check if email looks like a GitHub email
      if (email.includes('@') && email.length > 5) {
        console.log('✅ Email format looks valid');
      } else {
        console.log('⚠️  Email format might be invalid');
        hasValidConfig = false;
      }
    } else {
      console.log('❌ Git user.email is not set');
      hasValidConfig = false;
    }
  } catch (error) {
    console.log('❌ Git user.email is not set');
    hasValidConfig = false;
  }

  console.log('');

  if (hasValidConfig) {
    console.log('🎉 Git is properly configured for GitHub contributions!');
    console.log('');
    console.log('📝 Make sure this email is added to your GitHub account:');
    console.log('   👉 https://github.com/settings/emails');
    console.log('');
    console.log('✨ You can now create contribution patterns!');
  } else {
    console.log('🔧 Please configure Git before creating contributions:');
    console.log('');
    console.log('   git config --global user.name "Your Name"');
    console.log('   git config --global user.email "your-email@github.com"');
    console.log('');
    console.log('⚠️  IMPORTANT: Use the same email that\'s registered with your GitHub account!');
    console.log('   Check your GitHub emails: https://github.com/settings/emails');
  }

  return hasValidConfig;
}

if (require.main === module) {
  checkGitConfig();
}
