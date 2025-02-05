"use server"

import Projects from "@/database/projects.model"
import { connectToDatabase } from "@/lib/mongoose"

export const getProjects = async (): Promise<string> => {
    try {
        await connectToDatabase()
        const news = await Projects.find({})
        return JSON.stringify(news)
    } catch (error) {
        console.log(error)
        return error as string
    }
}