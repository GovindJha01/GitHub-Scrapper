const fs = require("fs").promises;
const {
  scrapeSearchResults,
  enrichProfileData,
  analyzeWithGemini
} = require("../utils/utils.js"); // Import utility functions
const { rateLimit } = require("../utils/additional.js"); // Import rate limiting utility

// In-memory storage
let storage = {
  rawData: [],
  processedData: [],
};

const getInfo = async (req, res) => {
  try {
    // Scrape search results
    const users = await scrapeSearchResults(req.params.query);

    // Process each user
    for (const user of users) {
      await rateLimit.wait();

      try {
        // Enrich profile data
        const enrichedData = await enrichProfileData(user.profileUrl);
        const fullProfile = { ...user, ...enrichedData };

        // AI analysis
        const analysis = await analyzeWithGemini(fullProfile);

        // Store data
        storage.rawData.push(fullProfile);
        if (analysis) {
          storage.processedData.push({
            ...fullProfile,
            analysis
          });
        }
      } catch (error) {
        console.error(`Error processing ${user.username}:`, error);
      }
    }

    // Save to file
    await fs.writeFile("storage.json", JSON.stringify(storage));

    res.json({
      status: "complete",
      processed: storage.processedData,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getInfo,
};
