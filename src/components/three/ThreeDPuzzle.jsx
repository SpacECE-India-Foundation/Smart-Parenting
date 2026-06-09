import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, RoundedBox, Sphere, Torus, Cone } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

/* ─── Individual 3D Shape ─── */
function Shape3D({ type, color, position, isTarget, isSelected, onSelect }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.y += 0.01;
    if (isTarget) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.3;
    }
  });

  const material = (
    <meshStandardMaterial
      color={isSelected ? '#4CAF50' : color}
      roughness={0.3}
      metalness={0.2}
      emissive={isTarget ? color : 'black'}
      emissiveIntensity={isTarget ? 0.2 : 0}
    />
  );

  const shapes = {
    cube:     <RoundedBox ref={meshRef} args={[1.4, 1.4, 1.4]} radius={0.1} onClick={onSelect}>{material}</RoundedBox>,
    sphere:   <Sphere    ref={meshRef} args={[0.8, 32, 32]}       onClick={onSelect}>{material}</Sphere>,
    cone:     <Cone      ref={meshRef} args={[0.7, 1.5, 32]}      onClick={onSelect}>{material}</Cone>,
    torus:    <Torus     ref={meshRef} args={[0.6, 0.25, 16, 64]} onClick={onSelect}>{material}</Torus>,
    cylinder: (
      <mesh ref={meshRef} onClick={onSelect}>
        <cylinderGeometry args={[0.6, 0.6, 1.4, 32]} />
        {material}
      </mesh>
    ),
    pyramid: (
      <mesh ref={meshRef} onClick={onSelect}>
        <coneGeometry args={[0.8, 1.5, 4]} />
        {material}
      </mesh>
    ),
  };

  return (
    <group position={position}>
      {shapes[type] || shapes.cube}
    </group>
  );
}

/* ─── Scene with target + options ─── */
function PuzzleScene({ target, options, onSelect, selected }) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} />
      <directionalLight position={[0, 5, 5]} intensity={0.8} castShadow />

      {/* Target shape (big, center-top) */}
      <Shape3D
        type={target.type}
        color={target.color}
        position={[0, 1.5, 0]}
        isTarget={true}
        isSelected={false}
        onSelect={() => {}}
      />

      {/* Option shapes in a row */}
      {options.map((opt, i) => {
        const xOffset = (i - (options.length - 1) / 2) * 2.5;
        return (
          <Shape3D
            key={opt.id}
            type={opt.type}
            color={opt.color}
            position={[xOffset, -1.5, 0]}
            isTarget={false}
            isSelected={selected === opt.id}
            onSelect={() => onSelect(opt)}
          />
        );
      })}

      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
    </>
  );
}

/* ─── 3D PUZZLE GAME ─── */
const SHAPES_DATA = [
  { type: 'cube',     color: '#7C4DFF', name: 'Cube'     },
  { type: 'sphere',   color: '#E91E8C', name: 'Sphere'   },
  { type: 'cone',     color: '#F5A623', name: 'Cone'     },
  { type: 'torus',    color: '#2EC4B6', name: 'Torus'    },
  { type: 'cylinder', color: '#FF6B9D', name: 'Cylinder' },
  { type: 'pyramid',  color: '#66BB6A', name: 'Pyramid'  },
];

function generateRound(roundIdx) {
  const target = SHAPES_DATA[roundIdx % SHAPES_DATA.length];
  const others = SHAPES_DATA.filter((s) => s.type !== target.type)
    .sort(() => Math.random() - 0.5)
    .slice(0, 2);
  const options = [...others, target]
    .sort(() => Math.random() - 0.5)
    .map((s, i) => ({ ...s, id: `${s.type}-${i}` }));
  return { target, options };
}

export default function ThreeDPuzzle({ onScoreUpdate, onBack }) {
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [level, setLevel] = useState(1);
  const [perfectStreak, setPerfectStreak] = useState(0);

  const { target, options } = generateRound(round);

  const handleSelect = (opt) => {
    if (feedback) return;
    setSelected(opt.id);

    if (opt.type === target.type) {
      const points = 25 * level;
      const newScore = score + points;
      setScore(newScore);
      setFeedback('correct');
      const newStreak = perfectStreak + 1;
      setPerfectStreak(newStreak);
      // Difficulty ladder: auto-advance level on 3 perfect scores
      if (newStreak >= 3 && level < 5) {
        setLevel((l) => l + 1);
        setPerfectStreak(0);
      }
      onScoreUpdate?.(newScore, level);
    } else {
      setFeedback('wrong');
      setPerfectStreak(0);
    }

    setTimeout(() => {
      setSelected(null);
      setFeedback(null);
      setRound((r) => r + 1);
    }, 1500);
  };

  return (
    <div className="w-full">
      {/* Score bar */}
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold px-3 py-1 rounded-full text-white" style={{ background: 'linear-gradient(135deg, #7C4DFF, #FF6B9D)' }}>
            🏆 {score} pts
          </span>
          <span className="text-sm font-bold px-3 py-1 rounded-full" style={{ background: 'var(--bg-accent)', color: 'var(--text-primary)' }}>
            Lvl {level} {'⭐'.repeat(level)}
          </span>
        </div>
        <div className="text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
          🔥 Streak: {perfectStreak}/3 → Level up!
        </div>
      </div>

      {/* Instructions */}
      <div className="text-center mb-3">
        <p className="font-semibold text-sm" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-display)' }}>
          Find the matching shape below! 👇
        </p>
      </div>

      {/* Three.js Canvas */}
      <div className="rounded-3xl overflow-hidden border-2" style={{ borderColor: 'var(--border-default)', height: 380 }}>
        <Canvas camera={{ position: [0, 0, 7], fov: 50 }} style={{ background: 'linear-gradient(135deg, #1a1a3e, #2d1b69)' }}>
          <Suspense fallback={null}>
            <PuzzleScene
              target={target}
              options={options}
              onSelect={handleSelect}
              selected={selected}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Shape labels */}
      <div className="flex justify-around mt-3 px-4">
        {options.map((opt, i) => {
          const xLabels = options.length === 3 ? ['Left', 'Center', 'Right'] : ['Left', 'Right'];
          return (
            <motion.button
              key={opt.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(opt)}
              disabled={!!feedback}
              className="flex-1 mx-1 py-2 rounded-2xl text-sm font-bold transition-all"
              style={{
                background: selected === opt.id && feedback === 'correct' ? '#4CAF50'
                  : selected === opt.id && feedback === 'wrong' ? '#F44336'
                  : 'var(--bg-accent)',
                color: selected === opt.id ? 'white' : 'var(--text-primary)',
                fontFamily: 'var(--font-display)',
              }}
            >
              {opt.name}
            </motion.button>
          );
        })}
      </div>

      {/* Feedback banner */}
      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-center text-lg font-bold"
          style={{ color: feedback === 'correct' ? '#4CAF50' : '#F44336', fontFamily: 'var(--font-display)' }}
        >
          {feedback === 'correct' ? `🎉 Correct! +${25 * level} pts` : `❌ That's a ${target.name}! Try again!`}
        </motion.div>
      )}

      {/* Level progress bar */}
      <div className="mt-4 px-1">
        <div className="flex justify-between text-xs mb-1" style={{ color: 'var(--text-muted)' }}>
          <span>Level {level} Progress</span>
          <span>{perfectStreak}/3 perfect answers to level up</span>
        </div>
        <div className="progress-track">
          <motion.div
            className="progress-fill"
            animate={{ width: `${(perfectStreak / 3) * 100}%` }}
            transition={{ duration: 0.5 }}
            style={{ background: 'linear-gradient(90deg, #7C4DFF, #FF6B9D)' }}
          />
        </div>
      </div>
    </div>
  );
}
