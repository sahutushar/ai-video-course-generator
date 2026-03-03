import {client} from "@/config/openai";
import { Course_config_prompt } from "@/app/data/Prompt";
import{NextRequest} from "next/server";
import { NextResponse } from "next/server";
import { db } from "@/config/db";
import { coursesTable } from "@/config/schema";
import { currentUser } from "@clerk/nextjs/server";


export async function POST(req:NextRequest){
    const{userInput,courseId,type}=await req.json();
    const user=await currentUser();

    const response=await client.chat.completions.create({
        model:'gpt-4o',
        messages:[
            {role:'system',content:Course_config_prompt},
            {role:'user',content:'Course Topic is'+userInput}
        ]
    });

    const rawResult=response.choices[0].message?.content||'';
    const JSONResult=JSON.parse(rawResult);

    // Save to DB

    const courseResult=await db.insert(coursesTable).values({
        courseId:courseId,
        courseName:JSONResult.courseName,
        userInput:userInput,
        type:type,
        courseLayout:JSONResult,
        userId:user?.primaryEmailAddress?.emailAddress|| ''
    }).returning();

    return NextResponse.json(courseResult[0]);
}