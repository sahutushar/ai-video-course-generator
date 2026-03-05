import { chapterContentSlides, coursesTable, } from "@/config/schema";
import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/config/db";



export async function GET(req: NextRequest) {
  const courseId =await req.nextUrl.searchParams.get('courseId');

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
