// This is a helper script to run the seedQuestions script 
// from the command line with ts-node

const { execSync } = require('child_process');
const path = require('path');

const seedQuestionsPath = path.resolve(__dirname, './seedQuestions.ts');

try {
  console.log('Starting seed operation...');
  execSync(`npx ts-node -r tsconfig-paths/register ${seedQuestionsPath}`, {
    stdio: 'inherit',
  });
  console.log('Seed operation completed successfully!');
} catch (error) {
  console.error('Error running seed operation:', error);
  process.exit(1);
} 