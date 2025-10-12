
import { prisma } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";

const YT_regex = new RegExp("^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})(?:[?&].*)?")
const CreatorStreamScheme=z.object({
creatorId : z.string(),
url : z.string()
})
export async function POST(req:NextRequest) {
    try{
        const data = CreatorStreamScheme.parse(await req.json());
        const isyt = YT_regex.test(data.url);
        if(!isyt){
            return NextResponse.json({
                message:"Url is not correct"
            },{
                status:411
            })
        }
        const extractedId = data.url.split("?v=")[1];
        await prisma.stream.create({
            data:{
                userId:data.creatorId,
                url:data.url,
                extracedId:extractedId,
                type: "Youtube" 
            }
        })
    }catch(err){
        return NextResponse.json({
            message:"Error occur wil posting"
        },{
            status:411
        })
    }
}




export async function GET(req:NextRequest) {
    try{
        const creatorId = req.nextUrl.searchParams.get("creatorId");
        const streams = await prisma.stream.findMany({
            where:{
                userId:creatorId||""
            }
        })
        return NextResponse.json({
            streams
        })
    }catch(err){
        return NextResponse.json({
            message:"Error from our side"
        },{
            status:400
        })
    }
}