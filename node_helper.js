const NodeHelper = require("node_helper");

// Note: Playwright can be heavy and may not be installed in development environments.
// We lazy-require it inside the fetch function so the helper can load even if
// the dependency isn't yet installed. If Playwright is missing, the fetch will
// log a clear error and the module will return empty data instead of crashing.

module.exports = NodeHelper.create({
    socketNotificationReceived: function (notification, payload) {
        console.log('MMM-NetflixTop10 node_helper: received socket', notification);
        if (notification === "FETCH_NETFLIX") {
            this.fetchNetflixTop10();
        }
    },

    fetchNetflixTop10: async function () {
        let browser;
        try {
            console.log("Launching browser for Netflix Top 10...");

            let playwright;
            try {
                playwright = require("playwright");
            } catch (err) {
                console.error("Playwright is not installed for MMM-NetflixTop10.\nRun: cd modules/MMM-NetflixTop10 && npm install\nThen restart MagicMirror.");
                this.sendSocketNotification("NETFLIX_DATA", []);
                return;
            }

            const { chromium } = playwright;
            browser = await chromium.launch({ headless: true });
            const context = await browser.newContext({
                userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
                viewport: { width: 1920, height: 1080 },
                locale: "en-US"
            });
            const page = await context.newPage();

            const url = `https://www.netflix.com/tudum/top10/germany`;
            console.log(`Navigating to ${url}...`);
            await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });

            // Handle cookie/consent popups
            try {
                await page.click("button[data-uia='accept-all']", { timeout: 5000 }).catch(() => { });
            } catch (e) {
                console.log("No consent popup found");
            }

            // Extract the top 10 data
            console.log("Extracting Netflix Top 10 data...");
            const data = await page.evaluate(() => {
                const items = [];
                // Use the specific root node as requested by the user to avoid duplicates
                const table = document.querySelector('div[lang="en"][data-uia="top10-table"][data-length="10"]');
                const rows = table ? table.querySelectorAll('[data-uia="top10-table-row-title"]') : [];

                rows.forEach((row) => {
                    const rank = row.querySelector(".rank")?.textContent.trim() || "";
                    const img = row.querySelector("img");
                    const image = img ? img.getAttribute("src") : "";
                    const title = row.querySelector("button")?.textContent.trim() || "";

                    // Get weeks from the next td
                    const weeksCell = row.closest("tr")?.querySelector('[data-uia="top10-table-row-weeks"]');
                    const weeks = weeksCell ? parseInt(weeksCell.textContent.trim()) : 0;

                    if (rank && image && title) {
                        items.push({
                            rank: rank,
                            image: image,
                            title: title,
                            weeks: weeks
                        });
                    }
                });

                return items;
            });

            console.log(`Successfully extracted ${data.length} items from Netflix Top 10`);
            this.sendSocketNotification("NETFLIX_DATA", data);

        } catch (error) {
            console.error("Error fetching Netflix Top 10:", error);
            this.sendSocketNotification("NETFLIX_DATA", []);
        } finally {
            if (browser) {
                await browser.close();
            }
        }
    }
});
