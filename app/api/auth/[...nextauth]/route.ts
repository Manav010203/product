import { prisma } from "@/app/lib/db";
import NextAuth from "next-auth";
// import { NextResponse } from "next/server";
import GoogleProvider  from "next-auth/providers/google";
import { NextResponse } from "next/server";

const handler = NextAuth({
    providers:[
        GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID ??"",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET??""
  })
    ],
    callbacks:{
        async signIn(param) {
            if(!param.user.email){
                return false;
            }
            try{
                await prisma.user.create({
                    data:{
                        email:param.user.email,
                        provider:"Google"
                    }
                })
            }catch(err){
               
            }
            return true;
        }
    }
})

export {handler as GET, handler as POST}