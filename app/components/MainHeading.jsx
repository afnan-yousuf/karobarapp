'use client'

import Image from "next/image";
import { useState } from "react";

export default function MainHeading({a,b}){

    const [age, setAge] = useState(8);
    const [fname, setfName] = useState("");
    const [isloading, setisLoading] = useState(false)

    console.log("Conponent Called")

    function increaseAge(){
        setAge(age+1)
    }

    return (
        <>
            <h1 className="text-xl">{a+b}</h1>
            <p>Age is: {age}</p>
            {
                age >= 18 && <p>You are Eligible for NIC</p>
            }
            <input type="button" className="bg-green-300" value="Click me" onClick={()=>{increaseAge()}} />

            <input type="text" className="border" value={fname} onChange={(e)=>{setfName(e.target.value)}} />

            {
                isloading && <Image src="/loading.gif" width="100" height="100" alt="loading" />
            }

            <input type="button" className="bg-blue-500 p-4" value="OK" onClick={()=>{setisLoading(!isloading)}}/>
        </>
    );
}