"use client"
import React, { useEffect, useState } from "react";
import CourseInfoCard from "./_components/CourseInfoCard";
import axios from "axios";
import { useParams } from "next/navigation";
import { Course } from "@/app/type/CourseType";
import CourseList from "@/app/_components/CourseList";
import CourseChapters from "./_components/CourseChapters";

function coursePreview() {
  const {courseId} = useParams();
  const[courseDetail,setCourseDetail]=useState<Course>();

  useEffect(() => {
    courseId && GetCourseDetail();
  }, [courseId]);

  const GetCourseDetail = async ( ) => {
    const result = await axios.get('/api/course?courseId=' + courseId);
    console.log(result.data);
    setCourseDetail(result.data);
  };

  return (
    <div className="flex flex-col items-center">
      <CourseInfoCard course={courseDetail} />
      <CourseChapters course={courseDetail} />
    </div>
  );
}

export default coursePreview;
