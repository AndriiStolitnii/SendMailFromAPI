module.exports = {
    typeAndSubmit: async function (page, selector, text) {
        try {
            await page.waitForSelector(selector);
            await page.type(selector, text);
            await page.keyboard.press('Enter');
        } catch (error) {
            throw new Error('type and submit')

        }
    },
    click: async function (page, selector) {
        try {
            await page.waitForSelector(selector);
            await page.click(selector);
        } catch (error) {
            throw new Error('type and submit')

        }
    },
    
}