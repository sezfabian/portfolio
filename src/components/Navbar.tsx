interface NavbarProps {
  isDark: boolean
  onThemeToggle: () => void
}

export default function Navbar({ isDark, onThemeToggle }: NavbarProps) {
  const pages = ['Home', 'About', 'Projects', 'Contact']

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        padding: '1rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 100
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: '2.0rem',
          fontWeight: '600',
          color: isDark ? '#fff' : '#000',
          fontFamily: "'Source Code Pro', monospace"
        }}
      >
        @sezfabian
      </h2>

      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        {pages.map((page) => (
          <a
            key={page}
            href={`#${page.toLowerCase()}`}
            style={{
              color: isDark ? '#fff' : '#000',
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: '400',
              transition: 'opacity 0.2s',
              opacity: 0.8,
              cursor: 'pointer',
              fontFamily: "'Source Code Pro', monospace"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
          >
            {page}
          </a>
        ))}

        <button
          onClick={onThemeToggle}
          style={{
            background: 'transparent',
            border: 'none',
            color: isDark ? '#fff' : '#000',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '400',
            padding: 0,
            opacity: 0.8,
            transition: 'opacity 0.2s',
            fontFamily: "'Source Code Pro', monospace"
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.8')}
        >
          {isDark ? 'Light' : 'Dark'}
        </button>
      </div>
    </nav>
  )
}
