function createRenderer(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);
  return renderer;
}

function createCamera(container) {
  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    100
  );
  camera.position.set(4, 3, 6);
  return camera;
}

function startOrbitCatShrine() {
  const container = document.querySelector("#three-shrine");
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#090009");

  const camera = createCamera(container);
  const renderer = createRenderer(container);
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  scene.add(new THREE.AmbientLight("#ffffff", 0.55));
  const pinkLight = new THREE.PointLight("#ff2aa7", 1.6, 20);
  pinkLight.position.set(2.5, 3, 3);
  scene.add(pinkLight);

  const group = new THREE.Group();
  scene.add(group);

  const cubeMaterial = new THREE.MeshStandardMaterial({
    color: "#ff2aa7",
    roughness: 0.35,
    metalness: 0.2
  });
  const darkMaterial = new THREE.MeshStandardMaterial({
    color: "#111111",
    roughness: 0.8
  });

  const base = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.24, 3.2), darkMaterial);
  base.position.y = -1.15;
  group.add(base);

  for (let i = 0; i < 9; i += 1) {
    const angle = (i / 9) * Math.PI * 2;
    const block = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.42), cubeMaterial);
    block.position.set(Math.cos(angle) * 1.55, Math.sin(i) * 0.25, Math.sin(angle) * 1.55);
    block.rotation.set(i * 0.2, i * 0.4, i * 0.1);
    group.add(block);
  }

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.82, 32, 24),
    new THREE.MeshStandardMaterial({ color: "#f4f4f4", roughness: 0.5 })
  );
  group.add(head);

  const earGeometry = new THREE.ConeGeometry(0.34, 0.72, 3);
  const leftEar = new THREE.Mesh(earGeometry, cubeMaterial);
  leftEar.position.set(-0.48, 0.72, 0);
  leftEar.rotation.z = 0.35;
  group.add(leftEar);

  const rightEar = leftEar.clone();
  rightEar.position.x = 0.48;
  rightEar.rotation.z = -0.35;
  group.add(rightEar);

  const eyeMaterial = new THREE.MeshBasicMaterial({ color: "#050505" });
  [-0.28, 0.28].forEach((x) => {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.08, 16, 12), eyeMaterial);
    eye.position.set(x, 0.08, 0.76);
    group.add(eye);
  });

  function resize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  window.addEventListener("resize", resize);

  function animate() {
    requestAnimationFrame(animate);
    group.rotation.y += 0.006;
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}

function startFoggyMoodRoom() {
  const container = document.querySelector("#three-room");
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#050505");
  scene.fog = new THREE.Fog("#180018", 4, 12);

  const camera = createCamera(container);
  camera.position.set(3.4, 2.5, 5.2);
  const renderer = createRenderer(container);
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  scene.add(new THREE.AmbientLight("#ffb3e5", 0.35));

  const light = new THREE.PointLight("#ff2aa7", 2.3, 16);
  light.position.set(0, 2.2, 2.5);
  scene.add(light);

  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(8, 8),
    new THREE.MeshStandardMaterial({ color: "#111111", roughness: 0.78 })
  );
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -1.2;
  scene.add(floor);

  const objects = [];
  const materials = [
    new THREE.MeshStandardMaterial({ color: "#ff2aa7", roughness: 0.2, metalness: 0.35 }),
    new THREE.MeshStandardMaterial({ color: "#59d7ff", roughness: 0.42 }),
    new THREE.MeshStandardMaterial({ color: "#ffffff", roughness: 0.55 })
  ];

  for (let i = 0; i < 14; i += 1) {
    const geometry = i % 2 === 0
      ? new THREE.TorusGeometry(0.28, 0.08, 12, 28)
      : new THREE.IcosahedronGeometry(0.34, 0);
    const mesh = new THREE.Mesh(geometry, materials[i % materials.length]);
    mesh.position.set(
      (Math.random() - 0.5) * 4.4,
      Math.random() * 2 - 0.7,
      (Math.random() - 0.5) * 4.4
    );
    mesh.rotation.set(Math.random(), Math.random(), Math.random());
    scene.add(mesh);
    objects.push(mesh);
  }

  function resize() {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  }

  window.addEventListener("resize", resize);

  function animate() {
    requestAnimationFrame(animate);
    objects.forEach((object, index) => {
      object.rotation.x += 0.004 + index * 0.0004;
      object.rotation.y += 0.007;
      object.position.y += Math.sin(Date.now() * 0.001 + index) * 0.0015;
    });
    controls.update();
    renderer.render(scene, camera);
  }

  animate();
}

if (window.THREE) {
  startOrbitCatShrine();
  startFoggyMoodRoom();
}
