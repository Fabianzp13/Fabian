var gravedad = 0.5;
var numHijos = 50;

var numParticulas = 100;
var particulasCreadas = 0;
var tiempoTotal = 300000; // 5 minutos

function crearParticula() {
  var particula = document.createElement("div");
  particula.className = "particula";

  var x, y;

  // Generar posiciones aleatorias a lo largo de los bordes superior, izquierdo y derecho
  var posicion = Math.random();
  if (posicion < 0.33) {
    // A lo largo del borde superior
    x = Math.random() * window.innerWidth;
    y = 0;
  } else if (posicion < 0.66) {
    // A lo largo del borde izquierdo
    x = 0;
    y = Math.random() * window.innerHeight;
  } else {
    // A lo largo del borde derecho
    x = window.innerWidth;
    y = Math.random() * window.innerHeight;
  }

  particula.style.top = y + "px";
  particula.style.left = x + "px";

  var velocidadY = -15 - Math.random() * 15;

  particula.setAttribute("data-velocidad-y", velocidadY);
  particula.setAttribute("data-velocidad-x", "0");
  particula.setAttribute("data-padre", "true");

  particula.style.background = getRandomColor();

  document.getElementsByTagName("body")[0].append(particula);

  particulasCreadas++;

  if (particulasCreadas < numParticulas && tiempoTotal > 0) {
    setTimeout(crearParticula, 50 + Math.random() * 150);
    tiempoTotal -= 50 + Math.random() * 150;
  }
}

function start() {
  crearParticula();
}

function update() {
  var tiempoInicio = new Date().getTime();

  function loop() {
    var tiempoActual = new Date().getTime();
    var deltaTiempo = tiempoActual - tiempoInicio;

    if (deltaTiempo >= tiempoTotal) {
      return; // Terminar cuando hayan pasado los 5 minutos
    }

    var particulas = document.getElementsByClassName("particula");
    for (var p = 0; p < particulas.length; p++) {
      var particula = particulas[p];

      var velocidadY = parseFloat(particula.getAttribute("data-velocidad-y"));
      velocidadY += gravedad;

      particula.setAttribute("data-velocidad-y", velocidadY);

      var top = particula.style.top ? particula.style.top : "0";
      top = parseFloat(top.replace("px", ""));
      top += velocidadY;
      particula.style.top = top + "px";

      var velocidadX = parseFloat(particula.getAttribute("data-velocidad-x"));

      var left = particula.style.left ? particula.style.left : "0";
      left = parseFloat(left.replace("px", ""));
      left += velocidadX;
      particula.style.left = left + "px";

      var padre = particula.getAttribute("data-padre");

      if (velocidadY >= 0 && padre === "true") {
        explotar(particula);
      }

      if (top > window.innerHeight) {
        particula.remove();
      }
    }

    requestAnimationFrame(loop);
  }

  loop();
}

function explotar(particula) {
  for (var h = 0; h < numHijos; h++) {
    var hijo = document.createElement("div");
    hijo.className = "particula";

    hijo.style.top = particula.style.top;
    hijo.style.left = particula.style.left;
    hijo.style.background = particula.style.background;

    var velocidadY = Math.random() * 20 - 18;
    hijo.setAttribute("data-velocidad-y", velocidadY);
    var velocidadX = Math.random() * 16 - 8;
    hijo.setAttribute("data-velocidad-x", velocidadX);

    hijo.setAttribute("data-padre", false);

    document.getElementsByTagName("body")[0].append(hijo);
  }

  particula.remove();
}

window.onload = function () {
  start();
  setTimeout(function () {
    tiempoTotal = 0; // Detener la creación de partículas después de 5 minutos
  }, tiempoTotal);
  update();
};

// Utilerias
function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}