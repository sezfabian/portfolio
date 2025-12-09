import './Education.css'

interface EducationProps {
  isDark: boolean
}

interface EducationItem {
  degree: string
  institution: string
  location: string
  graduationYear: string
  focus?: string
}

const educationData: EducationItem[] = [
  {
    degree: 'Master of Science in Advanced Computing with Artificial Intelligence',
    institution: 'University of Stirling',
    location: 'Stirling, Scotland',
    graduationYear: '2026',
    focus: 'AI Engineering, Machine Learning, Deep Learning, Natural Language Processing'
  },
  {
    degree: 'Bachelor of Science in Electrical and Electronics Engineering',
    institution: 'University of Nairobi',
    location: 'Nairobi, Kenya',
    graduationYear: '2022'
  }
]

export default function Education({ isDark }: EducationProps) {
  return (
    <section
      id="education"
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
            marginBottom: '3rem',
            paddingBottom: '1rem',
            borderBottom: `1px solid ${isDark ? '#333' : '#ccc'}`,
            color: isDark ? '#0f0' : '#00a',
            letterSpacing: '-0.02em'
          }}
        >
          EDUCATION
        </h2>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '3rem'
          }}
        >
          {educationData.map((edu, index) => (
            <div
              key={index}
              style={{
                padding: '0 0 1.5rem 0',
                transition: 'all 0.3s ease'
              }}
            >
              <h3
                style={{
                  fontSize: '1.3rem',
                  fontWeight: 400,
                  marginBottom: '0.5rem',
                  color: isDark ? '#0f0' : '#00a',
                  lineHeight: '1.4'
                }}
              >
                {edu.degree}
              </h3>

              <div
                style={{
                  fontSize: '1rem',
                  color: isDark ? '#ccc' : '#555',
                  marginBottom: '0.5rem'
                }}
              >
                <strong style={{ color: isDark ? '#fff' : '#000' }}>{edu.institution}</strong>
                {' • '}
                {edu.location}
              </div>

              <div
                style={{
                  fontSize: '0.9rem',
                  color: isDark ? '#999' : '#666',
                  marginBottom: edu.focus ? '1rem' : '0'
                }}
              >
                Graduation Year: {edu.graduationYear}
              </div>

              {edu.focus && (
                <div
                  style={{
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    color: isDark ? '#bbb' : '#444',
                    paddingTop: '1rem'
                  }}
                >
                  <strong style={{ color: isDark ? '#fff' : '#000' }}>Focus:</strong> {edu.focus}
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: '3rem' }}>
          <h3
            style={{
              fontSize: '1.5rem',
              fontWeight: 300,
              marginBottom: '1.5rem',
              paddingBottom: '0.75rem',
              borderBottom: `1px solid ${isDark ? '#333' : '#ccc'}`,
              color: isDark ? '#0f0' : '#00a',
              letterSpacing: '-0.01em'
            }}
          >
            CERTIFICATIONS
          </h3>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem'
            }}
          >
            <div
              style={{
                padding: '0.5rem 0',
                fontSize: '0.95rem',
                color: isDark ? '#ccc' : '#333'
              }}
            >
              <strong style={{ color: isDark ? '#fff' : '#000' }}>AWS Cloud Practitioner</strong>
            </div>

            <div
              style={{
                padding: '0.5rem 0',
                fontSize: '0.95rem',
                color: isDark ? '#ccc' : '#333'
              }}
            >
              <strong style={{ color: isDark ? '#fff' : '#000' }}>ALX - Holberton School</strong> • Full-Stack Software Engineer
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
