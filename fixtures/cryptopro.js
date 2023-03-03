import { test as base, chromium } from '@playwright/test'
import path from 'path';

export const test = base.extend({
  context: async ({ }, use) => {
    const pathToExtension = path.join(__dirname, `../extensions/cryptopro`);
    const context = await chromium.launchPersistentContext(``, {
      args: [
        `--headless=new`,
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context);
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    /*
    // for manifest v2:
    let [background] = context.backgroundPages()
    if (!background)
      background = await context.waitForEvent('backgroundpage')
    */

    // for manifest v3:
    let [background] = context.serviceWorkers();
    if (!background) {
      background = await context.waitForEvent(`serviceworker`);
    }  

    const extensionId = background.url().split(`/`)[2];
    await use(extensionId);
  },
});
