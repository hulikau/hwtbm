// This is a helper script to run the seedLeaderboard script
// from the command line with ts-node

const childProcess = require('child_process');
const nodePath = require('path');

const seedLeaderboardPath = nodePath.resolve(__dirname, './seedLeaderboard.ts');

try {
  console.log('Starting leaderboard seed operation...');
  childProcess.execSync(`npx ts-node -r tsconfig-paths/register ${seedLeaderboardPath}`, {
    stdio: 'inherit',
  });
  console.log('Leaderboard seed operation completed successfully!');
} catch (error) {
  console.error('Error running leaderboard seed operation:', error);
  process.exit(1);
} 