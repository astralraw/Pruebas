document.addEventListener('DOMContentLoaded', () => {
  const layers = document.querySelectorAll('.layer');

  function moveLayers(deltaX, deltaY) {
    layers.forEach((layer) => {
      const depth = parseFloat(layer.getAttribute('data-depth')) || 0.1;
      
      // AUMENTADO: Multiplicamos por 450 (antes era 200) para un recorrido mucho más amplio
      const translateX = -deltaX * (depth * 450);
      const translateY = -deltaY * (depth * 450);
      
      layer.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    });
  }

  // 1. Sensibilidad al ratón (Escritorio)
  document.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const deltaX = (e.clientX - centerX) / centerX;
    const deltaY = (e.clientY - centerY) / centerY;
    moveLayers(deltaX, deltaY);
  });

  // 2. Giroscopio Móvil (Sensibilidad incrementada)
  function handleOrientation(e) {
    if (e.gamma === null || e.beta === null) return;

    // AUMENTADO: Dividimos entre 12 y 15 (antes era 25-30) para mayor reactividad con pequeños giros
    const deltaX = Math.max(-1.5, Math.min(1.5, e.gamma / 12));
    const deltaY = Math.max(-1.5, Math.min(1.5, (e.beta - 45) / 15));

    moveLayers(deltaX, deltaY);
  }

  // Solicitud de permisos / Activación al primer toque
  window.addEventListener('touchstart', function initSensors() {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true);
          }
        })
        .catch(console.error);
    } else if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
    window.removeEventListener('touchstart', initSensors);
  }, { once: true });
});
