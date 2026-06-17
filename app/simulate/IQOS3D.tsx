'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default function IQOS3D({ inhaling }: { inhaling: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const initializedRef = useRef(false)
  const smokeParticlesRef = useRef<THREE.Mesh[]>([])
  const screenLightsRef = useRef<THREE.Mesh[]>([])
  const stickTipRef = useRef<THREE.Mesh | null>(null)

  useEffect(() => {
    if (!containerRef.current) return
    if (initializedRef.current) return
    initializedRef.current = true

    const container = containerRef.current
    const width = 260
    const height = 260

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(32, width / height, 0.1, 100)
    camera.position.set(0, 0, 9)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 1.1)
    scene.add(ambient)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight.position.set(3, 4, 5)
    scene.add(dirLight)
    const fillLight = new THREE.DirectionalLight(0xddeeff, 0.7)
    fillLight.position.set(-3, -2, 2)
    scene.add(fillLight)
    const topLight = new THREE.DirectionalLight(0xffffff, 0.5)
    topLight.position.set(0, 5, 0)
    scene.add(topLight)

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableZoom = false
    controls.enablePan = false
    controls.minPolarAngle = Math.PI / 2 - 0.6
    controls.maxPolarAngle = Math.PI / 2 + 0.6
    controls.target.set(0, -0.5, 0)

    const deviceGroup = new THREE.Group()

    // Ana gövde - çok ince, uzun, parlak krom
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xd8e8ee,
      metalness: 0.85,
      roughness: 0.12,
    })
    const bodyGeo = new THREE.CylinderGeometry(0.26, 0.28, 4.2, 32)
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    body.position.y = -0.6
    deviceGroup.add(body)

    // Üst kapak (yuvarlatılmış, hafif daralan)
    const capGeo = new THREE.SphereGeometry(0.26, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2)
    const cap = new THREE.Mesh(capGeo, bodyMat)
    cap.position.y = 1.5
    deviceGroup.add(cap)

    // Alt taban (hafif daralan, düz kesim)
    const baseGeo = new THREE.CylinderGeometry(0.28, 0.24, 0.15, 32)
    const base = new THREE.Mesh(baseGeo, bodyMat)
    base.position.y = -2.78
    deviceGroup.add(base)

    // Ekran paneli (ince, dikey, ön yüzde)
    const screenMat = new THREE.MeshStandardMaterial({
      color: 0x05080c,
      metalness: 0.3,
      roughness: 0.4,
    })
    const screenGeo = new THREE.BoxGeometry(0.32, 0.7, 0.04)
    const screen = new THREE.Mesh(screenGeo, screenMat)
    screen.position.set(0, -0.3, 0.27)
    deviceGroup.add(screen)

    // Ekran üstündeki ışık noktaları (4 tane, küçük)
    const lightDots: THREE.Mesh[] = []
    const dotPositions: [number, number][] = [
      [-0.08, 0.05],
      [0.08, 0.05],
      [-0.08, -0.15],
      [0.08, -0.15],
    ]
    dotPositions.forEach(([dx, dy]) => {
      const dotMat = new THREE.MeshStandardMaterial({
        color: 0x0a2030,
        emissive: 0x2090d0,
        emissiveIntensity: 0,
      })
      const dotGeo = new THREE.CircleGeometry(0.035, 16)
      const dot = new THREE.Mesh(dotGeo, dotMat)
      dot.position.set(dx, dy, 0.3)
      deviceGroup.add(dot)
      lightDots.push(dot)
    })
    screenLightsRef.current = lightDots

    // İnce ışık halkası (alt, ekran altında)
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x4090c0,
      emissive: 0x2070a0,
      emissiveIntensity: 0.4,
    })
    const ringGeo = new THREE.TorusGeometry(0.275, 0.025, 16, 32)
    const ring = new THREE.Mesh(ringGeo, ringMat)
    ring.rotation.x = Math.PI / 2
    ring.position.y = -1.0
    deviceGroup.add(ring)

    const stickMat = new THREE.MeshStandardMaterial({ color: 0xf2eee5, roughness: 0.55 })
    const stickGeo = new THREE.CylinderGeometry(0.11, 0.11, 0.9, 24)
    const stick = new THREE.Mesh(stickGeo, stickMat)
    stick.position.y = 2.0
    deviceGroup.add(stick)

    const tipMat = new THREE.MeshStandardMaterial({
      color: 0xb8784a,
      emissive: 0xff5500,
      emissiveIntensity: 0,
      roughness: 0.5,
    })
    const tipGeo = new THREE.CylinderGeometry(0.115, 0.105, 0.13, 24)
    const tip = new THREE.Mesh(tipGeo, tipMat)
    tip.position.y = 2.5
    deviceGroup.add(tip)

    

    scene.add(deviceGroup)
    deviceGroup.rotation.x = 0.08

    const smokeGeo = new THREE.SphereGeometry(0.22, 16, 16)
    const smokeParticles: THREE.Mesh[] = []
    for (let i = 0; i < 8; i++) {
      const smokeMat = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0,
        roughness: 1,
      })
      const particle = new THREE.Mesh(smokeGeo, smokeMat)
      particle.position.set(0, 2.5, 0)
      particle.scale.setScalar(0.3)
      scene.add(particle)
      smokeParticles.push(particle)
    }
    smokeParticlesRef.current = smokeParticles

    let animId: number
    const animate = () => {
      controls.update()
      renderer.render(scene, camera)
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      renderer.dispose()
    }
  }, [])

  useEffect(() => {
    const dots = screenLightsRef.current
    const tip = stickTipRef.current
    dots.forEach(dot => {
      const mat = dot.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = inhaling ? 0.9 : 0
    })
    if (tip) {
      const mat = tip.material as THREE.MeshStandardMaterial
      mat.emissiveIntensity = inhaling ? 0.8 : 0
    }
  }, [inhaling])

  useEffect(() => {
    if (!inhaling) return
    const particles = smokeParticlesRef.current
    particles.forEach((p, i) => {
      const delay = i * 100
      setTimeout(() => {
        const mat = p.material as THREE.MeshStandardMaterial
        const myRunId = Math.random()
        ;(p as any)._runId = myRunId
        const startTime = Date.now()
        const duration = 1600

        p.position.set(0, 2.5, 0)
        p.scale.setScalar(0.3)
        mat.opacity = 0.35

        const animateParticle = () => {
          if ((p as any)._runId !== myRunId) return
          const elapsed = Date.now() - startTime
          const t = Math.min(elapsed / duration, 1)
          if (t >= 1) {
            mat.opacity = 0
            return
          }
          p.position.y = 2.9 + t * 2.5
          p.position.x = Math.sin(t * 4 + i) * 0.3
          p.scale.setScalar(0.3 + t * 0.8)
          mat.opacity = 0.35 * (1 - t)
          requestAnimationFrame(animateParticle)
        }
        animateParticle()
      }, delay)
    })
  }, [inhaling])

return <div ref={containerRef} style={{ width: 260, height: 260, cursor: 'grab', touchAction: 'none' }} />}