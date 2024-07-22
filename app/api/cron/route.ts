import Product from "@/lib/models/product.model";
import { connectToDB } from "@/lib/mongoose"
import { generateEmailBody, sendEmail } from "@/lib/nodemailer";
import { scrapeAmazonProduct } from "@/lib/scraper";
import { getAveragePrice, getEmailNotifType, getHighestPrice, getLowestPrice } from "@/lib/utils";
import { NextResponse } from "next/server";

export const maxDuration = 300;
export const dynamic ='force-dynamic';
export const revalidate = 0;
export async function GET(){
try {
    connectToDB();
    const products = await Product.find({});
    if(!products) throw new Error('No Product');
    // Scrape Latest Product Details & Update DB
    const updatedProducts = await Promise.all(
        products.map(async(currentProduct)=>{
            const scrapedProduct = await scrapeAmazonProduct(currentProduct.url);
            if(!scrapedProduct) throw new Error("No product found!");
            const UpdatedPriceHistory=[
                ...currentProduct.priceHistory,
                {price: scrapedProduct.currentPrice}
            ]
            const product={
                ...scrapedProduct,
                priceHistory:UpdatedPriceHistory,
                lowestPrice:getLowestPrice(UpdatedPriceHistory),
                highestPrice:getHighestPrice(UpdatedPriceHistory),
                averagePrice:getAveragePrice(UpdatedPriceHistory)
            }
            const updatedProduct = await Product.findOneAndUpdate(
                {url: product.url},
                product
            );
            // 2. Check Each Product Status
            const emailNotifType = getEmailNotifType(scrapedProduct, currentProduct)
            if(emailNotifType && updatedProduct.users.length > 0){
                const productInfo = {
                    title:updatedProduct.title,
                    url:updatedProduct.url,
                }
                const emailContent = await generateEmailBody(productInfo, emailNotifType);
                const userEmails = updatedProduct.users.map((user:any)=>user.email);
                await sendEmail(emailContent, userEmails)
            }
            return updatedProduct
        })
    )
    return NextResponse.json({
        message:'ok',
        data:updatedProducts
    })
} catch (error:any) {
    throw new Error(`Error in GET ${error.message}`)
}
} 