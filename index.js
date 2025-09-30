import { connect } from "puppeteer-real-browser";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import express from "express";

const app = express();

(async () => {
    const { browser, page } = await connect({
        headless: true, // Run the browser in headless mode
        args: ["--single-process", "--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu", "--no-zygote", "--disable-dev-shm-usage"],
        plugins: [StealthPlugin()],
        customConfig: {
            chromePath: "./google-chrome-stable",
        },
    });

    await page.goto("https://example.com");

    app.get("/", async (req, res) => {
        try {
            const screenshotBuffer = await page.screenshot({ type: "png", fullPage: true });
            res.set("Content-Type", "image/png");
            res.send(screenshotBuffer);
        } catch (err) {
            console.error("Screenshot error:", err.message);
            // instead of blowing up, just send text back
            res.status(500).send("Screenshot unavailable (page may be reloading)");
        }
    });

    const port = process.env.PORT || 3000;
    // Start the server
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
})();
