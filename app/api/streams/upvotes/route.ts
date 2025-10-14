import { prisma } from "@/app/lib/db";
import { getServerSession } from "next-auth";

import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const upvoteReq = z.object({
    // userId:z.string(),
    streamId : z.string(),
    action:z.enum(["upvote","remove"])
})
export async function POST(req:NextRequest) {
        const data = upvoteReq.parse(await req.json());

        const session = await getServerSession();
        console.log(session)
        const user = await prisma.user.findUnique({
            where:{
                email: session?.user?.email ??""
            }
        })
        console.log("hell",user?.id)
        if(!user){
            return NextResponse.json({
                message:"You are not logged in ||| Unauthorised"
            },{
                status:403
            })
        }

    try{
        if(data.action==="upvote"){
            await prisma.upvote.upsert({
                where:{
                    userId_streamId:{
                        userId:user.id,
                        streamId:data.streamId
                    }
                },
                update:{},
                create:{
                    userId:user.id,
                    streamId:data.streamId
                }
            })
            
        }
        else if(data.action==="remove"){
            await prisma.upvote.deleteMany({
                where:{
                    userId:user.id,
                    streamId:data.streamId
                }
            })
        }
        const upvoteCount = await prisma.upvote.count({
            where:{
                streamId:data.streamId
            }
        })
        return NextResponse.json({
                message:
                    data.action === "upvote" ? "upvoted the stream" : "remove the upvoted"  ,
                    upvotes : upvoteCount   
            },
        {
            status:200
        })

    }catch(err){
        console.error(err)
        return NextResponse.json({
                message:"Something went wrong on our side "
            },{
                status:500
            })
    }
}