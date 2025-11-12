// Example usage of the Glitch component
import Glitch from './Glitch';

const GlitchExample = () => {
  return (
    <div style={{ padding: '50px', minHeight: '300vh' }}>
      <h1>Glitch Component Examples</h1>

      {/* Dark mode default */}
      <Glitch glitchOn={['entry']} isDark={true}>
        <div style={{ padding: '20px', background: '#1a1a1a', color: '#fff', marginBottom: '100px' }}>
          <h2>Dark Mode (Red & Cyan)</h2>
          <p>Auto-detects dark theme colors</p>
        </div>
      </Glitch>

      {/* Light mode default */}
      <Glitch glitchOn={['entry']} isDark={false}>
        <div style={{ padding: '20px', background: '#f0f0f0', color: '#000', marginBottom: '100px', border: '2px solid #ddd' }}>
          <h2>Light Mode (Black & Blue)</h2>
          <p>Auto-detects light theme colors</p>
        </div>
      </Glitch>

      {/* Glitch with custom colors: green and magenta */}
      <Glitch glitchOn={['exit']} glitchColors={{ color1: '0, 255, 0', color2: '255, 0, 255' }}>
        <div style={{ padding: '20px', background: '#2a2a2a', color: '#fff', marginBottom: '100px' }}>
          <h2>Custom Colors: Green & Magenta</h2>
          <p>Exit glitch with green and magenta channels</p>
        </div>
      </Glitch>

      {/* Glitch on both entry and exit */}
      <Glitch glitchOn={['entry', 'exit']} intensity="medium" glitchDuration={1500}>
        <div style={{ padding: '20px', background: '#1a1a2e', color: '#fff', marginBottom: '100px' }}>
          <h2>Entry & Exit Glitch (Long)</h2>
          <p>This div will glitch on both entry and exit with 1.5s duration</p>
        </div>
      </Glitch>

      {/* Interval glitch with light theme */}
      <Glitch glitchOn={['interval']} interval={3000} intensity="low" glitchDuration={600} isDark={false}>
        <div style={{ padding: '20px', background: '#ffffff', color: '#000', marginBottom: '100px', border: '2px solid #ddd' }}>
          <h2>Interval Glitch (Light Mode)</h2>
          <p>Black and blue glitch every 3 seconds (600ms each)</p>
        </div>
      </Glitch>

      {/* Combination: Entry + Interval with long duration */}
      <Glitch glitchOn={['entry', 'interval']} interval={4000} intensity="medium" glitchDuration={2000}>
        <div style={{ padding: '20px', background: '#0f3460', color: '#fff', marginBottom: '100px' }}>
          <h2>Entry + Interval Glitch (Long)</h2>
          <p>Glitches on entry, then every 4 seconds with 2s duration each</p>
        </div>
      </Glitch>

      {/* All triggers combined */}
      <Glitch glitchOn={['entry', 'exit', 'interval', 'hover']} interval={5000} intensity="high">
        <div style={{ padding: '20px', background: '#533483', color: '#fff', marginBottom: '100px' }}>
          <h2>All Triggers Combined</h2>
          <p>Entry, exit, interval (every 5 seconds), and hover!</p>
        </div>
      </Glitch>

      {/* High intensity interval with custom colors: orange and blue */}
      <Glitch
        glitchOn={['interval']}
        interval={2000}
        intensity="high"
        duration={0.4}
        glitchDuration={1200}
        glitchColors={{ color1: '255, 165, 0', color2: '0, 100, 255' }}
      >
        <div style={{ padding: '20px', background: '#e94560', color: '#fff', marginBottom: '100px' }}>
          <h2>Custom Colors: Orange & Blue</h2>
          <p>High intensity glitch every 2 seconds with orange/blue split</p>
        </div>
      </Glitch>

      {/* Hover glitch with light theme */}
      <Glitch glitchOn={['hover']} intensity="high" isDark={false}>
        <div style={{ padding: '20px', background: '#e8f4f8', color: '#000', marginBottom: '100px', border: '2px solid #ddd' }}>
          <h2>Hover to Glitch (Light Mode)</h2>
          <p>Black and blue glitch on hover</p>
        </div>
      </Glitch>

      {/* Hover with custom colors */}
      <Glitch
        glitchOn={['hover']}
        intensity="medium"
        glitchColors={{ color1: '0, 255, 127', color2: '255, 0, 127' }}
        glitchDuration={1000}
      >
        <div style={{ padding: '20px', background: '#2d4059', color: '#fff', marginBottom: '100px' }}>
          <h2>Hover Glitch (Custom Colors)</h2>
          <p>Spring green and hot pink glitch on hover</p>
        </div>
      </Glitch>

      {/* Trigger once with entry */}
      <Glitch glitchOn={['entry']} triggerOnce={true} intensity="high">
        <div style={{ padding: '20px', background: '#1f4068', color: '#fff', marginBottom: '100px' }}>
          <h2>Trigger Once</h2>
          <p>This glitch effect only triggers once on first entry</p>
        </div>
      </Glitch>

      {/* Wrapping any content with custom purple and yellow glitch */}
      <Glitch
        glitchOn={['entry', 'interval']}
        interval={6000}
        intensity="medium"
        duration={1}
        glitchColors={{ color1: '138, 43, 226', color2: '255, 255, 0' }}
      >
        <img
          src="https://via.placeholder.com/400x300"
          alt="Example"
          style={{ display: 'block', marginBottom: '100px' }}
        />
      </Glitch>
    </div>
  );
};

export default GlitchExample;
