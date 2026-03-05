import { Course } from '@/app/type/CourseType'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Dot } from 'lucide-react'
import React from 'react'
import { Player } from '@remotion/player'
import { CourseComposition } from './ChapterVideo'


type Props = {
  course: Course | undefined,
  durationsBySlideId:Record<string,number> | null
}

function CourseChapters({ course ,durationsBySlideId }: Props) {


  const slides=course?.chapterContentSlides??[];
  const GetChapterSlides = (chapterId: string) => {
    return course?.chapterContentSlides.filter((slide) => slide.chapterId === chapterId) ?? [];
  };

  const GetChapterDurationInFrame = (chapterId: string) => {
    if (!durationsBySlideId || !course) return 30;

    const chapterSlides = course.chapterContentSlides.filter((slide) => slide.chapterId === chapterId);
    const slideDuration = chapterSlides.reduce((sum, slide) => sum + (durationsBySlideId[slide.slideId] ?? 30), 0);
    const gapDuration = Math.max(0, chapterSlides.length - 1) * 30; // 1 second gap = 30 frames
    
    return Math.max(30, slideDuration + gapDuration);
  };
  return (
    <div className="w-full px-6 mb-20 relative">
      {/* Preview Container */}
      <div
        className="max-w-6xl mx-auto -mt-24 bg-white/90 backdrop-blur-lg border rounded-xl shadow-lg relative z-10"
        style={{ padding: "40px" }}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-8 ">
          <h2 className="font-bold text-xl">Course preview</h2>
          <h2 className="text-sm text-gray-500">Chapter and Short Preview</h2>
        </div>

        {/* Cards inside preview box */}
        <div className="space-y-8">
          {course?.courseLayout?.chapters.map((chapter, index) => (
            <Card key={index} className="rounded-xl shadow-sm border bg-white">
              <CardHeader>
                <div className="flex gap-4 items-center">
                  {/* Number Circle */}
                  <div
                    className="flex items-center justify-center font-bold flex-shrink-0"
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      fontSize: "20px",
                    }}
                  >
                    {index + 1}
                  </div>

                  <CardTitle className="md:text-xl text-base font-bold">
                    {chapter.chapterTitle}
                  </CardTitle>
                </div>
              </CardHeader>

              <CardContent>
                <div className="flex items-start justify-between gap-10">
                  {/* Sub Content */}
                  <div className="space-y-2">
                    {chapter?.subContent.map((content, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <Dot className="h-5 w-5 text-blue-500" />
                        <h2 className="text-sm text-gray-700">{content}</h2>
                      </div>
                    ))}
                  </div>

                  {/* Video Player */}
                  <div
                    className="border-2 border-gray-300 rounded-xl overflow-hidden bg-gray-100 shadow-md flex-shrink-0"
                    style={{ width: "300px", aspectRatio: "16/9" }}
                  >
                    <Player
                      component={CourseComposition}
                      durationInFrames={GetChapterDurationInFrame(
                        chapter?.chapterId,
                      )}
                      compositionWidth={1280}
                      compositionHeight={720}
                      fps={30}
                      controls
                      inputProps={{
                        // @ts-ignore
                        slides: GetChapterSlides(chapter?.chapterId),
                        durationsBySlideId: durationsBySlideId ?? {},
                      }}
                      style={{
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CourseChapters