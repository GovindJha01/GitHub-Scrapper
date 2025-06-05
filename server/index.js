const express = require("express");
const router = require("./routes/route.js");

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const puppeteer = require("puppeteer-extra");

puppeteer.use(StealthPlugin());

const app = express();
const PORT = process.env.PORT || 3000;

app.use('/',router);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
