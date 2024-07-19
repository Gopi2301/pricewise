import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractPrice } from "../utils";
export async function scrapeAmazonProduct(url:string) {
    if(!url) return;
    const username = String(process.env.BRIGHT_DATA_USERNAME)
    const password = String(process.env.BRIGHT_DATA_PASSWORD)
    const port = 22225
    const session_id= (1000000 * Math.random()) | 0;
    const options = {
        auth:{
            username: `${username}-session-${session_id}`,
            password,
        },
        host:'brd.superproxy.io',
        port,
        rejectUnauthorized:false
    }

    try{
        // Fetch the Product page
        const response = await axios.get(url,options)
        const $ = cheerio.load(response.data) 
        // Extract the Product Title
        const title = $('#productTitle').text().trim();
        const currentPrice = extractPrice(
            $('.priceToPay span.a-price-whole')
        )
        const originalPrice = extractPrice(
            $('.a-price.a-text-price span.a-offscreen') 
            // $('.a-size-base.a-color-price')
        )
        const outOfStock=$('#availability span.a-declarative span.a-size-medium.a-color-success').text().trim().toLowerCase() === 'currently unavailable.' 
        const images=
        $('#imgBlkFront').attr('data-a-dynamic-image') ||
        $('#landingImage').attr('data-a-dynamic-image') ||
        '{}'
        const imageUrls= Object.keys(JSON.parse(images))
        const currency= extractCurrency(
            $('.a-price-symbol')
        )
        const discountRate = $('.savingsPercentage').text().replace(/[-%]/g, "")
        console.log({title, currentPrice, originalPrice, outOfStock, imageUrls, currency, discountRate});
        
    }catch(error:any){
        throw new Error(`Failed to scrape product:${error.message}`)
    }
}