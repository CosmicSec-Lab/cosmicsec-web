import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface NodeData {
  id: string;
  label: string;
  type: 'asset' | 'threat' | 'network' | 'user';
  risk: 'low' | 'medium' | 'high' | 'critical';
  x?: number;
  y?: number;
  z?: number;
}

interface ConnectionData {
  source: string;
  target: string;
  type: 'attack' | 'access' | 'data';
  label?: string;
}

interface ThreeJSVisualizationProps {
  nodes: NodeData[];
  connections: ConnectionData[];
  onNodeClick?: (node: NodeData) => void;
  width?: number;
  height?: number;
}

export const ThreeJSVisualization: React.FC<ThreeJSVisualizationProps> = ({
  nodes,
  connections,
  onNodeClick,
  width = 800,
  height = 600
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);

  const getRiskColor = (risk: string): number => {
    switch (risk) {
      case 'low': return 0x00ff00;
      case 'medium': return 0xffff00;
      case 'high': return 0xff9900;
      case 'critical': return 0xff0000;
      default: return 0x0077ff;
    }
  };

  const getTypeGeometry = (type: string): THREE.BufferGeometry => {
    switch (type) {
      case 'threat': return new THREE.ConeGeometry(0.5, 1, 8);
      case 'network': return new THREE.BoxGeometry(1, 0.2, 1);
      case 'user': return new THREE.SphereGeometry(0.4, 16, 16);
      default: return new THREE.SphereGeometry(0.6, 16, 16);
    }
  };

  useEffect(() => {
    if (!mountRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e27);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const nodeObjects: Map<string, THREE.Mesh> = new Map();
    const nodeDataMap: Map<string, NodeData> = new Map();

    nodes.forEach((node) => {
      const geometry = getTypeGeometry(node.type);
      const material = new THREE.MeshPhongMaterial({
        color: getRiskColor(node.risk),
        emissive: getRiskColor(node.risk),
        emissiveIntensity: 0.2,
        shininess: 100
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(
        node.x || (Math.random() - 0.5) * 8,
        node.y || (Math.random() - 0.5) * 8,
        node.z || (Math.random() - 0.5) * 4
      );
      mesh.userData = { nodeId: node.id };
      scene.add(mesh);
      nodeObjects.set(node.id, mesh);
      nodeDataMap.set(node.id, node);
    });

    connections.forEach((conn) => {
      const sourceNode = nodeObjects.get(conn.source);
      const targetNode = nodeObjects.get(conn.target);
      if (sourceNode && targetNode) {
        const points = [
          sourceNode.position.clone(),
          targetNode.position.clone()
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const material = new THREE.LineBasicMaterial({
          color: conn.type === 'attack' ? 0xff0000 : conn.type === 'data' ? 0x00ff00 : 0x0099ff,
          opacity: 0.6,
          transparent: true
        });
        const line = new THREE.Line(geometry, material);
        scene.add(line);
      }
    });

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0) {
        const nodeId = intersects[0].object.userData.nodeId;
        if (nodeId) {
          const nodeData = nodeDataMap.get(nodeId);
          if (nodeData) {
            setSelectedNode(nodeData);
            onNodeClick?.(nodeData);
          }
        }
      }
    };

    renderer.domElement.addEventListener('click', handleClick);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      renderer.domElement.removeEventListener('click', handleClick);
      controls.dispose();
      renderer.dispose();
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [nodes, connections, width, height, onNodeClick]);

  return (
    <div style={{ position: 'relative' }}>
      <div ref={mountRef} style={{ width, height, borderRadius: '12px', overflow: 'hidden' }} />
      {selectedNode && (
        <div style={{
          position: 'absolute',
          top: 20,
          right: 20,
          background: 'rgba(10, 14, 39, 0.95)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(0, 255, 136, 0.3)',
          borderRadius: '12px',
          padding: '16px',
          color: '#fff',
          minWidth: '200px'
        }}>
          <h3 style={{ margin: '0 0 8px 0', color: '#00ff88' }}>{selectedNode.label}</h3>
          <p style={{ margin: '4px 0', fontSize: '14px' }}>Type: {selectedNode.type}</p>
          <p style={{ margin: '4px 0', fontSize: '14px' }}>
            Risk: <span style={{ color: getRiskColor(selectedNode.risk).toString(16) }}>{selectedNode.risk}</span>
          </p>
          <button
            onClick={() => setSelectedNode(null)}
            style={{
              marginTop: '8px',
              padding: '6px 12px',
              background: 'rgba(0, 255, 136, 0.2)',
              border: '1px solid #00ff88',
              borderRadius: '6px',
              color: '#00ff88',
              cursor: 'pointer'
            }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
};
