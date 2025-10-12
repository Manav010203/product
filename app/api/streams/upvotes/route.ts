import { prisma } from "@/app/lib/db";
import { getServerSession } from "next-auth";

import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const upvoteReq = z.object({
    userId:z.string(),
    streamId : z.string(),
    upvote:z.boolean()
})
export async function POST(req:NextRequest) {
        const data = upvoteReq.parse(await req.json());

        const session = await getServerSession();
        const user = await prisma.user.findFirst({
            where:{
                id: session?.user?.email ??""
            }
        })
        if(!user){
            return NextResponse.json({
                message:"You are not logged in ||| Unauthorised"
            },{
                status:403
            })
        }

    try{
        const upvoting = await prisma.upvote.create({
            data:{
                userId:user.id,
                streamId:data.streamId
            }
        })
    }catch(err){
        return NextResponse.json({
                message:"You are tryiing to upvote same stream twice"
            },{
                status:403
            })
    }
}