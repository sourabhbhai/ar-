import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

type Props = {
  modelUrl?: string;
};

export default function ThreeFallback({ modelUrl }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf7f7f7);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.0);
    hemi.position.set(0, 20, 0);
    scene.add(hemi);

    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(5, 10, 7.5);
    scene.add(dir);

    // Ground plane
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(200, 200),
      new THREE.MeshPhongMaterial({ color: 0xffffff, depthWrite: false })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.2;
    scene.add(ground);

    // simple fallback mesh if no modelUrl or model fails
    let model: THREE.Object3D | null = null;
    const loader = new GLTFLoader();

    const addPlaceholder = () => {
      const geo = new THREE.CylinderGeometry(0.9, 0.9, 0.6, 32);
      const mat = new THREE.MeshStandardMaterial({ color: 0xffa726, metalness: 0.2, roughness: 0.6 });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, 0, 0);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      // small topping spheres
      const toppingGeo = new THREE.SphereGeometry(0.08, 12, 12);
      const toppingMat = new THREE.MeshStandardMaterial({ color: 0xff6b6b });
      for (let i = 0; i < 6; i++) {
        const t = new THREE.Mesh(toppingGeo, toppingMat);
        t.position.set((Math.random() - 0.5) * 0.9, 0.2 + Math.random() * 0.15, (Math.random() - 0.5) * 0.9);
        mesh.add(t);
      }
      model = mesh;
      scene.add(model);
    };

    const loadModel = (url: string) => {
      loader.load(
        url,
        (gltf) => {
          if (model) scene.remove(model);
          model = gltf.scene;
          model.position.set(0, -0.6, 0);
          model.rotation.y = Math.PI; // adjust as needed
          scene.add(model);
        },
        undefined,
        (err) => {
          console.error("GLTF load error:", err);
          if (!model) addPlaceholder();
        }
      );
    };

    if (modelUrl) {
      loadModel(modelUrl);
    } else {
      addPlaceholder();
    }

    // animate
    const clock = new THREE.Clock();
    const animate = () => {
      const t = clock.getElapsedTime();
      if (model) model.rotation.y = t * 0.5;
      renderer.render(scene, camera);
      frameIdRef.current = requestAnimationFrame(animate);
    };
    animate();

    // handle resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      if (frameIdRef.current) cancelAnimationFrame(frameIdRef.current);
      window.removeEventListener("resize", handleResize);
      if (rendererRef.current) {
        rendererRef.current.dispose();
        const canvas = rendererRef.current.domElement;
        if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
      }
    };
  }, [modelUrl]);

  return <div ref={containerRef} style={{ width: "100%", height: "100%" }} />;
}
