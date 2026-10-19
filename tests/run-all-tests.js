require('dotenv').config();
const { spawn } = require('child_process');
const path = require('path');

async function runChild(scriptName) {
  return new Promise((resolve, reject) => {
    console.log(`\n======================================================`);
    console.log(` Executing: ${scriptName}`);
    console.log(`======================================================`);

    const child = spawn('node', [path.join(__dirname, scriptName)], {
      stdio: 'inherit',
      cwd: path.join(__dirname, '..')
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`${scriptName} failed with exit code ${code}`));
      }
    });
  });
}

(async () => {
  try {
    // 1. Run original CyberShield acceptance suite (69 tests)
    require('./test-suite.js');
    const result = window.CyberShield.TestSuite.runAll();
    if (result.failed > 0) {
      process.exit(1);
    }

    // 2. Run Gemini AI security & resilience tests
    const { runAll: runGeminiTests } = require('./gemini-analyzer.test.js');
    await runGeminiTests();

    console.log('\n>>> ALL CYBERSHIELD FUNCTIONAL & AI SECURITY SUITES PASSED! <<<\n');
    process.exit(0);
  } catch (err) {
    console.error('\nTest Suite Runner encountered failure:', err.message);
    process.exit(1);
  }
})();
