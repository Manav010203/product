
import { prisma } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";

var YT_regex = /^(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com\/(?:watch\?(?!.*\blist=)(?:.*&)?v=|embed\/|v\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})(?:[?&]\S+)?$/
const CreatorStreamScheme=z.object({
creatorId : z.string(),
url : z.string()
})
export async function POST(req:NextRequest) {
    try{
        const data = CreatorStreamScheme.parse(await req.json());
        const isyt = data.url.match(YT_regex);
        if(!isyt){
            return NextResponse.json({
                message:"Url is not correct"
            },{
                status:411
            })
        }
        const extractedId = data.url.split("?v=")[1];
        const stream = await prisma.stream.create({
            data:{
                userId:data.creatorId,
                url:data.url,
                extracedId:extractedId,
                type: "Youtube" 
            }
        })
        return NextResponse.json({
            message:"added stream successfully",
            id : stream.id
        },{
            status:200
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