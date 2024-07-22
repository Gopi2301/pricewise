"use server"

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper"
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
import { User } from "@/types";
import { generateEmailBody, sendEmail } from "../nodemailer";

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
export async function getProductById(productId: string){
try {
    connectToDB()
        const product = await Product.findOne({_id: productId});
        if(!product) {
            console.log("fetch By Url Product not found")
            return null;
        }
        return product;
            
} catch (error:any) {
    throw new Error(`error fetchById ${error.message}`)
}
}
export async function getAllProducts(){
    try {
        connectToDB();
        const products = await Product.find()
        return products
    } catch (error) {
        console.log(error)
    }
}
export async function getSimilarProduct(productId: string){
    try {
        connectToDB()
        const currentProduct = await Product.findById(productId);
        if (!currentProduct) return null;
        const similarProducts = await Product.find({
            _id:{$ne:productId},
        }).limit(3);
        return similarProducts;
                
    } catch (error:any) {
        throw new Error(`error fetchById ${error.message}`)
    }
    }
export async function addUserEmailToProduct(productId:string, userEmail:string){
    try {
        // send our first email
        const product = await Product.findById(productId);
        if(!product) return;
        const userExist = product.users.some((user:User)=>user.email === userEmail)
        if(!userExist){
            product.users.push({email:userEmail});
            await product.save();

            const emailContent = await generateEmailBody(product,"WELCOME");
            await sendEmail(await emailContent,[userEmail])

        }
    } catch (error) {
        console.log(error)
    }

}