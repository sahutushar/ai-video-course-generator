"use client"
import React, { useEffect, useState } from "react";
import CourseInfoCard from "./_components/CourseInfoCard";
import axios from "axios";
import { useParams } from "next/navigation";
import { Course } from "@/app/type/CourseType";
import CourseList from "@/app/_components/CourseList";
import CourseChapters from "./_components/CourseChapters";
import { toast } from "sonner";
import { index } from "drizzle-orm/gel-core";

function coursePreview() {
  const {courseId} = useParams();
  const[courseDetail,setCourseDetail]=useState<Course>();

  useEffect(() => {
    courseId && GetCourseDetail();
  }, [courseId]);

  const GetCourseDetail = async ( ) => {
   const loadingToast= toast.loading('Fetching Course Details...');
    const result = await axios.get('/api/course?courseId=' + courseId);
    console.log(result.data);
    setCourseDetail(result.data);
    toast.success('course Details Fetched Successfully!',{id:loadingToast});
    if(result?.data?.chapterContentSlides?.length === 0){
      //Generate Video subContent
      GenerateVideoContent(result?.data);

  }
  };



  const GenerateVideoContent=async(course:Course)=>{


    for(let i=0;i<course?.courseLayout?.chapters?.length;i++){
   
 
  if(i>0) break;  // For Testing,Remove this line after
   const toastLoading = toast.loading(
     "Generating Video Content for Chapter " + (i + 1),
   );
     const result=await axios.post('/api/generate-video-content',{
      chapter:course?.courseLayout?.chapters[0],
      courseId:course?.courseId
    });

    console.log(JSON.stringify(result.data));

    toast.success('Video Content Generated for Chapter '+(i+1),{id:toastLoading});
 }
   
  
  
  }


  return (
    <div className="flex flex-col items-center">
      <CourseInfoCard course={courseDetail} />
      <CourseChapters course={courseDetail} />
    </div>
  );
}

export default coursePreview;
