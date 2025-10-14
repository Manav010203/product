import { prisma } from "@/app/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try{const session = await getServerSession();
    if(!session?.user?.email){
        return NextResponse.json({message:"Not valid data send in request body"},{status:402});
    }
    const res= await prisma.user.findUnique({
        where:{
            email:session.user.email
        }
    })
    if(!res){
        return NextResponse.json({
            message:"user not found"
        },{
            status:404
        })
    }
    console.log(res)
    return NextResponse.json(res,{status:200})
}catch(err){
    console.error(err);
    return NextResponse.json({
        message:"Something went wrong"
    },{
        status:500
    })
}
}