import './Projects.css'
import { useState } from 'react'
import trackImg from '../assets/farm.png'
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
    link: 'https://ackstmarys.munjitiparish.co.ke/'
  },
  {
    title: 'MASTER-SLAVE SALP SWARM OPTIMIZER',
    description: 'Optimizer algorithm for Hybrid Energy Storage System Control Strategy in Electric Vehicles. Published research focusing on optimization algorithms for energy management systems.',
    tech: ['Python', 'MATLAB', 'Machine Learning','Algorithm Design', 'Hybrid Energy Systems'],
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
  const [expandedCard, setExpandedCard] = useState<number | null>(null)
  const [hoveredCard, setHoveredCard] = useState<number | null>(null)

  return (
    <section
      id="projects"
      style={{
        minHeight: '100vh',
        padding: '2rem 2rem 4rem 2rem',
        display: 'flex',
        justifyContent: 'flex-end',
        scrollSnapAlign: 'start',
        position: 'relative',
        zIndex: 101
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          fontFamily: 'monospace',
          width: '100%',
          marginRight: window.innerWidth >= 768 ? '2rem' : '0',
          position: 'relative',
          zIndex: 101
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
                padding: '0.5rem 0',
                marginBottom: index < projects.length - 1 ? '2rem' : '0'
              }}
            >
              <div
                style={{
                  padding: '2rem',
                  backgroundColor: expandedCard === index ? 'rgba(255, 255, 255, 0.98)' : 'transparent',
                  borderRadius: '16px',
                  transition: 'all 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)',
                  transform: expandedCard === index ? 'scale(1.08)' : hoveredCard === index ? 'scale(1.02)' : 'scale(1)',
                  boxShadow: expandedCard === index
                    ? (isDark ? '0 30px 80px rgba(0, 255, 0, 0.2), 0 0 0 1px rgba(0, 255, 0, 0.15)' : '0 30px 80px rgba(0, 0, 170, 0.2), 0 0 0 1px rgba(0, 0, 170, 0.15)')
                    : hoveredCard === index
                    ? (isDark ? '0 10px 30px rgba(0, 255, 0, 0.1)' : '0 10px 30px rgba(0, 0, 170, 0.1)')
                    : '0 0 0 rgba(0, 0, 0, 0)',
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: expandedCard === index ? 10 : 1
                }}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => setExpandedCard(expandedCard === index ? null : index)}
              >
              {/* Click to expand indicator */}
              {hoveredCard === index && expandedCard !== index && (
                <div
                  style={{
                    position: 'absolute',
                    top: '1rem',
                    right: '1rem',
                    fontSize: '0.75rem',
                    color: isDark ? '#0f0' : '#00a',
                    fontFamily: 'monospace',
                    animation: 'pulse 2s infinite',
                    opacity: 0.8
                  }}
                >
                  Click to expand ↗
                </div>
              )}

              {/* First Row: Image and Description */}
              <div
                className="project-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: expandedCard === index ? '1fr' : (window.innerWidth > 1010 ? '1fr 1fr' : '1fr'),
                  gap: expandedCard === index ? '1.5rem' : '2rem',
                  marginBottom: '1rem',
                  transition: 'all 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)'
                }}
              >
                {/* Image */}
                <div
                  className={`project-image-${index}`}
                  style={{
                    aspectRatio: '4/2.8',
                    backgroundColor: expandedCard === index ? '#f8f8f8' : (isDark ? '#1a1a1a' : '#f0f0f0'),
                    border: expandedCard === index ? '1px solid rgba(0, 0, 170, 0.2)' : `1px solid ${isDark ? '#333' : '#ccc'}`,
                    overflow: 'hidden',
                    position: 'relative',
                    borderRadius: '12px',
                    transition: 'all 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)'
                  }}
                >
                  <img
                    src={project.image}
                    alt={project.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      filter: expandedCard === index ? 'grayscale(0%)' : 'grayscale(70%)',
                      transition: 'filter 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)',
                      borderRadius: '12px',
                      transformOrigin: 'center',
                      position: 'relative',
                      transform: 'scale(1)'
                    }}
                  />
                </div>

                {/* Title and Description */}
                <div>
                  <h3
                    className={`project-title-${index}`}
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 300,
                      marginBottom: '0.5rem',
                      marginTop: '0rem',
                      color: expandedCard === index ? '#00a' : (isDark ? '#0f0' : '#00a'),
                      letterSpacing: '-0.01em',
                      transition: 'color 0.5s ease'
                    }}
                  >
                    {project.title}
                  </h3>

                  <p
                    className={`project-desc-${index}`}
                    style={{
                      fontSize: '0.95rem',
                      lineHeight: '1.6',
                      color: expandedCard === index ? '#333' : (isDark ? '#ccc' : '#333'),
                      margin: 0,
                      transition: 'color 0.5s ease'
                    }}
                  >
                    {project.description}
                  </p>
                </div>
              </div>

              {/* Second Row: Tech Stack and View Button */}
              <div
                className={`project-bottom-${index}`}
                style={{
                  display: 'grid',
                  gridTemplateColumns: expandedCard === index ? '1fr' : '1fr 1fr',
                  marginTop: '0.5rem',
                  gap: expandedCard === index ? '1.5rem' : '2rem',
                  transition: 'all 0.8s cubic-bezier(0.25, 0.1, 0.25, 1)'
                }}
              >
                {/* Tech Stack */}
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    alignItems: 'center',
                    marginTop: '-0rem',
                    order: window.innerWidth > 1010 ? 2 : 1
                  }}
                >
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className={`project-tech-${index}`}
                      style={{
                        padding: '0.25rem 0.75rem',
                        border: `1px solid ${expandedCard === index ? '#00a' : (isDark ? '#0f0' : '#00a')}`,
                        color: expandedCard === index ? '#00a' : (isDark ? '#0f0' : '#00a'),
                        fontSize: '0.75rem',
                        fontFamily: 'monospace',
                        transition: 'all 0.5s ease'
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* View Button */}
                <div
                  style={{
                    order: window.innerWidth > 1010 ? 1 : 2
                  }}
                >
                  {project.link && (
                    <a
                      href={project.link}
                      className={`project-link-${index}`}
                      style={{
                        display: 'inline-block',
                        color: expandedCard === index ? '#00a' : (isDark ? '#0f0' : '#00a'),
                        textDecoration: 'none',
                        fontSize: '0.85rem',
                        fontFamily: 'monospace',
                        transition: 'all 0.5s ease',
                        backgroundColor: 'transparent',
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      VIEW PROJECT →
                    </a>
                  )}
                </div>
              </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
