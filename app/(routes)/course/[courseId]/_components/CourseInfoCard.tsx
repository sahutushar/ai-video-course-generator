import { Course } from "@/app/type/CourseType";
import React, { useMemo } from "react";
import { BookOpen, ChartNoAxesColumnIncreasing, Sparkles } from "lucide-react";
import { Player } from "@remotion/player";
import { CourseComposition } from "./ChapterVideo";


type Props = {
  course: Course | undefined;
  durationsBySlideId: Record<string, number> | null;
};

function CourseInfoCard({ course, durationsBySlideId }: Props) {
  const fps = 30;
  const slides = course?.chapterContentSlides ?? [];

  console.log('CourseInfoCard - slides:', slides.length);
  console.log('CourseInfoCard - durationsBySlideId:', durationsBySlideId);

  const durationInFrames = useMemo(() => {
    if (!durationsBySlideId) return 30;

    const slideDuration = slides.reduce((sum, slide) => {
      return sum + (durationsBySlideId[slide.slideId] ?? fps * 6);
    }, 0);
    
    const gapDuration = Math.max(0, slides.length - 1) * fps; // 1 second gap between slides
    
    return Math.max(30, slideDuration + gapDuration);
  }, [durationsBySlideId, slides, fps]);

  if (!durationsBySlideId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="px-8">
      <div
        className="mt-9 rounded-2xl text-white"
        style={{
          background:
            "linear-gradient(135deg, #020617 0%, #1e293b 50%, #064e3b 100%)",
          padding: "100px",
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* LEFT SIDE */}
          <div>
            <h2 className="flex gap-2 p-1 px-2 border border-white/20 rounded-2xl inline-flex">
              <Sparkles /> Course Preview
            </h2>

            <h2 className="text-4xl font-bold mt-4">{course?.courseName}</h2>

            <p className="text-lg text-muted-foreground mt-3">
              {course?.courseLayout?.courseDescription}
            </p>

            <div className="mt-4 flex gap-5">
              <h2 className="px-3 p-2 border border-white/20 rounded-2xl flex gap-2 items-center">
                <ChartNoAxesColumnIncreasing style={{ color: "#3b82f6" }} />
                {course?.courseLayout?.level}
              </h2>

              <h2 className="px-3 p-2 border border-white/20 rounded-2xl flex gap-2 items-center">
                <BookOpen style={{ color: "#22c55e" }} />
                {course?.courseLayout?.totalChapters} Chapters
              </h2>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center justify-center">
            <div
              className="border-4 border-white/30 rounded-2xl overflow-hidden bg-black/20 shadow-xl w-full"
              style={{ aspectRatio: "16/9" }}
            >
              <Player
                acknowledgeRemotionLicense
                component={CourseComposition}
                durationInFrames={durationInFrames}
                compositionWidth={1280}
                compositionHeight={720}
                fps={fps}
                controls
                inputProps={{// @ts-ignore
                slides, durationsBySlideId: durationsBySlideId}}
                style={{
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseInfoCard;
