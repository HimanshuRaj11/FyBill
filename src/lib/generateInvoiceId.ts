export function generateInvoiceId() {
    const now = new Date();
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const randomLetter = letters[Math.floor(Math.random() * letters.length)];

    // Extract components
    const year = now.getFullYear().toString().slice(-2); // Last 2 digits of year (e.g., "25")
    const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Month (01-12)
    const hours = now.getHours().toString().padStart(2, "0"); // Hours (00-23)
    const minutes = now.getMinutes().toString().padStart(2, "0"); // Minutes (00-59)
    const seconds = now.getSeconds().toString().padStart(2, "0"); // Seconds (00-59)


    return `${year}${month}${hours}${minutes}${seconds}${randomLetter}`;

}