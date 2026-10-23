document.addEventListener('DOMContentLoaded', () => {
  const layers = document.querySelectorAll('.layer');

  // Función unificada para mover las capas
  function moveLayers(deltaX, deltaY) {
    layers.forEach((layer) => {
      const depth = parseFloat(layer.getAttribute('data-depth')) || 0.1;
      const translateX = -deltaX * (depth * 200);
      const translateY = -deltaY * (depth * 200);
      layer.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    });
  }

  // 1. EFECTO MOUSE (Escritorio / PC)
  document.addEventListener('mousemove', (e) => {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const deltaX = (e.clientX - centerX) / centerX;
    const deltaY = (e.clientY - centerY) / centerY;
    moveLayers(deltaX, deltaY);
  });

  // 2. EFECTO GIROSCOPIO (Dispositivos Móviles)
  if (window.DeviceOrientationEvent) {
    // En iOS (Safari), se requiere un permiso del usuario por seguridad
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // Creamos un evento táctil en el primer toque de la pantalla para pedir el permiso
      window.addEventListener('click', function requestMotionPermission() {
        DeviceOrientationEvent.requestPermission()
          .then(response => {
            if (response === 'granted') {
              window.addEventListener('deviceorientation', handleOrientation);
            }
          })
          .catch(console.error);
        // Remueve el listener para que solo se pida una vez
        window.removeEventListener('click', requestMotionPermission);
      }, { once: true });
    } else {
      // Android y otros navegadores que permiten el giroscopio por defecto
      window.addEventListener('deviceorientation', handleOrientation);
    }
  }

  function handleOrientation(e) {
    // gamma: rotación en el eje Y (inclinar el teléfono izq / der) [-90 a 90]
    // beta: rotación en el eje X (inclinar el teléfono adelante / atrás) [-180 to 180]
    const gamma = e.gamma || 0; 
    const beta = e.beta || 0;

    // Normalizamos los valores a un rango de -1 a 1
    const deltaX = Math.max(-1, Math.min(1, gamma / 30));
    
    // Asumimos un ángulo natural de sostenimiento del teléfono de unos 45 grados en beta
    const deltaY = Math.max(-1, Math.min(1, (beta - 45) / 30));

    moveLayers(deltaX, deltaY);
  }
});