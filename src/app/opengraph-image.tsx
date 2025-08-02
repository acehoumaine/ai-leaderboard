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
          padding: '40px',
          position: 'relative',
        }}
      >
        {/* Logo and site name */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: 'white',
              marginRight: '20px',
            }}
          >
            <div
              style={{
                fontSize: '50px',
              }}
            >
              🧠
            </div>
          </div>
          <h1
            style={{
              fontSize: '48px',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
            }}
          >
            AI Leaderboard
          </h1>
        </div>
        
        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: '20px',
            padding: '40px',
            width: '80%',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <h2
            style={{
              fontSize: '60px',
              fontWeight: 'bold',
              color: 'white',
              margin: 0,
              textAlign: 'center',
              marginBottom: '20px',
            }}
          >
            Independent AI Model Rankings
          </h2>
          <p
            style={{
              fontSize: '28px',
              color: 'white',
              margin: 0,
              textAlign: 'center',
              opacity: 0.9,
            }}
          >
            Compare GPT, Claude, Gemini, and more models based on comprehensive benchmarks and real-world testing
          </p>
        </div>
        
        {/* Footer */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <p
            style={{
              fontSize: '24px',
              color: 'white',
              opacity: 0.8,
            }}
          >
            www.ai-fun-ranking.com
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
} 