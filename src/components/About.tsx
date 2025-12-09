import './About.css'

interface AboutProps {
  isDark: boolean
}

export default function About({ isDark }: AboutProps) {
  return (
    <section
      id="about"
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
            paddingBottom: '1rem',
            borderBottom: `1px solid ${isDark ? '#333' : '#ccc'}`,
            color: isDark ? '#0f0' : '#00a',
            letterSpacing: '-0.02em'
          }}
        >
          ABOUT ME
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
            AI Engineering Specialist (Master's track) with 4+ years as a Software Engineer, specializing in the systemic design and architecture of scalable full-stack solutions. Currently pursuing MSc in Advanced Computing with Artificial Intelligence at the University of Stirling (2026).
          </p>

          <p style={{ marginBottom: '1.5rem' }}>
            Proven ability to build, optimize, and grow business operations through technology, with experience collaborating with leading AI labs to optimize Large Language Models (LLMs) for software engineering tasks. Instrumental in boosting LLM accuracy in competitive programming from 30% to over 90% within one year.
          </p>

          <p style={{ marginBottom: '1.5rem' }}>
            Based in Stirling, Scotland with right to work in the UK. Expert in evaluating, training, and standardizing Generative AI tools, with a passion for translating technical concepts to deliver measurable business value.
          </p>
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
            SKILLS
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem'
            }}
          >

            {/* Programming Languages */}
            <div>
              <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem', color: isDark ? '#fff' : '#000' }}>
                Programming Languages
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['Python', 'JavaScript', 'TypeScript', 'SQL', 'R'].map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.25rem 0.75rem',
                      border: `1px solid ${isDark ? '#0f0' : '#00a'}`,
                      color: isDark ? '#0f0' : '#00a',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      borderRadius: '5px'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem', color: isDark ? '#fff' : '#000' }}>
                Tools
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['Git', 'Docker', 'AWS', 'Azure', 'Trello', 'Jira'].map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.25rem 0.75rem',
                      border: `1px solid ${isDark ? '#0f0' : '#00a'}`,
                      color: isDark ? '#0f0' : '#00a',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      borderRadius: '5px'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Backend & Databases */}
            <div>
              <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem', color: isDark ? '#fff' : '#000' }}>
                Backend & Databases
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['Django','FastAPI', 'Node.js', 'PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'REST API'].map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.25rem 0.75rem',
                      border: `1px solid ${isDark ? '#0f0' : '#00a'}`,
                      color: isDark ? '#0f0' : '#00a',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      borderRadius: '5px'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem', color: isDark ? '#fff' : '#000' }}>
                Frontend
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['React', 'Vue.js', 'Tailwind CSS', 'Three.js', 'EmailJS', 'Material UI'].map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.25rem 0.75rem',
                      border: `1px solid ${isDark ? '#0f0' : '#00a'}`,
                      color: isDark ? '#0f0' : '#00a',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      borderRadius: '5px'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem', color: isDark ? '#fff' : '#000' }}>
                Testing & Documentation
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['Pytest', 'Playwright', 'Jest', 'Postman', 'Swagger', "MK-Docs"].map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.25rem 0.75rem',
                      border: `1px solid ${isDark ? '#0f0' : '#00a'}`,
                      color: isDark ? '#0f0' : '#00a',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      borderRadius: '5px'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem', color: isDark ? '#fff' : '#000' }}>
                Design
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['Figma', 'Canva', 'Photoshop', 'Illustrator', 'Responsive Design'].map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.25rem 0.75rem',
                      border: `1px solid ${isDark ? '#0f0' : '#00a'}`,
                      color: isDark ? '#0f0' : '#00a',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      borderRadius: '5px'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* AI & Machine Learning */}
            <div>
              <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem', color: isDark ? '#fff' : '#000' }}>
                AI & Machine Learning
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['PyTorch', 'CNNs', 'RNNs', 'NLP', 'RAG Applications', 'Supervised Learning', 'Reinforcement Learning'].map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.25rem 0.75rem',
                      border: `1px solid ${isDark ? '#0f0' : '#00a'}`,
                      color: isDark ? '#0f0' : '#00a',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      borderRadius: '5px'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* AI Developer Tools */}
            <div>
              <h4 style={{ marginBottom: '0.75rem', fontSize: '1rem', color: isDark ? '#fff' : '#000' }}>
                AI Developer Tools
              </h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {['Cursor', 'Claude Code', 'OpenCode', 'Gemini CLI', 'Docker', 'CI/CD'].map((skill, idx) => (
                  <span
                    key={idx}
                    style={{
                      padding: '0.25rem 0.75rem',
                      border: `1px solid ${isDark ? '#0f0' : '#00a'}`,
                      color: isDark ? '#0f0' : '#00a',
                      fontSize: '0.75rem',
                      fontFamily: 'monospace',
                      borderRadius: '5px'
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
