import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import gsap from 'gsap';
import './Glitch.css';

type GlitchTrigger = 'entry' | 'exit' | 'interval' | 'hover';

interface GlitchColors {
  color1?: string; // First color channel (default: red)
  color2?: string; // Second color channel (default: cyan)
}

interface GlitchProps {
  children: ReactNode;
  threshold?: number;
  duration?: number;
  glitchDuration?: number; // How long the glitch effect lasts in milliseconds
  intensity?: 'low' | 'medium' | 'high';
  glitchOn?: GlitchTrigger[];
  interval?: number; // interval in milliseconds for 'interval' trigger
  triggerOnce?: boolean;
  glitchColors?: GlitchColors; // Custom colors for the glitch effect
  className?: string;
}

const Glitch = ({
  children,
  threshold = 0.2,
  duration = 0.6,
  glitchDuration = 800,
  intensity = 'medium',
  glitchOn = ['entry'],
  interval = 3000,
  triggerOnce = false,
  glitchColors = { color1: '255, 0, 0', color2: '0, 255, 255' },
  className = '',
}: GlitchProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasTriggered = useRef(false);
  const isInViewport = useRef(false);
  const intervalId = useRef<number | null>(null);
  const hoverGlitchRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const glitchTimeline = gsap.timeline({ paused: true });

    // Intensity settings
    const intensitySettings = {
      low: { maxOffset: 5, iterations: 2, scale: 1.02 },
      medium: { maxOffset: 10, iterations: 3, scale: 1.05 },
      high: { maxOffset: 20, iterations: 5, scale: 1.08 },
    };

    const settings = intensitySettings[intensity];

    // Entry animation with glitch effect (fades in)
    const createGlitchAnimation = () => {
      glitchTimeline.clear();

      // Initial state
      gsap.set(container, {
        opacity: 0,
        scale: 0.95,
      });

      // Add glitch class for CSS effects
      container.classList.add('glitching');

      // Create glitch iterations
      for (let i = 0; i < settings.iterations; i++) {
        glitchTimeline
          .to(container, {
            x: gsap.utils.random(-settings.maxOffset, settings.maxOffset),
            y: gsap.utils.random(-settings.maxOffset, settings.maxOffset),
            scale: gsap.utils.random(0.98, settings.scale),
            duration: duration / (settings.iterations * 3),
            ease: 'power1.inOut',
          })
          .to(container, {
            x: 0,
            y: 0,
            scale: 1,
            opacity: 1,
            duration: duration / (settings.iterations * 2),
            ease: 'power2.out',
          });
      }

      glitchTimeline.play();

      // Remove glitch class after glitchDuration
      setTimeout(() => {
        container.classList.remove('glitching');
      }, glitchDuration);
    };

    // Interval glitch effect (stays visible, just glitches)
    const createIntervalGlitch = () => {
      const intervalTimeline = gsap.timeline();

      container.classList.add('glitching');

      // Create glitch iterations without opacity changes
      for (let i = 0; i < settings.iterations; i++) {
        intervalTimeline
          .to(container, {
            x: gsap.utils.random(-settings.maxOffset, settings.maxOffset),
            y: gsap.utils.random(-settings.maxOffset, settings.maxOffset),
            scale: gsap.utils.random(0.98, settings.scale),
            duration: duration / (settings.iterations * 3),
            ease: 'power1.inOut',
          })
          .to(container, {
            x: 0,
            y: 0,
            scale: 1,
            duration: duration / (settings.iterations * 2),
            ease: 'power2.out',
          });
      }

      // Remove glitch class after glitchDuration
      setTimeout(() => {
        container.classList.remove('glitching');
      }, glitchDuration);
    };

    // Hover glitch effect (stays visible, just glitches on hover)
    const createHoverGlitch = () => {
      const hoverTimeline = gsap.timeline();

      container.classList.add('glitching');

      // Create glitch iterations without opacity changes
      for (let i = 0; i < settings.iterations; i++) {
        hoverTimeline
          .to(container, {
            x: gsap.utils.random(-settings.maxOffset, settings.maxOffset),
            y: gsap.utils.random(-settings.maxOffset, settings.maxOffset),
            scale: gsap.utils.random(0.98, settings.scale),
            duration: duration / (settings.iterations * 3),
            ease: 'power1.inOut',
          })
          .to(container, {
            x: 0,
            y: 0,
            scale: 1,
            duration: duration / (settings.iterations * 2),
            ease: 'power2.out',
          });
      }

      // Remove glitch class after glitchDuration
      setTimeout(() => {
        container.classList.remove('glitching');
      }, glitchDuration);
    };

    // Store hover glitch function in ref for access outside useEffect
    hoverGlitchRef.current = createHoverGlitch;

    // Exit animation with glitch effect
    const createExitAnimation = () => {
      const exitTimeline = gsap.timeline();

      container.classList.add('glitching');

      for (let i = 0; i < settings.iterations; i++) {
        exitTimeline
          .to(container, {
            x: gsap.utils.random(-settings.maxOffset, settings.maxOffset),
            y: gsap.utils.random(-settings.maxOffset, settings.maxOffset),
            scale: gsap.utils.random(0.95, 1.02),
            duration: duration / (settings.iterations * 3),
            ease: 'power1.inOut',
          });
      }

      exitTimeline
        .to(container, {
          opacity: 0,
          scale: 0.95,
          x: 0,
          y: 0,
          duration: duration / 2,
          ease: 'power2.in',
        })
        .call(() => {
          container.classList.remove('glitching');
        });
    };

    // Start interval glitch if enabled
    const startIntervalGlitch = () => {
      if (glitchOn.includes('interval') && !intervalId.current) {
        intervalId.current = window.setInterval(() => {
          if (isInViewport.current) {
            createIntervalGlitch();
          }
        }, interval);
      }
    };

    // Stop interval glitch
    const stopIntervalGlitch = () => {
      if (intervalId.current) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };

    // Intersection Observer
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            isInViewport.current = true;

            // Trigger entry glitch if enabled
            if (glitchOn.includes('entry')) {
              if (!triggerOnce || !hasTriggered.current) {
                createGlitchAnimation();
                hasTriggered.current = true;
              } else if (!triggerOnce) {
                createGlitchAnimation();
              }
            } else {
              // If no entry glitch, ensure element is visible
              gsap.set(container, { opacity: 1 });
            }

            // Start interval glitch if enabled
            startIntervalGlitch();
          } else {
            isInViewport.current = false;

            // Trigger exit glitch if enabled
            if (glitchOn.includes('exit') && hasTriggered.current) {
              if (!triggerOnce) {
                createExitAnimation();
              }
            }

            // Stop interval glitch when out of view
            stopIntervalGlitch();
          }
        });
      },
      {
        threshold,
        rootMargin: '0px',
      }
    );

    observer.observe(container);

    // If interval or hover is enabled and element should be visible immediately
    if ((glitchOn.includes('interval') || glitchOn.includes('hover')) && !glitchOn.includes('entry')) {
      gsap.set(container, { opacity: 1 });
    }

    // Cleanup
    return () => {
      observer.disconnect();
      stopIntervalGlitch();
      glitchTimeline.kill();
      gsap.killTweensOf(container);
    };
  }, [threshold, duration, glitchDuration, intensity, triggerOnce, glitchOn, interval, glitchColors]);

  // Convert color format and apply to CSS variables
  const containerStyle = {
    '--glitch-color-1': glitchColors.color1 || '255, 0, 0',
    '--glitch-color-2': glitchColors.color2 || '0, 255, 255',
  } as React.CSSProperties;

  // Hover event handlers
  const handleMouseEnter = () => {
    if (glitchOn.includes('hover') && hoverGlitchRef.current) {
      hoverGlitchRef.current();
    }
  };

  const handleMouseLeave = () => {
    // Optional: could add different behavior on mouse leave if needed
  };

  return (
    <div
      ref={containerRef}
      className={`glitch-container ${className}`}
      data-intensity={intensity}
      style={containerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
};

export default Glitch;
