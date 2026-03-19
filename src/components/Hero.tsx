import './Hero.css'
import Glitch from './Glitch'
import GlitchText from './GlitchText';
import MysteryGlyph from './MysteryGlyph'
import cvPdf from '../assets/Fabian_CV.pdf'

interface HeroProps {
  isDark: boolean
  onMysteryLaunch: () => void
}

export default function Hero({ isDark, onMysteryLaunch }: HeroProps) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '4rem 2rem 2rem 2rem',
        scrollSnapAlign: 'start'
      }}
      className="hero-wrapper"
    >
      
      <div
        style={{
          maxWidth: '800px',
          width: '100%',
          marginRight: window.innerWidth >= 768 ? '2rem' : '0',
          position: 'relative',
          marginTop: window.innerWidth <= 768 ? '-15rem' : '-2rem'
        }}
      >
      
        <GlitchText speed={2} enableShadows={true} enableOnHover={false} className="hero-title">
          Hi, I'm Fabian Cheruiyot
        </GlitchText>
        <p
          style={{
            fontSize: '1.25rem',
            fontWeight: '400',
            margin: '0 0 1.5rem 0',
            color: isDark ? '#fff' : '#000',
            opacity: 0.9,
            lineHeight: '1.6',
            fontFamily: "'Source Code Pro', monospace"
          }}
        >
          A full-stack software + AI engineer, Learning and building at the crossroads of AI and full-stack development — creating tools that help businesses grow smarter.
        </p>
        <p
          style={{
            fontSize: '1rem',
            fontWeight: '300',
            margin: 0,
            color: isDark ? '#fff' : '#000',
            opacity: 0.7,
            lineHeight: '1.6',
            fontFamily: "'Source Code Pro', monospace"
          }}
        >
          Want to know me better? Explore the terminal or...
        </p>

        {window.innerWidth <= 1010 && (
          <MysteryGlyph
            isDark={isDark}
            onActivate={onMysteryLaunch}
            style={{ marginTop: '1.5rem' }}
          />
        )}


      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '3rem', position: 'relative' }}>
        <Glitch glitchOn={['interval','entry', 'hover']} interval={Math.random() * 10000} glitchDuration={Math.random() * 2000} isDark={isDark}
        glitchColors={{color1: isDark ? '0, 255, 0' : '0, 0, 0', color2: isDark ? '255, 255, 255' : '0, 0, 170'}} intensity="high"
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '3rem', position: 'relative', cursor: 'pointer' }}>
            <a
              href={cvPdf}
              download="Fabian_Cheruiyot_CV.pdf"
              style={{
                padding: '0.5rem 1rem',
                border: `1px solid ${isDark ? '#0f0' : '#00a'}`,
                color: isDark ? '#0f0' : '#00a',
                fontFamily: "'Source Code Pro', monospace",
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                textDecoration: 'none',
                backgroundColor: 'transparent',
                cursor: 'pointer',
                position: 'relative',
              }}
            >
              Download my CV
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/>
              </svg>
            </a>
          </div>
        </Glitch>
      </div>
      </div>
    </div>
  )
}
