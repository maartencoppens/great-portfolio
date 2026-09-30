// Bakes the homepage particle shapes into one small binary file.
// Run with: npm run bake
//
// This script bakes the particle shapes into a single binary file.
// Input:  assets-src/models/*.glb
// Output: public/particles.bin  (4 shapes x 18000 points x xyz, Int16)
//
// Only re-run this when you change or add a model.

import fs from "node:fs";
import { NodeIO } from "@gltf-transform/core";
import * as THREE from "three";
import { MeshSurfaceSampler } from "three/examples/jsm/math/MeshSurfaceSampler.js";

// Order matters: Model.tsx reads the shapes back in this same order.
const FILES = ["skateboard", "drums", "headphones", "bass"];
const PARTICLE_COUNT = 18000; // must match PARTICLE_COUNT in Model.tsx
const INPUT_DIR = "assets/models";
const OUTPUT_FILE = "public/particles.bin";

const io = new NodeIO();

// Read a GLB and rebuild it as a THREE.Group with only the geometry we need
// (positions + triangle indices). Textures, materials, normals and UVs are ignored.
async function loadAsGroup(path) {
  const doc = await io.read(path);
  const group = new THREE.Group();

  for (const node of doc.getRoot().listNodes()) {
    const mesh = node.getMesh();
    if (!mesh) continue;

    for (const prim of mesh.listPrimitives()) {
      const position = prim.getAttribute("POSITION");
      if (!position) continue;

      const geo = new THREE.BufferGeometry();
      geo.setAttribute(
        "position",
        new THREE.BufferAttribute(position.getArray(), 3),
      );

      const indices = prim.getIndices();
      if (indices)
        geo.setIndex(new THREE.BufferAttribute(indices.getArray(), 1));

      const m = new THREE.Mesh(geo);
      // Put the mesh where it sits in the original scene
      m.matrixAutoUpdate = false;
      m.matrix.fromArray(node.getWorldMatrix());
      group.add(m);
    }
  }

  return group;
}

// Same logic as the original toParticles in Model.tsx:
// sample points on the surface, center them, scale to fit within -1..1.
function toParticles(scene, count) {
  scene.updateWorldMatrix(true, true);
  const meshes = [];
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) meshes.push(child);
  });
  if (meshes.length === 0) return new Float32Array(count * 3);

  const raw = [];
  const tempPosition = new THREE.Vector3();
  const samplesPerMesh = Math.ceil(count / meshes.length);
  for (const mesh of meshes) {
    const sampler = new MeshSurfaceSampler(mesh).build();
    for (let i = 0; i < samplesPerMesh && raw.length / 3 < count; i++) {
      sampler.sample(tempPosition);
      tempPosition.applyMatrix4(mesh.matrixWorld);
      raw.push(tempPosition.x, tempPosition.y, tempPosition.z);
    }
  }

  const n = raw.length / 3;
  if (n === 0) return new Float32Array(count * 3);

  let cx = 0,
    cy = 0,
    cz = 0;
  for (let i = 0; i < raw.length; i += 3) {
    cx += raw[i] ?? 0;
    cy += raw[i + 1] ?? 0;
    cz += raw[i + 2] ?? 0;
  }
  cx /= n;
  cy /= n;
  cz /= n;

  let maxDist = 0;
  for (let i = 0; i < raw.length; i += 3)
    maxDist = Math.max(
      maxDist,
      Math.hypot(
        (raw[i] ?? 0) - cx,
        (raw[i + 1] ?? 0) - cy,
        (raw[i + 2] ?? 0) - cz,
      ),
    );
  const safeMaxDist = maxDist || 1;

  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    out[i * 3] = ((raw[i * 3] ?? 0) - cx) / safeMaxDist;
    out[i * 3 + 1] = ((raw[i * 3 + 1] ?? 0) - cy) / safeMaxDist;
    out[i * 3 + 2] = ((raw[i * 3 + 2] ?? 0) - cz) / safeMaxDist;
  }
  return out;
}

// -1..1 floats (4 bytes each) -> whole numbers (2 bytes each)
const toInt16 = (f32) => Int16Array.from(f32, (v) => Math.round(v * 32767));

// Main
const all = new Int16Array(FILES.length * PARTICLE_COUNT * 3);

for (let k = 0; k < FILES.length; k++) {
  const path = `${INPUT_DIR}/${FILES[k]}.glb`;
  if (!fs.existsSync(path)) {
    console.error(`Missing model: ${path}`);
    process.exit(1);
  }
  const group = await loadAsGroup(path);
  const shape = toInt16(toParticles(group, PARTICLE_COUNT));
  all.set(shape, k * PARTICLE_COUNT * 3);
  console.log(`${FILES[k]}: ${shape.length / 3} points`);
}

fs.writeFileSync(OUTPUT_FILE, Buffer.from(all.buffer));
console.log(`Wrote ${OUTPUT_FILE} (${(all.byteLength / 1024).toFixed(0)} KB)`);
