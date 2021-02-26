'use strict';

const axios = require('axios');
const puppeteer = require('puppeteer');
const { typeAndSubmit, click } = require('./helper');

const KEY = "X6YQdn0tFi1W8ht7kWeCmXBrAh1TJAE8";

let genres = [];

const date = "current";

let numberOfGenre = 0;

let booksOfGenre = [];

const Sender = {
    login: "stoletnytest",
    password: "1928QasW",
}

const Receiver = {
    login: "stoletnytest2",
    password: "1928QasW"
}

axios.get(`https://api.nytimes.com/svc/books/v3/lists/names.json?api-key=${KEY}`)
    .then(response => {
        genres.push(...response.data.results);
        genres = genres.map(el => el["list_name"]);
        axios.get(`https://api.nytimes.com/svc/books/v3/lists/${date}/${genres[numberOfGenre]}.json?api-key=${KEY}`)
            .then(response => {
                booksOfGenre.push(...response.data.results.books);
                booksOfGenre = booksOfGenre.map(el => `Rank: ${el.rank}. Title: ${el.title}. Author: ${el.author}`);
                (async (booksOfGenre, Sender, genre) => {
                    const browser = await puppeteer.launch({
                        headless: false
                    });
                    const page = await browser.newPage();
                    await page.goto('https://mail.google.com/');
                    await typeAndSubmit(page, 'input[name=identifier]', Sender.login);
                    await page.waitFor(1000);
                    await typeAndSubmit(page, 'input[name=password]', Sender.password);
                    await page.waitFor(5000);
                    await click(page, '.z0 :first-child');
                    await page.waitFor(5000);
                    await typeAndSubmit(page, 'textarea[name=to]', `${Receiver.login + "@gmail.com"}`);
                    await typeAndSubmit(page, 'input[name=subjectbox]', `${genre}`);
                    await page.$eval('div[role=textbox]', (el, booksOfGenre) => {
                       booksOfGenre.forEach(book => el.innerText += `${book}\n`);
                    }, booksOfGenre);
                    await page.waitFor(2000);
                    await click(page, '.dC :first-child')
                    await page.waitFor(5000);
                    await page.close();
                    await browser.close();
                })(booksOfGenre, Sender, genres[numberOfGenre]).then(response => {
                    (async (booksOfGenre, receiver) => {
                        const browser = await puppeteer.launch({
                            headless: false
                        });
                        const page = await browser.newPage();
                        await page.goto('https://mail.google.com/');
                        await typeAndSubmit(page, 'input[name=identifier]', receiver.login);
                        await page.waitFor(1000);
                        await typeAndSubmit(page, 'input[name=password]', receiver.password);
                        await page.waitFor(5000);
                        const [openLastMail] = await page.$x("//*[@id=':2d']/tbody/tr[1]");
                        await openLastMail.click();
                        await page.waitFor(3000);
                        const [readLastMail] = await page.$x("//*[@role='listitem']/div[1]/div[1]/div[1]/div[1]/div[1]/div[2]/div[3]/div[3]/div[1]/div[1]");
                        let receivedText = '';
                        await readLastMail.evaluate(node => node.innerText).then(res => receivedText = res.trim());
                        let fromAPIText = '';
                        booksOfGenre.forEach(book => fromAPIText += `${book}\n`);
                        if (fromAPIText.trim() == receivedText.trim()) {
                            console.log("Success")
                        } else {
                            console.log("Error")
                        }

                    })(booksOfGenre, Receiver);
                })         

            })
            .catch(error => {
                console.log(error);
            });
    })
    .catch(error => {
        console.log(error);
    });



