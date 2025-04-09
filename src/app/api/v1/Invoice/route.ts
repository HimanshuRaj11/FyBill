import { connectToDatabase } from "@/lib/DB";

export async function POST(request: Request) {

    try {
        await connectToDatabase()
    } catch (error) {

    }

}