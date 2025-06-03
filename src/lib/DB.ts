import mongoose from "mongoose";

const connectDB = async (): Promise<string> => {
    try {
        await mongoose.connect(process.env.MONGODB_URI as string);
        console.log(`Database Connected`);

        return "Database Connected";
    } catch (error) {
        if (error instanceof Error) {
            console.log(error);

            return error.message;
        }
        return "Unknown error occurred";
    }
}

export default connectDB;