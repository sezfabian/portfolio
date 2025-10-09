import './Contact.css'

interface ContactProps {
  isDark: boolean
}

export default function Contact({ isDark }: ContactProps) {
  return (
    <section
      id="contact"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '2rem 2rem 4rem 2rem',
        scrollSnapAlign: 'start'
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          fontFamily: 'monospace',
          width: '100%',
          marginRight: window.innerWidth >= 768 ? '2rem' : '0'
        }}
      >
        <h2
          style={{
            fontSize: '2.5rem',
            fontWeight: 300,
            marginBottom: '2rem',
            color: isDark ? '#0f0' : '#00a',
            letterSpacing: '-0.02em'
          }}
        >
          CONTACT
        </h2>

        <div
          style={{
            fontSize: '1.1rem',
            lineHeight: '1.8',
            color: isDark ? '#ccc' : '#333',
            marginBottom: '2rem'
          }}
        >
          <p style={{ marginBottom: '1.5rem' }}>
            Let's connect! Whether you have a project in mind, want to collaborate, or just want to say hi, feel free to reach out.
          </p>
        </div>

        <div style={{ marginTop: '3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 300, color: isDark ? '#0f0' : '#00a', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Location
              </h4>
              <p style={{ fontSize: '1rem', color: isDark ? '#fff' : '#000', margin: 0 }}>
                Stirling, Scotland
              </p>
            </div>

            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 300, color: isDark ? '#0f0' : '#00a', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Phone
              </h4>
              <a
                href="tel:+447349688242"
                style={{
                  fontSize: '1rem',
                  color: isDark ? '#fff' : '#000',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = isDark ? '#0f0' : '#00a'}
                onMouseOut={(e) => e.currentTarget.style.color = isDark ? '#fff' : '#000'}
              >
                +44 734 9688 242
              </a>
            </div>

            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 300, color: isDark ? '#0f0' : '#00a', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Email
              </h4>
              <a
                href="mailto:cheruiyotfabian@gmail.com"
                style={{
                  fontSize: '1rem',
                  color: isDark ? '#fff' : '#000',
                  textDecoration: 'none',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => e.currentTarget.style.color = isDark ? '#0f0' : '#00a'}
                onMouseOut={(e) => e.currentTarget.style.color = isDark ? '#fff' : '#000'}
              >
                cheruiyotfabian@gmail.com
              </a>
            </div>

            <div>
              <h4 style={{ fontSize: '0.85rem', fontWeight: 300, color: isDark ? '#0f0' : '#00a', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                Links
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <a
                  href="https://linkedin.com/in/cheruiyot-fabian-4b9542142"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '1rem',
                    color: isDark ? '#fff' : '#000',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = isDark ? '#0f0' : '#00a'}
                  onMouseOut={(e) => e.currentTarget.style.color = isDark ? '#fff' : '#000'}
                >
                  linkedin.com/in/cheruiyot-fabian-4b9542142
                </a>
                <a
                  href="https://github.com/sezfabian"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '1rem',
                    color: isDark ? '#fff' : '#000',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.color = isDark ? '#0f0' : '#00a'}
                  onMouseOut={(e) => e.currentTarget.style.color = isDark ? '#fff' : '#000'}
                >
                  github.com/sezfabian
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
