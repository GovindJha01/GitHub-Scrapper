
// Gemini prompt template
const PROMPT_TEMPLATE = `
Analyze this GitHub profile and provide structured JSON output with:
- primary_skills (array)
- tech_stack (array)
- notable_contributions (array)
- experience_level (string: junior/mid/senior)
- specialization (string)

Profile Data:
{profileData}
`;


// Rate limit handling
const rateLimit = {
  lastRequest: 0,
  delay: 5000,
  async wait() {
    const now = Date.now();
    if (now - this.lastRequest < this.delay) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.delay - (now - this.lastRequest))
      );
    }
    this.lastRequest = Date.now();
  },
};

module.exports = {
  PROMPT_TEMPLATE,
  rateLimit,
};