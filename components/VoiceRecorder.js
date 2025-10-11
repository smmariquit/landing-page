'use client'

import React, { useRef, useState } from 'react'

export default function VoiceRecorder() {
  const recorderRef = useRef(null)
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState(null)

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      const chunks = []
      
      recorder.ondataavailable = (event) => {
        chunks.push(event.data)
      }
      
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioURL(url)
        // release media tracks
        stream.getTracks().forEach(t => t.stop())
      }
      
      recorder.start()
      recorderRef.current = { recorder, stream, chunks }
      setIsRecording(true)
      setAudioURL(null)
    } catch (e) {
      alert('Microphone access denied or unavailable')
    }
  }

  function stopRecording() {
    if (!recorderRef.current) return
    const { recorder } = recorderRef.current
    recorder.stop()
    recorderRef.current = null
    setIsRecording(false)
  }

  return (
    <div className="voice-recorder">
      <h3 className="big">Voice Assistant</h3>
      <p className="note">Press the big green button, speak clearly, then press stop.</p>
      <div className="controls">
        {!isRecording ? (
          <button className="btn btn-start" onClick={startRecording} aria-label="Start voice recording">Start Voice</button>
        ) : (
          <button className="btn btn-stop" onClick={stopRecording} aria-label="Stop voice recording">Stop</button>
        )}
      </div>

      {audioURL && (
        <div className="playback">
          <audio src={audioURL} controls />
          <p className="small">You can play back your recording. In a full version we would send this to the voice service.</p>
        </div>
      )}
    </div>
  )
}
