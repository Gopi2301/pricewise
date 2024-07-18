export function extractPrice(...elements:any){
    for (const element of elements){
        const priceText = element.text().trim()

        const priceMatch = priceText.match(/\d+/);
        if (priceMatch) return priceMatch[0];
    }
    return '';
}