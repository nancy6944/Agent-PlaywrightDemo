const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.resolve(__dirname, '..', 'Screenshots');

function captureScreenshot(page, testInfo, stepName) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

  const testName = testInfo.title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
  const screenshotName = `${testName}-${stepName}.png`;

  return page.screenshot({
    path: path.join(SCREENSHOTS_DIR, screenshotName),
    fullPage: true,
  });
}

module.exports = {
  captureScreenshot,
};
