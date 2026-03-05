import { chapterContentSlides, coursesTable, } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/config/db";
import { currentUser } from "@clerk/nextjs/server";
import { User } from "lucide-react";



export async function GET(req: NextRequest) {
  const courseId =await req.nextUrl.searchParams.get('courseId');
const user=await currentUser();
  if(!courseId){
    const userCourses=await db.select().from(coursesTable)
    .where(eq(coursesTable.userId,user?.primaryEmailAddress?.emailAddress as string))
    .orderBy(desc(coursesTable.id));

    return NextResponse.json(userCourses);
  }

  if (!courseId) {
    return NextResponse.json(
      { error: "courseId is required" },
      { status: 400 },
    );
  }

  const courses = await db
    .select()
    .from(coursesTable)
    .where(eq(coursesTable.courseId, courseId));

    const chapterContentSlide=await db.select().from(chapterContentSlides)
    .where(eq(chapterContentSlides?.courseId,courseId as string));

  return NextResponse.json({
    ...courses[0],
    chapterContentSlides:chapterContentSlide
});

}
