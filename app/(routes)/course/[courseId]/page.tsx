"use client";

import React, { useEffect, useState } from "react";
import CourseInfoCard from "./_components/CourseInfoCard";
import axios from "axios";
import { useParams } from "next/navigation";
import { Course } from "@/app/type/CourseType";
import CourseChapters from "./_components/CourseChapters";
import { toast } from "sonner";
import { getAudioData } from "@remotion/media-utils";

function CoursePreview() {
  const { courseId } = useParams();
  const [courseDetail, setCourseDetail] = useState<Course | undefined>();

  const fps = 30;
  const slides = courseDetail?.chapterContentSlides ?? [];

  const [durationsBySlidesId, setDurationsBySlideId] = useState<Record<
    string,
    number
  > | null>(null);

  useEffect(() => {
    if (courseId) {
      GetCourseDetail();
    }
  }, [courseId]);

  const GetCourseDetail = async () => {
    const loadingToast = toast.loading("Fetching Course Details...");

    const result = await axios.get("/api/course?courseId=" + courseId);

    setCourseDetail(result.data);

    toast.success("Course Details Fetched Successfully!", {
      id: loadingToast,
    });

    if (result?.data?.chapterContentSlides?.length === 0) {
      GenerateVideoContent(result?.data);
    }
  };

  const GenerateVideoContent = async (course: Course) => {
    const chapters = course?.courseLayout?.chapters ?? [];

    for (let i = 0; i < chapters.length; i++) {
      const toastLoading = toast.loading(
        "Generating Video Content for Chapter " + (i + 1),
      );

      try {
        const result = await axios.post("/api/generate-video-content", {
          chapter: chapters[i],
          courseId: course?.courseId,
        });

        console.log(result.data);

        toast.success("Video Content Generated for Chapter " + (i + 1), {
          id: toastLoading,
        });
        
        // Wait 3 seconds between chapters to avoid overwhelming the database
        if (i < chapters.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      } catch (error) {
        console.error('Chapter generation failed:', error);
        toast.error("Failed to generate Chapter " + (i + 1), {
          id: toastLoading,
        });
      }
    }
    
    GetCourseDetail();
  };

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      if (!slides.length) return;

      const entries = await Promise.all(
        slides.map(async (slide) => {
          try {
            const audioData = await getAudioData(slide.audioFileUrl);
            const audioSec = audioData.durationInSeconds;

            const frames = Math.max(1, Math.ceil(audioSec * fps));

            return [slide.slideId, frames] as const;
          } catch (error) {
            console.error("Audio decoding failed:", slide.audioFileUrl);

            return [slide.slideId, fps * 6] as const;
          }
        }),
      );

      if (!cancelled) {
        setDurationsBySlideId(Object.fromEntries(entries));
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [slides]);

  return (
    <div className="flex flex-col items-center">
      <CourseInfoCard
        course={courseDetail}
        durationsBySlideId={durationsBySlidesId}
      />

      <CourseChapters
        course={courseDetail}
        durationsBySlideId={durationsBySlidesId}
      />
    </div>
  );
}

export default CoursePreview;
