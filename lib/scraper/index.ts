import axios from "axios";
import * as cheerio from "cheerio";
import { extractCurrency, extractDescription, extractPrice } from "../utils";
import { Average } from "next/font/google";
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
        const description =extractDescription($);
        // Construct data object with scraped information
        const data = {
            url,
            currency: currency || '₹',
            image:imageUrls[0],
            currentPrice:Number(currentPrice) || Number(originalPrice),
            originalPrice:Number(originalPrice) ||Number(currentPrice),
            priceHistory:[],
            discountRate:Number(discountRate),
            category:'category',
            reviewsCount: 100,
            stars:4.5,
            isOutOfStock:outOfStock,
            description,
            lowestPrice:Number(currentPrice) || Number(originalPrice),
            highestPrice:Number(originalPrice) ||Number(currentPrice),
            average:Number(currentPrice) || Number(originalPrice)

        }
       return data;
        
    }catch(error:any){
        throw new Error(`Failed to scrape product:${error.message}`)
    }
}