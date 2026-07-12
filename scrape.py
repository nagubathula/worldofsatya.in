import asyncio
from playwright.async_api import async_playwright
import json

async def scrape():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 1920, "height": 1080})
        await page.goto("https://krisby.in/", wait_until="networkidle")
        
        # Scroll down to load lazy elements
        for i in range(10):
            await page.mouse.wheel(0, 1000)
            await asyncio.sleep(0.5)

        # Extract text elements with their font sizes and positions to understand layout
        data = await page.evaluate('''() => {
            const elements = document.querySelectorAll('h1, h2, h3, h4, p, a, span');
            const result = [];
            elements.forEach(el => {
                const rect = el.getBoundingClientRect();
                const style = window.getComputedStyle(el);
                const text = el.innerText.trim();
                if (text && rect.height > 0 && rect.width > 0) {
                    result.push({
                        text,
                        tag: el.tagName,
                        y: rect.top + window.scrollY,
                        x: rect.left,
                        fontSize: style.fontSize,
                        fontFamily: style.fontFamily,
                        color: style.color
                    });
                }
            });
            return result;
        }''')
        
        with open("scrape_data.json", "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2)
            
        await browser.close()

asyncio.run(scrape())
