const puppeteer = require('puppeteer-extra');
const cheerio = require('cheerio');
const model = require('../config/Gemini.js'); // Import Gemini model
const { PROMPT_TEMPLATE } = require('../utils/additional.js'); // Import prompt template


async function scrapeSearchResults(query) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  const users = [];
  for (let pageNum = 1; pageNum <= 3; pageNum++) {
    await page.goto(`https://github.com/search?q=${query}&type=users&p=${pageNum}`);
    await page.waitForSelector('.iwUbcA');
    
    const html = await page.content();
    const $ = cheerio.load(html);
    
    $('.iwUbcA').each((i, el) => {
      users.push({
        githubUsername: $(el).find('.gbmbF').text().trim(),
        username: $(el).find('.hYFqef').text().trim(),
        profileUrl: `https://github.com${$(el).find('a').attr('href')}`,
        bio: $(el).find('.gKFdvh').text().trim(),
        location: $(el).find('.eCfCAC').text().trim(),
      });
    });
  }
  
  await browser.close();
  return users;
}

async function enrichProfileData(profileUrl) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  await page.goto(profileUrl);
  await page.waitForSelector('.js-pinned-items-reorder-container');
  
  const html = await page.content();
  const $ = cheerio.load(html);
  
  
  const pinnedRepos = [];
  $('#user-profile-frame').each((i, el) => {
    pinnedRepos.push({
      name: $(el).find('.repo').text().trim(),
      description: $(el).find('.pinned-item-desc').text().trim(),
      language: $(el).find('[itemprop="programmingLanguage"]').text().trim()
    });
  });
  
  const contributions = $('#js-contribution-activity-description h2').text();
  
  await browser.close();
  
  return {
    contributions: parseInt(contributions),
    pinnedRepos,
    location: $('.vcard-details [itemprop="homeLocation"]').text().trim()
  };
}

async function analyzeWithGemini(profileData) {
  const prompt = PROMPT_TEMPLATE.replace('{profileData}', JSON.stringify(profileData));
  
  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const newString = text.replace("json",'').replace(/`/g,'');

    //console.log('Gemini raw response:', newString);

    //parsing
    return JSON.parse(newString);
  } catch (error) {
    console.error('Gemini analysis failed:', error);
    return null;
  }
}

module.exports = {
  scrapeSearchResults,
  enrichProfileData,
  analyzeWithGemini
};