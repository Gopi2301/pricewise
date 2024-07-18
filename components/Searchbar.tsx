"use client"
import { scrapeandStoreProduct } from "@/lib/actions";
import { parseUrl } from "next/dist/shared/lib/router/utils/parse-url"
import { FormEvent, useState } from "react"

const SearchBar = () => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isValidAmazonProductURL = (url:string)=>{
    try {
      const parsedUrl = new URL(url);
      const hostName= parsedUrl.hostname
      if (
        hostName.includes('amazon.in') ||
        hostName.includes('amazon.com')
      ){
        return true
      }
    } catch (error) {
      return false
    }
    return false
  };  
  const handleSubmit=async(event: FormEvent<HTMLFormElement>)=>{
    event.preventDefault();
    const isValidLink= isValidAmazonProductURL(searchPrompt)
    if(!isValidLink)return alert("Please provide valid amazon product link!!")
    try {
      setIsLoading(true)

      // Let's the Web scraping Begins here!!
      const product = await scrapeandStoreProduct(searchPrompt);
    } catch (error) {
      
    }finally{
      setIsLoading(false)
    }
  } 
  return (
  <form className='flex flex-wrap gap-4 mt-12' onSubmit={handleSubmit}>
    <input type="text" value={searchPrompt} onChange={(e)=>setSearchPrompt(e.target.value)} placeholder="Enter product link" className="searchbar-input" />
    <button type="submit" className="searchbar-btn" disabled={searchPrompt ===""}>{isLoading ? "Searching..." : "Search"}</button>
    
  </form>
    
)
}

export default SearchBar
