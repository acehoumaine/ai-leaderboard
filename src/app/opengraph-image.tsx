import { ImageResponse } from 'next/og'

// Image metadata
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to right, #3b82f6, #8b5cf6)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: '80px', marginBottom: '20px' }}>🧠</div>
        <div
          style={{
            fontSize: '60px',
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: '20px',
          }}
        >
          AI Leaderboard
        </div>
        <div
          style={{
            fontSize: '30px',
            textAlign: 'center',
            maxWidth: '800px',
          }}
        >
          Independent AI Model Rankings and Comparisons
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
} 