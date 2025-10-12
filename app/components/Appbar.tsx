"use client";
import { signIn, signOut, useSession } from "next-auth/react"

export function Appbar(){
    const session = useSession();
    return (
        <>
        <div className="flex justify-between">
            <div>
                Music
            </div>
            <div>
                {session.data?.user && <button className="m-2 p-2 bg-blue-700"  onClick={()=> signOut()}>Logout</button>}
                {!session.data?.user && <button className="m-2 p-2 bg-blue-700"  onClick={()=> signIn()}>Signin</button>}
            </div>
            </div>
        </>
    )
}