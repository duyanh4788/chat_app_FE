import puppeteer, { Browser, Page } from 'puppeteer';
import { describe, expect, test } from '@jest/globals';

let browser: Browser;
let page: Page;

describe('handle browser', () => {
    test('launch browser', async () => {
        browser = await puppeteer.launch({ headless: false });
        page = await browser.newPage();
        await page.goto('localhost:3008');
    });
});

describe('handle expect DOMHTML', () => {
    test('expect html', async () => {
        const text = await page.$eval('h1', el => el.innerHTML);
        expect(text).toEqual('Chat App');
    });
});
