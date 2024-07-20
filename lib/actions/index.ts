"use server"

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper"
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";

export async function scrapeandStoreProduct(productUrl:string){
    if(!productUrl) return
    try {
        connectToDB();
        const scrapedProduct = await scrapeAmazonProduct(productUrl)
        if (!scrapedProduct) return;
        let product = scrapedProduct

        const existingProduct = await Product.findOne({url:scrapedProduct.url})
        if (existingProduct){
            const UpdatedPriceHistory : any=[
                ...existingProduct.priceHistory,
                {price: scrapedProduct.currentPrice}
            ]
            product={
                ...scrapedProduct,
                priceHistory:UpdatedPriceHistory,
                lowestPrice:getLowestPrice(UpdatedPriceHistory),
                highestPrice:getHighestPrice(UpdatedPriceHistory),
                averagePrice:getAveragePrice(UpdatedPriceHistory)
            }
        }
        const newProduct = await Product.findOneAndUpdate(
            {url: scrapedProduct.url},
            product,
            {upsert:true, new:true}
        );
        revalidatePath(`/products/${newProduct._id}`);
        
    } catch (error:any) {
        throw new Error(`Failed to create/update product: ${error.message}`)
    }
}