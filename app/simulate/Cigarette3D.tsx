'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
export default function Cigarette3D({ inhaling }: { inhaling: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const smokeParticlesRef = useRef<THREE.Mesh[]>([])
  const cigGroupRef = useRef<THREE.Group | null>(null)
  const initializedRef = useRef(false)
  const bodyRef = useRef<THREE.Mesh | null>(null)
  const tipRef = useRef<THREE.Mesh | null>(null)
  const puffCountRef = useRef(0)

  useEffect(() => {
    if (!containerRef.current) return
    if (initializedRef.current) return
    initializedRef.current = true

    const container = containerRef.current
    const width = 260
    const height = 260

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100)
    camera.position.set(0, 0, 8)

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.setSize(width, height)
    container.innerHTML = ''
    container.appendChild(renderer.domElement)

    const ambient = new THREE.AmbientLight(0xffffff, 1.1)
    scene.add(ambient)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2)
    dirLight.position.set(3, 4, 5)
    scene.add(dirLight)
    const fillLight = new THREE.DirectionalLight(0xffe8d0, 0.7)
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
    const cigGroup = new THREE.Group()

    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xf8f5ee, roughness: 0.6 })
    let bodyLength = 4
    const bodyGeo = new THREE.CylinderGeometry(0.35, 0.35, bodyLength, 32)
    const body = new THREE.Mesh(bodyGeo, bodyMat)
    body.rotation.z = Math.PI / 2
    body.position.x = -0.3
    cigGroup.add(body)
    bodyRef.current = body

    const filterGeo = new THREE.CylinderGeometry(0.36, 0.36, 2.6, 32)
    const filterMat = new THREE.MeshStandardMaterial({ color: 0xd4a056, roughness: 0.7 })
    const filterMesh = new THREE.Mesh(filterGeo, filterMat)
    filterMesh.rotation.z = Math.PI / 2
    filterMesh.position.x = 2.8
    cigGroup.add(filterMesh)

    const tipGeo = new THREE.CylinderGeometry(0.34, 0.3, 0.15, 32)
    const tipMat = new THREE.MeshStandardMaterial({
      color: 0xcc4400,
      emissive: 0xff5500,
      emissiveIntensity: 0.3,
      roughness: 0.5,
    })
    const tip = new THREE.Mesh(tipGeo, tipMat)
    tip.rotation.z = Math.PI / 2
    tip.position.x = -2.35
    cigGroup.add(tip)
    tipRef.current = tip

    scene.add(cigGroup)
    cigGroupRef.current = cigGroup
    cigGroup.rotation.x = 0.15

    const smokeGeo = new THREE.SphereGeometry(0.25, 16, 16)
    const smokeParticles: THREE.Mesh[] = []
    for (let i = 0; i < 8; i++) {
      const smokeMat = new THREE.MeshStandardMaterial({
        color: 0xcccccc,
        transparent: true,
        opacity: 0,
        roughness: 1,
      })
      const particle = new THREE.Mesh(smokeGeo, smokeMat)
      particle.position.set(-2.35, 0, 0)
      particle.scale.setScalar(0.3)
      scene.add(particle)
      smokeParticles.push(particle)
    }
    smokeParticlesRef.current = smokeParticles

    let frame = 0
    let animId: number

    const animate = () => {
      frame += 1
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
    if (!inhaling) return
    puffCountRef.current += 1
    const maxPuffs = 20
    const progress = Math.min(puffCountRef.current / maxPuffs, 1)

    if (bodyRef.current && tipRef.current) {
      const fullLength = 4
      const newLength = Math.max(fullLength * (1 - progress * 0.85), 0.3)

      bodyRef.current.geometry.dispose()
      bodyRef.current.geometry = new THREE.CylinderGeometry(0.35, 0.35, newLength, 32)

      const rightEdge = 1.7
      bodyRef.current.position.x = rightEdge - newLength / 2
      tipRef.current.position.x = rightEdge - newLength
    }

    if (puffCountRef.current >= maxPuffs) {
      setTimeout(() => {
        puffCountRef.current = 0
        if (bodyRef.current && tipRef.current) {
          bodyRef.current.scale.x = 1
          bodyRef.current.position.x = -0.3
          tipRef.current.position.x = -2.35
        }
      }, 1000)
    }
    const tipX = tipRef.current ? tipRef.current.position.x : -2.35
    const particles = smokeParticlesRef.current
    particles.forEach((p, i) => {
      const delay = i * 100
      setTimeout(() => {
        const mat = p.material as THREE.MeshStandardMaterial
        const myRunId = Math.random()
        ;(p as any)._runId = myRunId
        const startTime = Date.now()
        const duration = 1600

        p.position.set(tipX, 0, 0)
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
          p.position.y = t * 3
          p.position.x = tipX + Math.sin(t * 4 + i) * 0.3
          p.scale.setScalar(0.3 + t * 0.8)
          mat.opacity = 0.35 * (1 - t)
          requestAnimationFrame(animateParticle)
        }
        animateParticle()
      }, delay)
    })
  }, [inhaling])

  return <div ref={containerRef} style={{ width: 260, height: 260 }} />
}