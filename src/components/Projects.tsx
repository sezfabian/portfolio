import './Projects.css'
import trackImg from '../assets/track.png'
import mikrotikImg from '../assets/mikrotik.png'
import guntuImg from '../assets/guntu.png'
import ackImg from '../assets/ack.png'
import mssaImg from '../assets/mssa.png'
import cargenImg from '../assets/cargen.png'

interface ProjectsProps {
  isDark: boolean
}

interface Project {
  title: string
  description: string
  tech: string[]
  image: string
  link?: string
}

const projects: Project[] = [
  {
    title: 'TRACK YOUR FARM',
    description: 'A comprehensive farm management platform that helps farmers run their operations like CEOs.',
    tech: ['Vue.js', 'Django', 'PostgreSQL', 'Gemini-API','Mobile Responsive'],
    image: trackImg,
    link: 'https://app.trackyourfarm.com'
  },
  {
    title: 'MIKROTIK CLOUDPILOT API',
    description: 'A Django-based API for managing Mikrotik routers with user authentication, secure API key management, and integrated payment processing for WiFi packages.',
    tech: ['Django', 'Material MK-Docs', 'REST API', 'Postman', 'PostgreSQL', 'RouterOS'],
    image: mikrotikImg,
    link: 'https://mikrotik-cloudpilotapi.onrender.com/'
  },
  {
    title: 'GUNTU IT SOLUTIONS',
    description: 'A modern website for Guntu IT Solutions consultancy showcasing their services and expertise in digital solutions.',
    tech: ['React', 'Three.js', 'EmailJS', 'TypeScript', 'Responsive Design'],
    image: guntuImg,
    link: 'https://guntuit.co.ke'
  },
  {
    title: 'ACK ST MARYS MUNJITI PARISH',
    description: 'A comprehensive charity website for ACK St Marys Munjiti Parish.',
    tech: ['WordPress', 'HTML', 'CSS', 'JavaScript', 'Multi-language Support'],
    image: ackImg,
    link: 'https://ackstmarysmunjiti.org'
  },
  {
    title: 'MASTER-SLAVE SALP SWARM OPTIMIZER',
    description: 'A Master-Slave Salp Swarm Algorithm Optimizer for Hybrid Energy Storage System Control Strategy in Electric Vehicles. Published research focusing on optimization algorithms for energy management systems.',
    tech: ['Python', 'MATLAB', 'Algorithm Design', 'Energy Systems'],
    image: mssaImg,
    link: 'https://www.hindawi.com/journals/jen/2022/1648433/'
  },
  {
    title: 'CARGEN MOBILE APP',
    description: 'Built microservices integrating SAP with the e-commerce mobile app and Pesapal + Mpesa payment gateways. Developed robust API infrastructure for seamless enterprise resource planning integration.',
    tech: ['FastAPI', 'Python', 'Vue3', 'REST API', 'Flutter', 'Firebase'],
    image: cargenImg,
    link: 'https://play.google.com/store/apps/details?id=com.cargen.app.cargen_app&hl=en'
  }
]

export default function Projects({ isDark }: ProjectsProps) {
  return (
    <section
      id="projects"
      style={{
        minHeight: '100vh',
        padding: '2rem 2rem 4rem 2rem',
        display: 'flex',
        justifyContent: 'flex-end',
        scrollSnapAlign: 'start'
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          fontFamily: 'monospace',
          width: window.innerWidth >= 768 ? 'calc(50% - 2rem)' : '100%',
          marginRight: window.innerWidth >= 768 ? '2rem' : '0'
        }}
      >
        <h2
          style={{
            fontSize: '2.5rem',
            fontWeight: 300,
            marginBottom: '3rem',
            color: isDark ? '#0f0' : '#00a',
            letterSpacing: '-0.02em'
          }}
        >
          PROJECTS
        </h2>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '4rem'
          }}
        >
          {projects.map((project, index) => (
            <div
              key={index}
              style={{
                padding: '2rem 0',
                borderBottom: index < projects.length - 1 ? `1px solid ${isDark ? '#333' : '#ccc'}` : 'none'
              }}
            >
              {/* First Row: Image and Description */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '2rem',
                  marginBottom: '1rem'
                }}
              >
                {/* Image */}
                <div
                  style={{
                    aspectRatio: '4/2.5',
                    backgroundColor: isDark ? '#1a1a1a' : '#f0f0f0',
                    border: `1px solid ${isDark ? '#333' : '#ccc'}`,
                    overflow: 'hidden',
                    position: 'relative',
                    borderRadius: '5px',
                    filter: 'grayscale(70%)'

                  }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                </div>

                {/* Title and Description */}
                <div>
                  <h3
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 300,
                      marginBottom: '0.75rem',
                      marginTop: '0rem',
                      color: isDark ? '#0f0' : '#00a',
                      letterSpacing: '-0.01em'
                    }}
                  >
                    {project.title}
                  </h3>

                  <p
                    style={{
                      fontSize: '0.95rem',
                      lineHeight: '1.6',
                      color: isDark ? '#ccc' : '#333',
                      margin: 0
                    }}
                  >
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Second Row: Tech Stack and View Button */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '2rem'
                }}
              >
                {/* View Button */}
                <div>
                  {project.link && (
                    <a
                      href={project.link}
                      style={{
                        display: 'inline-block',
                        color: isDark ? '#0f0' : '#00a',
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        fontFamily: 'monospace',
                        transition: 'all 0.2s',
                        backgroundColor: 'transparent',
                      }}
                    >
                      VIEW PROJECT →
                    </a>
                  )}
                  
                </div>

                {/* Tech Stack */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    alignItems: 'center',
                    marginTop: '-1rem'
                  }}
                >
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      style={{
                        padding: '0.25rem 0.75rem',
                        border: `1px solid ${isDark ? '#0f0' : '#00a'}`,
                        color: isDark ? '#0f0' : '#00a',
                        fontSize: '0.75rem',
                        fontFamily: 'monospace'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
