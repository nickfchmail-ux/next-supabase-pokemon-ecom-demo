'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ScrambleText from './ScrambleText';

const ICONS = {
  'Ethically Sourced': '🌱',
  'Fast & Safe Delivery': '🚚',
  'Expert Support': '🎓',
  '24/7 Adventure Support': '🛡️',
};

const FEATURE_COLORS = {
  "Ethically Sourced": "#059669",
  "Fast & Safe Delivery": "#2563EB",
  "Expert Support": "#7C3AED",
  "24/7 Adventure Support": "#DC2626",
};

export default function SellingPointsRotator({ features = [] }) {
  const [current, setCurrent] = useState(0);
  const [key, setKey] = useState(0);
  const intervalRef = useRef(null);

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % features.length);
      setKey((k) => k + 1);
    }, 6000);
  };

  useEffect(() => {
    if (features.length === 0) return;
    startTimer();
    return () => clearInterval(intervalRef.current);
  }, [features.length]);

  if (features.length === 0) return null;

  const feature = features[current];

  return (
    <div className="flex justify-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
          className="max-w-xl text-center sm:text-left min-h-[120px]"
        >
          <dt className="mb-3 h-[60px] flex items-end">
            <ScrambleText
              key={feature.title + key}
              words={feature.title}
              color={FEATURE_COLORS[feature.title]}
              fontSize={48}
              fontWeight={800}
              letterSpacing="-0.02em"
              textAlign="left"
              enterDuration={0.6}
              enterScrambleIntensity={25}
            />
          </dt>
          <dd className="h-[60px] flex items-start">
            <ScrambleText
              key={feature.desc + key}
              words={feature.desc}
              color="#6B7280"
              fontSize={28}
              fontWeight={400}
              letterSpacing="-0.01em"
              textAlign="left"
              enterDuration={0.8}
              enterScrambleIntensity={15}
            />
          </dd>

          {/* Dots */}
          <div className="flex gap-2 mt-5 justify-center sm:justify-start">
            {features.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setCurrent(i);
                  setKey((k) => k + 1);
                  startTimer();
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === current ? 'bg-indigo-600 w-6' : 'bg-gray-300 hover:bg-gray-400'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
