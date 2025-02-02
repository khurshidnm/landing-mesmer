"use server"

import News from "@/database/news.model"
import { connectToDatabase } from "@/lib/mongoose"
import { NewsItem } from "@/types/news"

export const getNews = async (): Promise<string> => {
    try {
        await connectToDatabase()
        const news = await News.find({})
        return JSON.stringify(news)
    } catch (error) {
        console.log(error)
        return error as string
    }
}