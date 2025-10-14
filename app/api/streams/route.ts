
import { prisma } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import {z} from "zod";
const youtubesearchapi = require("youtube-search-api");


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

        const res = await youtubesearchapi.GetVideoDetails(extractedId);
        console.log(res.title);
        console.log(res.thumbnail.thumbnails)
        const thumbnails = res.thumbnail.thumbnails.sort((a:{width:number},b:{width:number})=> a.width<b.width ? -1:1)
        const stream = await prisma.stream.create({
            data:{
                userId:data.creatorId,
                url:data.url,
                extracedId:extractedId,
                type: "Youtube",
                title: res.title ?? "cant find video",
                smallImg:(thumbnails.length>1 ? thumbnails[0].url:thumbnails[thumbnails.length-1].url)??"https://i0.wp.com/whatvwant.com/wp-content/uploads/2015/09/Unable-to-load.png",
                bigImg:(thumbnails[thumbnails.length-1].url)??"https://i0.wp.com/whatvwant.com/wp-content/uploads/2015/09/Unable-to-load.png"
            }
        })
        return NextResponse.json({
            message:"added stream successfully",
            id : stream.id
        },{
            status:200
        })
    }catch(err){
        console.error(err)
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