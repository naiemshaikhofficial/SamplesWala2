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
            backgroundImage: 'radial-gradient(circle at 25px 25px, #ffffff08 2%, transparent 0%), radial-gradient(circle at 75px 75px, #ffffff08 2%, transparent 0%)',
            backgroundSize: '80px 80px',
            position: 'relative',
            padding: '60px',
            border: '20px solid #000',
          }}
        >
          {/* Main Container */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              width: '100%',
              height: '100%',
              backgroundColor: '#000',
              border: '8px solid #fff',
              boxShadow: '20px 20px 0px #00ff9f',
              padding: '40px',
              gap: '60px',
              zIndex: 10,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Background Texture */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.1, display: 'flex' }}>
               <div style={{ width: '100%', height: '100%', background: 'repeating-linear-gradient(45deg, #fff, #fff 1px, transparent 1px, transparent 10px)' }} />
            </div>

            {/* Pack Cover / Logo Area */}
            <div
              style={{
                display: 'flex',
                width: '380px',
                height: '380px',
                backgroundColor: '#00ff9f',
                border: '10px solid #000',
                boxShadow: '15px 15px 0px #fff',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {coverUrl ? (
                <img src={coverUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="cover" />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', padding: '20px' }}>
                   <div style={{ fontSize: '120px', fontWeight: '900', color: '#000' }}>SW</div>
                   <div style={{ fontSize: '20px', fontWeight: 'black', color: '#000', letterSpacing: '0.5em', marginTop: '-20px' }}>NOISE</div>
                </div>
              )}
            </div>

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
                  backgroundColor: '#fff',
                  color: '#000',
                  padding: '8px 20px',
                  fontSize: '24px',
                  fontWeight: '900',
                  letterSpacing: '0.3em',
                  width: 'fit-content',
                  marginBottom: '30px',
                  textTransform: 'uppercase',
                  transform: 'rotate(-2deg)',
                  boxShadow: '6px 6px 0px #00ff9f',
                }}
              >
                {category}
              </div>

              <h1
                style={{
                  fontSize: '100px',
                  color: '#fff',
                  fontWeight: '900',
                  textTransform: 'uppercase',
                  letterSpacing: '-0.06em',
                  lineHeight: 0.85,
                  marginBottom: '30px',
                  display: 'flex',
                  flexDirection: 'column',
                  fontStyle: 'italic',
                }}
              >
                {title.split(' ').map((word, i) => (
                  <span key={i} style={{ color: i % 2 === 0 ? '#fff' : '#00ff9f' }}>{word}</span>
                ))}
              </h1>

              <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                {price && (
                  <div
                    style={{
                      fontSize: '48px',
                      backgroundColor: '#FFC800',
                      color: '#000',
                      padding: '4px 20px',
                      fontWeight: '900',
                      boxShadow: '8px 8px 0px #fff',
                    }}
                  >
                    ₹{price}
                  </div>
                )}
                <div style={{ fontSize: '24px', color: '#00ff9f', fontWeight: 'bold', letterSpacing: '0.4em' }}>
                   SAMPLESWALA.COM
                </div>
              </div>
            </div>
          </div>

          {/* Floating Accents */}
          <div style={{ position: 'absolute', top: '40px', right: '40px', color: '#fff', fontSize: '100px', fontWeight: '900', opacity: 0.1, fontStyle: 'italic' }}>
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
