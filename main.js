document.addEventListener('DOMContentLoaded', () => {
  const layers = document.querySelectorAll('.layer');
  const overlay = document.getElementById('welcome-overlay');

  function moveLayers(deltaX, deltaY) {
    layers.forEach((layer) => {
      const depth = parseFloat(layer.getAttribute('data-depth')) || 0.1;
      const translateX = -deltaX * (depth * 450);
      const translateY = -deltaY * (depth * 450);
      layer.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    });
  }

  // 1. Movimiento con mouse (PC)
  document.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const deltaX = (e.clientX - centerX) / centerX;
    const deltaY = (e.clientY - centerY) / centerY;
    moveLayers(deltaX, deltaY);
  });

  // 2. Movimiento con giroscopio (Móvil)
  function handleOrientation(e) {
    if (e.gamma === null || e.beta === null) return;
    const deltaX = Math.max(-1.5, Math.min(1.5, e.gamma / 12));
    const deltaY = Math.max(-1.5, Math.min(1.5, (e.beta - 45) / 15));
    moveLayers(deltaX, deltaY);
  }

  // 3. Activación al hacer clic/toque en la pantalla de bienvenida
  if (overlay) {
    overlay.addEventListener('click', () => {
      // Solicitar permisos de giroscopio en iOS si aplica
      if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
        DeviceOrientationEvent.requestPermission()
          .then(response => {
            if (response === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation, true);
            }
          })
          .catch(console.error);
      } else if (window.DeviceOrientationEvent) {
        // Android / otros navegadores
        window.addEventListener('deviceorientation', handleOrientation, true);
      }

      // Ocultar la pantalla de bienvenida agregando la clase .hidden
      overlay.classList.add('hidden');
    });
  }
});
