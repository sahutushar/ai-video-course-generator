import React from 'react'
import { Course } from '../type/CourseType'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Layers ,Calendar,Play, Dot} from 'lucide-react'
import { Button } from "@/components/ui/button";
import moment from 'moment'
import Link from 'next/link';




type Props={
    courseItem:Course
}
function CourseListCard({courseItem}:Props) {
  return (
    // <div className='w-full'>
    <Card className="bg-white z-10">
      <CardHeader>
        <div className="flex justify-between items-center">
          <h2 className="font-medium text-md">{courseItem?.courseName}</h2>
          <h2 className="text-primary text-sm bg-primary/10 p-1 px-2 border rounded-4xl border-primary">
            {courseItem?.courseLayout?.level}
          </h2>
        </div>

        <div className=" flex gap-3 items-center">
          <h2 className="text-slate-600 gap-2 flex items-center gap text-xs bg-slate-400/10 p-1 px-2 border rounded-4xl border-slate">
            <Layers className="h-4 w-4" />
            {courseItem?.courseLayout?.totalChapters}chapters
          </h2>
          <h2 className="text-slate-600 gap-2 flex items-center gap text-xs bg-slate-400/10 p-1 px-2 border rounded-4xl border-slate">
            <Calendar className="h-4 w-4" />
            {moment(courseItem?.createdAt).format("MMM DD,YYYY")}
            <Dot className='h-4 w-4'/>
                {moment(courseItem?.createdAt).fromNow()}
            
            
          </h2>
        </div>
      </CardHeader>

      <CardContent>
        <div className='flex justify-between items-center'>
          <p >Keep Learning...</p>
        <Link href={'/course/'+courseItem?.courseId}>
          <Button>
            Watch Now
            <Play/>
          </Button>
          </Link>
          
        </div>
      </CardContent>
    </Card>
  );
}

export default CourseListCard
