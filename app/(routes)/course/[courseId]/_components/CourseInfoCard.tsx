import { Course } from '@/app/type/CourseType'
import React from 'react'
import { BookOpen, ChartNoAxesColumnIncreasing, Sparkles } from 'lucide-react'
import {Player} from '@remotion/player'
import { AspectRatio } from 'radix-ui'
import ChapterVideo from './ChapterVideo'

type Props={
  course:Course | undefined
}

function CourseInfoCard({course}:Props ) {

    // get the course information from the databse
  return (
    <div className="px-8">
      <div className="mt-9 rounded-2xl text-white" style={{background: 'linear-gradient(135deg, #020617 0%, #1e293b 50%, #064e3b 100%)', padding: '100px'}}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="flex gap-2 p-1 px-2 border border-white/20 rounded-2xl inline-flex text-white border-gray-200/70">
              <Sparkles /> Course Preview
            </h2>

            <h2 className="text-4xl font-bold mt-4 text-white">{course?.courseName}</h2>

            <p className="text-lg text-muted-foreground mt-3">
              {course?.courseLayout?.courseDescription}
            </p>

            <div className="mt-4 flex gap-5 text-white">
              <h2 className="px-3 p-2 border border-white/20 rounded-2xl flex gap-2 items-center inline-flex">
                <ChartNoAxesColumnIncreasing style={{ color: "#3b82f6" }} />
                {course?.courseLayout?.level}
              </h2>
              <h2 className="px-3 p-2 border border-white/20 rounded-2xl flex gap-2 items-center inline-flex">
                <BookOpen style={{ color: "#22c55e" }} />
                {course?.courseLayout?.totalChapters} Chapters
              </h2>
            </div>
          </div>
          
          <div className='flex items-center justify-center'>
            <div className='border-4 border-white/30 rounded-2xl overflow-hidden bg-black/20 shadow-xl w-full' style={{aspectRatio: '16/9'}}>
              <Player
                component={ChapterVideo}
                durationInFrames={30}
                compositionWidth={1280}
                compositionHeight={720}
                fps={30}
                controls
                style={{
                  width:'100%',
                  height: '100%'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CourseInfoCard
