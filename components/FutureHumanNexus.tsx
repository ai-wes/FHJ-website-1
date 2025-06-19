"use client";

import React, { useState, Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { topics, Topic } from "./topicsData";
import TopicNode from "./TopicNode";

const FutureHumanNexus: React.FC = () => {
  const [hoveredTopic, setHoveredTopic] = useState<Topic | null>(null);
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const handleNodeHover = (topic: Topic | null) => {
    setHoveredTopic(topic);
  };

  const handleNodeClick = (topic: Topic) => {
    setSelectedTopic((prev) => (prev?.id === topic.id ? null : topic));
    // You can add navigation or more info here
  };

  const displayTopic = hoveredTopic || selectedTopic;

  return (
    <div
      style={{
        height: "500px",
        width: "100%",
        position: "relative",
        background: "#0a0f19",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 4px 32px rgba(0,0,0,0.4)",
      }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.3} />
          <pointLight position={[5, 5, 5]} intensity={1} />
          <pointLight position={[-5, -5, -5]} intensity={0.5} />

          <Stars
            radius={100}
            depth={50}
            count={5000}
            factor={4}
            saturation={0}
            fade
            speed={1}
          />
          <Sparkles
            count={30}
            scale={6}
            size={5}
            speed={0.4}
            color="lightblue"
          />

          <group>
            {topics.map((topic) => (
              <TopicNode
                key={topic.id}
                topic={topic}
                onHover={handleNodeHover}
                isSelected={selectedTopic?.id === topic.id}
                onClick={handleNodeClick}
              />
            ))}
          </group>

          {/* Central core element */}
          <mesh scale={0.5}>
            <icosahedronGeometry args={[1, 1]} />
            <meshStandardMaterial
              color="#555"
              emissive="#222"
              emissiveIntensity={0.2}
              roughness={0.6}
              metalness={0.3}
              wireframe
            />
          </mesh>

          <OrbitControls
            enableZoom={true}
            enablePan={false}
            minDistance={3}
            maxDistance={10}
          />
        </Suspense>
      </Canvas>

      {/* 2D Overlay for Topic Information */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          padding: "15px",
          background: "rgba(0, 0, 0, 0.7)",
          color: "white",
          borderRadius: "8px",
          maxWidth: "300px",
          opacity: displayTopic ? 1 : 0,
          transform: displayTopic ? "translateY(0)" : "translateY(-20px)",
          transition: "opacity 0.3s ease, transform 0.3s ease",
          pointerEvents: "none",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {displayTopic ? (
          <>
            <h3
              style={{
                marginTop: 0,
                marginBottom: "10px",
                color: displayTopic.color,
              }}
            >
              {displayTopic.name}
            </h3>
            <p style={{ margin: 0, fontSize: "14px" }}>
              {displayTopic.shortDescription}
            </p>
          </>
        ) : (
          <p style={{ margin: 0, fontSize: "14px", fontStyle: "italic" }}>
            Hover over a concept node.
          </p>
        )}
      </div>
    </div>
  );
};

export default FutureHumanNexus;
