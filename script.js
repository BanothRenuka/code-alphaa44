// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xff8c00);

// Camera
const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / 500,
    0.1,
    1000
);
camera.position.set(0, 3, 7);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, 500);
document.getElementById("viewer").appendChild(renderer.domElement);

// Lighting
scene.add(new THREE.DirectionalLight(0xffffff, 1).position.set(5, 5, 5));
scene.add(new THREE.AmbientLight(0x404040));

// ================= Suspension Arm Geometry =================
const armGeometry = new THREE.BoxGeometry(4, 0.4, 0.6);

// Stress gradient (blue → red)
const colors = [];
for (let i = 0; i < armGeometry.attributes.position.count; i++) {
    const x = armGeometry.attributes.position.getX(i);
    const stressRatio = (x + 2) / 4;
    colors.push(stressRatio, 0, 1 - stressRatio);
}
armGeometry.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(colors, 3)
);

const armMaterial = new THREE.MeshStandardMaterial({
    vertexColors: true,
    metalness: 0.6,
    roughness: 0.4
});

const arm = new THREE.Mesh(armGeometry, armMaterial);
scene.add(arm);

// ================= Mounting Bushings =================
const bushingGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.5, 24);
const bushingMat = new THREE.MeshStandardMaterial({ color: 0x333333 });

const bushing1 = new THREE.Mesh(bushingGeo, bushingMat);
bushing1.position.x = -2;
bushing1.rotation.z = Math.PI / 2;
scene.add(bushing1);

const bushing2 = new THREE.Mesh(bushingGeo, bushingMat);
bushing2.position.x = 2;
bushing2.rotation.z = Math.PI / 2;
scene.add(bushing2);

// ================= Load Arrow =================
const loadArrow = new THREE.ArrowHelper(
    new THREE.Vector3(0, -1, 0),
    new THREE.Vector3(0, 0.5, 0),
    1,
    0xff0000
);
scene.add(loadArrow);

// ================= Animation (Deformation) =================
let t = 0;
function animate() {
    requestAnimationFrame(animate);

    t += 0.02;
    arm.rotation.z = Math.sin(t) * 0.02; // deformation
    renderer.render(scene, camera);
}
animate();

// Resize Handling
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / 500;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, 500);
});
