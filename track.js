const puppeteer = require('puppeteer');

async function googleSearch(keyword, domain, country) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    
    // تكوين رابط البحث باستخدام الكلمة المفتاحية ورمز الدولة
    const searchUrl = `https://www.google.com/search?q=${keyword}&gl=${country}`;
    
    await page.goto(searchUrl, { waitUntil: 'domcontentloaded' });

    // استخراج الروابط من نتائج البحث الحقيقية
    const links = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('div.yuRUbf > a')).map(anchor => ({
            url: anchor.href,
            title: anchor.querySelector('h3')?.innerText
        }));
    });

    let foundLinks = [];
    links.forEach((link, index) => {
        if (link.url.includes(domain)) {
            console.log(`Found: ${link.url} at position ${index + 1}`);
            foundLinks.push({ link: link.url, position: index + 1, title: link.title });
        }
    });

    await browser.close();
    return foundLinks;
}

(async () => {
    // أخذ المدخلات من المستخدم
    const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    });

    readline.question('Enter the search keyword: ', keyword => {
        readline.question('Enter the domain to track (e.g., example.com): ', domain => {
            readline.question('Enter the country code (e.g., ae for UAE): ', country => {
                
                // تشغيل البحث باستخدام المدخلات الديناميكية
                googleSearch(keyword, domain, country).then(results => {
                    if (results.length > 0) {
                        console.log('Search results:', results);
                    } else {
                        console.log('No results found for this domain.');
                    }
                    readline.close();
                });
            });
        });
    });
})();
