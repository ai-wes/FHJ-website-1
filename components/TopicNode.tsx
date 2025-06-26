import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { Topic } from './topicsData';

interface TopicNodeProps {
  topic: Topic;
  onHover: (topic: Topic | null) => void;
  isSelected: boolean;
  onClick: (topic: Topic) => void;
}

const TopicNode: React.FC<TopicNodeProps> = ({ topic, onHover, isSelected, onClick }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const [isHovered, setIsHovered] = useState(false);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.position.y = topic.position[1] + Math.sin(state.clock.elapsedTime + topic.position[0]) * 0.1;
    }
  });

  const sphereColor = isHovered || isSelected ? new THREE.Color(topic.color).multiplyScalar(1.5) : topic.color;

  return (
    <group position={topic.position}>
      <mesh
        ref={meshRef}
        onPointerOver={(e) => {
          e.stopPropagation();
          setIsHovered(true);
          onHover(topic);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          setIsHovered(false);
          onHover(null);
          document.body.style.cursor = 'auto';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onClick(topic);
        }}
        scale={isHovered || isSelected ? 1.2 : 1}
      >
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial
          color={sphereColor}
          emissive={sphereColor}
          emissiveIntensity={isHovered || isSelected ? 0.8 : 0.3}
          roughness={0.4}
          metalness={0.1}
        />
      </mesh>
      <Html position={[0, 0.45, 0]} center>
        <div
          style={{
            color: 'white',
            padding: '2px 5px',
            fontSize: '12px',
            textAlign: 'center',
            minWidth: '100px',
            userSelect: 'none',
            pointerEvents: 'none',
            opacity: isHovered || isSelected ? 1 : 0.7,
            transform: isHovered || isSelected ? 'scale(1.1)' : 'scale(1)',
            transition: 'opacity 0.2s, transform 0.2s',
          }}
        >
          {topic.name}
        </div>
      </Html>
    </group>
  );
};

export default TopicNode;
