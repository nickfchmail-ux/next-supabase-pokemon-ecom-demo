'use client';

import { animate, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';

export default function UserCursor({
  name = 'Anonymous',
  color = '#3B82F6',
  textColor = '#FFFFFF',
  size = 28,
  labelTiltStrength = 25,
  showLabel = true,
  offsetX = 0,
  offsetY = 0,
  labelOffsetUseDefault = true,
  labelOffsetX = 25,
  labelOffsetY = 12,
  pressScale = 0.92,
  style,
  children,
}) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [pressed, setPressed] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mql = window.matchMedia('(pointer: coarse)');
    const sync = () => setIsTouchDevice(!!mql.matches);
    sync();
    mql.addEventListener('change', sync);
    return () => mql.removeEventListener('change', sync);
  }, []);

  const arrowSpring = useMemo(() => ({ stiffness: 380, damping: 32, mass: 0.6 }), []);
  const labelSpringCfg = useMemo(() => ({ stiffness: 220, damping: 26, mass: 0.7 }), []);

  const resolvedLabelOffset = useMemo(() => {
    if (labelOffsetUseDefault) return { x: size * 0.9, y: size * 0.2 + 6 };
    return { x: labelOffsetX, y: labelOffsetY };
  }, [labelOffsetUseDefault, labelOffsetX, labelOffsetY, size]);

  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);
  const arrowX = useSpring(mouseX, arrowSpring);
  const arrowY = useSpring(mouseY, arrowSpring);
  const labelXSpring = useSpring(mouseX, labelSpringCfg);
  const labelYSpring = useSpring(mouseY, labelSpringCfg);

  const scaleMV = useMotionValue(1);
  useEffect(() => {
    const controls = animate(scaleMV, pressed ? pressScale : 1, {
      type: 'spring',
      stiffness: 500,
      damping: 28,
      mass: 0.5,
    });
    return () => controls.stop();
  }, [pressed, pressScale, scaleMV]);

  const labelTiltTarget = useMotionValue(0);
  const labelRotation = useSpring(labelTiltTarget, { stiffness: 200, damping: 24, mass: 0.6 });

  const labelTranslateX = useTransform(labelXSpring, (v) => v + resolvedLabelOffset.x);
  const labelTranslateY = useTransform(labelYSpring, (v) => v + resolvedLabelOffset.y);

  const lastSampleRef = useRef(null);

  useEffect(() => {
    if (isTouchDevice) return;
    const container = containerRef.current;
    if (!container) return;

    const getLocal = (clientX, clientY) => {
      const rect = container.getBoundingClientRect();
      return { x: clientX - rect.left, y: clientY - rect.top };
    };

    const onMove = (e) => {
      const { x, y } = getLocal(e.clientX, e.clientY);
      const now = performance.now();
      const last = lastSampleRef.current;
      let vx = 0,
        vy = 0;
      if (last) {
        const dt = Math.max(1, now - last.t);
        vx = ((x - last.x) / dt) * 1000;
        vy = ((y - last.y) / dt) * 1000;
      }
      lastSampleRef.current = { x, y, t: now };
      mouseX.set(x + offsetX);
      mouseY.set(y + offsetY);
      const speed = Math.hypot(vx, vy);
      const norm = Math.min(1, speed / 1500);
      const sign = vx === 0 ? 0 : vx > 0 ? 1 : -1;
      labelTiltTarget.set(sign * norm * labelTiltStrength);
      setHovering(true);
    };

    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);
    const onLeave = () => {
      setHovering(false);
      lastSampleRef.current = null;
      labelTiltTarget.set(0);
    };

    container.addEventListener('mousemove', onMove);
    container.addEventListener('mousedown', onDown);
    container.addEventListener('mouseup', onUp);
    container.addEventListener('mouseleave', onLeave);

    return () => {
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mousedown', onDown);
      container.removeEventListener('mouseup', onUp);
      container.removeEventListener('mouseleave', onLeave);
      setPressed(false);
    };
  }, [isTouchDevice, labelTiltStrength, offsetX, offsetY, mouseX, mouseY, labelTiltTarget]);

  if (isTouchDevice) return <>{children}</>;

  const visible = hovering;

  return (
    <div
      ref={containerRef}
      className="user-cursor-host"
      style={{ position: 'relative', width: '100%', height: '100%', ...style }}
    >
      <style>{`.user-cursor-host, .user-cursor-host * { cursor: none !important; }`}</style>
      {children}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 9999 }}>
        {showLabel && (
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              x: labelTranslateX,
              y: labelTranslateY,
              rotate: labelRotation,
              scale: scaleMV,
              background: color,
              borderRadius: 999,
              padding: `${size * 0.18}px ${size * 0.36}px`,
              boxShadow: '0 4px 12px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.08)',
              opacity: visible ? 1 : 0,
              transformOrigin: '0% 50%',
              transition: 'opacity 140ms ease',
              willChange: 'transform, opacity',
              userSelect: 'none',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                color: textColor,
                fontSize: Math.max(7, size * 0.43),
                lineHeight: 1.1,
                fontWeight: 600,
                fontFamily: 'system-ui, sans-serif',
                whiteSpace: 'nowrap',
                letterSpacing: 0.1,
              }}
            >
              {name}
            </div>
          </motion.div>
        )}
        <motion.div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            x: arrowX,
            y: arrowY,
            scale: scaleMV,
            width: size,
            height: size,
            opacity: visible ? 1 : 0,
            transformOrigin: '0% 0%',
            transition: 'opacity 140ms ease',
            willChange: 'transform, opacity',
            pointerEvents: 'none',
          }}
        >
          <svg
            width={size}
            height={size}
            viewBox="0 0 28 28"
            fill="none"
            style={{ display: 'block', overflow: 'visible' }}
          >
            <path
              d="M5 3 L23 14 L14 16 L11 24 Z"
              fill={color}
              stroke="rgba(0,0,0,0.18)"
              strokeWidth={0.6}
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    </div>
  );
}
