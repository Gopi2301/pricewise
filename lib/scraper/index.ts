import axios from "axios";
import * as cheerio from "cheerio";
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
        console.log(response.data)
        console.log("success")
    }catch(error:any){
        throw new Error(`Failed to scrape product:${error.message}`)
    }
}