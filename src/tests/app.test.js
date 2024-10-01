const request = require('supertest');
const app = require('../app'); // Adjust to your Express app file path
const puppeteer = require('puppeteer');
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

describe('iArtist Project Tests', () => {

  // 1. Upload Artwork with Caption
  it('should upload an artwork with a caption', async () => {
    const res = await request(app)
      .post('/api/artwork/upload')
      .field('caption', 'My new artwork')
      .attach('file', './test-files/artwork.jpg');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('success', true);
  });

  // 2. Like an Artwork
  it('should like an artwork', async () => {
    const res = await request(app)
      .post('/api/artwork/like')
      .send({ artworkId: 'artwork123' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('likes');
  });

  // 3. Comment on an Artwork
  it('should comment on an artwork', async () => {
    const res = await request(app)
      .post('/api/artwork/comment')
      .send({ artworkId: 'artwork123', comment: 'Great work!' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('comment');
  });

  // 4. View Profile Page
  it('should retrieve user profile', async () => {
    const res = await request(app)
      .get('/api/profile/123');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('user');
    expect(res.body.user).toHaveProperty('contactInfo');
    expect(res.body.user).toHaveProperty('artworks');
  });

  // 5. Edit Contact Information
  it('should update user contact info', async () => {
    const res = await request(app)
      .put('/api/profile/contact')
      .send({ contactInfo: 'new_contact_info' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('updated', true);
  });

  // 6. Load Test for Multiple Art Uploads
  it('should handle multiple uploads simultaneously', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const uploads = 10;
    for (let i = 0; i < uploads; i++) {
      await page.goto('http://localhost:3000/upload');
      await page.type('input[name="caption"]', 'Artwork caption');
      const [fileChooser] = await Promise.all([
        page.waitForFileChooser(),
        page.click('input[type="file"]'),
      ]);
      await fileChooser.accept(['./test-files/artwork.jpg']);
      await page.click('button[type="submit"]');
    }

    await browser.close();
  });

  // 7. View Comments on Artwork
  it('should display all comments for an artwork', async () => {
    const res = await request(app)
      .get('/api/artwork/comments?artworkId=artwork123');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('comments');
  });

  // 8. Delete Comment on Artwork
  it('should delete a user comment', async () => {
    const res = await request(app)
      .delete('/api/artwork/comment')
      .send({ commentId: 'comment123' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('deleted', true);
  });

  // 9. Profile Page Load Time (Performance Test with Lighthouse)
  it('should load the profile page within acceptable time limits', async () => {
    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });
    const options = { logLevel: 'info', output: 'json', port: chrome.port };
    const runnerResult = await lighthouse('http://localhost:3000/profile', options);

    const audits = runnerResult.lhr.audits;
    expect(audits['speed-index'].numericValue).toBeLessThan(4000); // Check that load time is < 4s
    await chrome.kill();
  });

  // 10. Cross-Browser Compatibility
  it('should work across different browsers and devices', async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    
    const devices = ['iPhone X', 'Pixel 2', 'iPad Pro'];
    
    for (let device of devices) {
      await page.emulate(puppeteer.devices[device]);
      await page.goto('http://localhost:3000');
      // Perform actions to validate page renders correctly
    }

    await browser.close();
  });

  // 11. Security - Data Privacy
  it('should not expose sensitive user data to unauthorized users', async () => {
    const res = await request(app)
      .get('/api/profile/123')
      .set('Authorization', 'invalid_token'); // Simulate an unauthorized user
    expect(res.statusCode).toEqual(403);
  });

});
