import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    // Dynamic parameters
    const title = searchParams.get('title') || 'Samples Wala'
    const category = searchParams.get('category') || 'Premium Samples'
    const price = searchParams.get('price') || ''
    const coverUrl = searchParams.get('image') || ''

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#000',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #ffffff05 2%, transparent 0%), radial-gradient(circle at 75px 75px, #ffffff05 2%, transparent 0%)',
            backgroundSize: '100px 100px',
            position: 'relative',
            padding: '40px',
          }}
        >
          {/* Neon Border */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              left: '20px',
              right: '20px',
              bottom: '20px',
              border: '2px solid rgba(0, 255, 159, 0.2)',
              display: 'flex',
            }}
          />

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              gap: '40px',
              zIndex: 10,
            }}
          >
            {/* Pack Cover */}
            {coverUrl && (
              <div
                style={{
                  display: 'flex',
                  width: '400px',
                  height: '400px',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  border: '4px solid #000',
                  boxShadow: '12px 12px 0px rgba(0, 0, 0, 1), 12px 12px 0px 2px rgba(255, 200, 0, 0.3)',
                }}
              >
                <img
                  src={coverUrl}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  alt="cover"
                />
              </div>
            )}

            {/* Content Area */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  backgroundColor: '#00ff9f',
                  color: '#000',
                  padding: '4px 12px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  letterSpacing: '0.2em',
                  width: 'fit-content',
                  marginBottom: '20px',
                  textTransform: 'uppercase',
                }}
              >
                {category}
              </div>

              <h1
                style={{
                  fontSize: '72px',
                  color: '#fff',
                  fontWeight: 'black',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.05em',
                  lineHeight: 0.9,
                  marginBottom: '20px',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {title}
              </h1>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '20px',
                }}
              >
                {price && (
                  <div
                    style={{
                      fontSize: '32px',
                      color: '#FFC800',
                      fontWeight: 'bold',
                      fontStyle: 'italic',
                    }}
                  >
                    ₹{price}
                  </div>
                )}
                
                <div
                  style={{
                    display: 'flex',
                    height: '2px',
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    flex: 1,
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  marginTop: '40px',
                  fontSize: '18px',
                  color: 'rgba(255,255,255,0.4)',
                  fontWeight: 'bold',
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                }}
              >
                SAMPLESWALA.COM // RAW SOUNDS
              </div>
            </div>
          </div>

          {/* Accent Graffiti Marks */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              fontSize: '120px',
              color: 'rgba(255, 255, 255, 0.03)',
              fontWeight: '900',
              fontStyle: 'italic',
              zIndex: 0,
            }}
          >
            RAW
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    console.log(`${e.message}`)
    return new Response(`Failed to generate the image`, {
      status: 500,
    })
  }
}
