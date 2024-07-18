import axios from "axios";
import * as cheerio from "cheerio";
import { extractPrice } from "../utils";
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
            $('.a-price .aok-align-center .reinventPricePriceToPayMargin .priceToPay'),
            $('.aok-offscreen')
        )
        console.log({title, currentPrice});
        
    }catch(error:any){
        throw new Error(`Failed to scrape product:${error.message}`)
    }
}