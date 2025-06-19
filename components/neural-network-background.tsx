"use client"

import { useEffect, useRef } from "react"

interface Point {
  x: number
  y: number
  vx: number
  vy: number
  connections: number[]
}

interface NeuralNetworkBackgroundProps {
  className?: string
  pointCount?: number
  connectionDistance?: number
  pointSize?: number
  lineWidth?: number
  speed?: number
  color?: string
}

export function NeuralNetworkBackground({
  className = "",
  pointCount = 40,
  connectionDistance = 150,
  pointSize = 1,
  lineWidth = 0.5,
  speed = 0.5,
  color = "hsl(196, 100%, 50%)",
}: NeuralNetworkBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointsRef = useRef<Point[]>([])
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initPoints()
    }

    const initPoints = () => {
      pointsRef.current = []
      for (let i = 0; i < pointCount; i++) {
        pointsRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          connections: [],
        })
      }
    }

    const updateConnections = () => {
      const points = pointsRef.current
      for (let i = 0; i < points.length; i++) {
        points[i].connections = []
        for (let j = 0; j < points.length; j++) {
          if (i === j) continue
          const dx = points[i].x - points[j].x
          const dy = points[i].y - points[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)
          if (distance < connectionDistance) {
            points[i].connections.push(j)
          }
        }
      }
    }

    const animate = () => {
      if (!canvas || !ctx) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const points = pointsRef.current
      updateConnections()

      // Draw connections
      ctx.strokeStyle = color
      ctx.lineWidth = lineWidth
      ctx.beginPath()
      for (let i = 0; i < points.length; i++) {
        const point = points[i]
        for (const j of point.connections) {
          const connectedPoint = points[j]
          const dx = point.x - connectedPoint.x
          const dy = point.y - connectedPoint.y
          const distance = Math.sqrt(dx * dx + dy * dy)
          const opacity = 1 - distance / connectionDistance
          ctx.strokeStyle = color.replace(")", `, ${opacity})`)
          ctx.beginPath()
          ctx.moveTo(point.x, point.y)
          ctx.lineTo(connectedPoint.x, connectedPoint.y)
          ctx.stroke()
        }
      }

      // Draw points
      ctx.fillStyle = color
      for (const point of points) {
        ctx.beginPath()
        ctx.arc(point.x, point.y, pointSize, 0, Math.PI * 2)
        ctx.fill()

        // Update position
        point.x += point.vx
        point.y += point.vy

        // Bounce off edges
        if (point.x < 0 || point.x > canvas.width) point.vx *= -1
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [pointCount, connectionDistance, pointSize, lineWidth, speed, color])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 -z-10 opacity-20 ${className}`}
      style={{ pointerEvents: "none" }}
    />
  )
}
