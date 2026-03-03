import React from 'react'
import { AbsoluteFill } from 'remotion'

function ChapterVideo() {
  return (
    <AbsoluteFill style={{
      backgroundColor: '#1a1a1a',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '48px',
      fontWeight: 'bold'
    }}>
      <h2>Video Preview</h2>
    </AbsoluteFill>
  )
}

export default ChapterVideo
