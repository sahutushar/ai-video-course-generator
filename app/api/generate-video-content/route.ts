import { NextRequest ,NextResponse } from "next/server";
import { client } from "@/config/openai";
import { GENERATE_VIDEO_CONTENT_PROMPT } from "@/app/data/Prompt";
import { VideoSlidesDummy } from "@/app/data/Dummy";
import axios from "axios";
import {BlobServiceClient} from "@azure/storage-blob";
import { Container } from "lucide-react";
import { chapterContentSlides } from "@/config/schema";
import { db } from "@/config/db";
import Groq from "groq-sdk";

export const maxDuration = 300; // 5 minutes for Pro plan, 60 for Hobby

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});
export async function  POST(Req:NextRequest){


    const {chapter,courseId}=await Req.json();

    console.log('Chapter:', chapter);
    console.log('CourseId:', courseId);

    // Generate JSON Schema for Video content


      const response = await client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: GENERATE_VIDEO_CONTENT_PROMPT },
          { role: "user", content: "Chapter Detail Is" + JSON.stringify(chapter) },
        ],
      });


      const AiResult =response.choices[0].message?.content;
      
      let cleanedJson = AiResult || '[]';
      // Remove markdown code blocks
      cleanedJson = cleanedJson.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
      // Remove any text before the first [ or {
      const jsonStart = Math.min(
        cleanedJson.indexOf('[') >= 0 ? cleanedJson.indexOf('[') : Infinity,
        cleanedJson.indexOf('{') >= 0 ? cleanedJson.indexOf('{') : Infinity
      );
      if (jsonStart !== Infinity && jsonStart > 0) {
        cleanedJson = cleanedJson.substring(jsonStart);
      }
      
      let VideoContentJson;
      try {
        VideoContentJson = JSON.parse(cleanedJson);
      } catch (error) {
        console.error('JSON Parse Error:', error);
        console.error('AI Response:', cleanedJson);
        return NextResponse.json({ error: 'AI returned invalid JSON', response: cleanedJson }, { status: 500 });
      }

    // Audio File Generation using TTS for Narration

// const VideoContentJson = VideoSlidesDummy;

let audioFileUrls: string[] = [];
for (let i = 0; i < VideoContentJson?.length; i++) {
  const narration = VideoContentJson[i].narration.fullText;

  const fonadaResult = await axios.post(
    "https://api.fonada.ai/tts/generate-audio-large",
    {
      input: narration,
      voice: "Vaanee",
      language: "English",
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.FONADALAB_API_KEYS}`,
      },
      responseType:'arraybuffer',
      timeout:120000
    })
    const audioBuffer=Buffer.from(fonadaResult.data);
    console.log(audioBuffer);
    const audioUrl = await SaveAudioToStorage(audioBuffer, VideoContentJson[i]?.audioFileName);
    console.log(audioUrl);
    audioFileUrls.push(audioUrl);
}



    // Storage Audio File in Cloud Storage {e.g., AWS S3,Google Cloud,Azure
    


    // Generate Captions for the Audio
    

    let captionsArray:any[]=[];
     for(let i=0;i<audioFileUrls.length;i++){
      const captions=await GenerateCaptions(audioFileUrls[i]);
      console.log(captions);
      captionsArray.push(captions);
     }

    // Save Everything to DataBase

    try {
      for(let index = 0; index < VideoContentJson.length; index++){
        const slide = VideoContentJson[index];
        
        let retries = 3;
        while(retries > 0) {
          try {
            //@ts-ignore
            const result = await db.insert(chapterContentSlides).values({
              chapterId: chapter.chapterId,
              courseId: courseId,
              slideIndex: slide.slideIndex,
              slideId: slide.slideId,
              audioFileName: slide.audioFileName,
              narration: slide.narration,
              revelDate: slide.revelData || [],
              html: slide.html,
              audioFileUrl: audioFileUrls[index] || 'pending',
              caption: captionsArray[index] || {}
            }).returning();
            console.log('Inserted:', result);
            break;
          } catch (dbError: any) {
            retries--;
            if (retries === 0) throw dbError;
            console.log(`Retry ${3 - retries}/3 for slide ${index}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      }
    } catch (error) {
      console.error('Database insert error:', error);
      return NextResponse.json({ error: 'Database save failed', details: error }, { status: 500 });
    }

    // Return Responses
   
return NextResponse.json({...VideoContentJson,audioFileUrls,captionsArray});

}


const SaveAudioToStorage = async(audioBuffer:Buffer,fileName:string)=>{
  //Implement the Cloud Storage logic
  const blobService = BlobServiceClient.fromConnectionString(
    process.env.AZURE_STORAGE_CONNECTION_STRING||"",
  );

  const Container=blobService.getContainerClient(process.env.AZURE_STORAGE_CONTAINER_NAME||"");

  const cleanFileName = fileName.replace(".mp3", "");
  const blobName = `tts/${cleanFileName}.mp3`;
  const blockBlob=Container.getBlockBlobClient(blobName);

  await blockBlob.uploadData(audioBuffer,{
    blobHTTPHeaders:{
      blobContentType:'audio/mpeg',
      blobCacheControl:'public,max-age=31536000,immutable'
    }
  })

  // Return Url 

  const publicBase=process.env.AZURE_STORAGE_PUBLIC_BASE_URL||"";
  const url =publicBase?
  publicBase+"/"+Container.containerName+"/"+blobName:
  blockBlob?.url;
  return url;
  

}


const GenerateCaptions = async (audioUrl: string) => {
  try {
    console.log("Fetching audio:", audioUrl);

    const response = await fetch(audioUrl);

    if (!response.ok) {
      throw new Error(`Audio fetch failed: ${response.status}`);
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());

    const transcription = await groq.audio.transcriptions.create({
      file: new File([audioBuffer], "audio.mp3"),
      model: "whisper-large-v3",
    });

    return transcription.text;
  } catch (error) {
    console.error("Caption generation error:", error);
    throw error;
  }
};