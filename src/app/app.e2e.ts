import { browser, by, element } from 'protractor';
import 'tslib';

describe('App', () => {
  beforeEach(async () => {
    await browser.get('/');
  });

  it('should have an app', async () => {
    const subject = await browser.getTitle();
    const result = 'vincent-cm by @warekit';
    expect(subject).toEqual(result);
  });
});
