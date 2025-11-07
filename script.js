const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let circulos = [];
let animacaoAtiva = true;
let velocidadeMultiplicador = 1;

// 🔹 Redimensiona o canvas automaticamente conforme a tela
function redimensionarCanvas() {
  canvas.width = Math.min(window.innerWidth * 0.9, 1000);
  canvas.height = window.innerHeight * 0.6;
}
window.addEventListener('resize', redimensionarCanvas);
redimensionarCanvas();

// 🔹 Classe Circulo (objeto animado)
class Circulo {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.raio = Math.random() * 20 + 15;
    this.velX = (Math.random() - 0.5) * 4;
    this.velY = (Math.random() - 0.5) * 4;
    this.cor = this.gerarCorAleatoria();
    this.timerCor = 0;
  }

  gerarCorAleatoria() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r},${g},${b})`;
  }

  desenhar() {
    ctx.shadowBlur = 20;
    ctx.shadowColor = this.cor;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.raio, 0, Math.PI * 2);
    ctx.fillStyle = this.cor;
    ctx.fill();

    // efeito de brilho interno
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.raio * 0.6, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fill();

    ctx.shadowBlur = 0;
  }

  atualizar() {
    this.x += this.velX * velocidadeMultiplicador;
    this.y += this.velY * velocidadeMultiplicador;

    if (this.x + this.raio > canvas.width || this.x - this.raio < 0) {
      this.velX *= -1;
      this.mudarCor();
    }

    if (this.y + this.raio > canvas.height || this.y - this.raio < 0) {
      this.velY *= -1;
      this.mudarCor();
    }

    if (++this.timerCor > 180) {
      this.mudarCor();
      this.timerCor = 0;
    }
  }

  mudarCor() {
    this.cor = this.gerarCorAleatoria();
  }
}

// 🔹 Inicializa círculos aleatórios
function inicializarCirculos(qtd) {
  circulos = [];
  for (let i = 0; i < qtd; i++) {
    const x = Math.random() * (canvas.width - 60) + 30;
    const y = Math.random() * (canvas.height - 60) + 30;
    circulos.push(new Circulo(x, y));
  }
  atualizarContador();
}

// 🔹 Loop principal
function animar() {
  if (animacaoAtiva) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    circulos.forEach((c) => {
      c.atualizar();
      c.desenhar();
    });
  }
  requestAnimationFrame(animar);
}

// 🔹 Controles
function adicionarCirculo() {
  const x = Math.random() * canvas.width;
  const y = Math.random() * canvas.height;
  circulos.push(new Circulo(x, y));
  atualizarContador();
}

function limparCanvas() {
  circulos = [];
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  atualizarContador();
}

function alternarPausa() {
  animacaoAtiva = !animacaoAtiva;
}

function mudarVelocidade() {
  velocidadeMultiplicador =
    velocidadeMultiplicador === 1 ? 2 : velocidadeMultiplicador === 2 ? 0.5 : 1;
  const velocidades = { 1: 'Normal', 2: 'Rápida', 0.5: 'Lenta' };
  alert(`Velocidade alterada para: ${velocidades[velocidadeMultiplicador]}`);
}

function atualizarContador() {
  document.getElementById('contador').textContent = circulos.length;
}

// 🔹 Clique e toque
function adicionarCirculoToque(evento) {
  evento.preventDefault();
  const rect = canvas.getBoundingClientRect();
  const x = (evento.touches ? evento.touches[0].clientX : evento.clientX) - rect.left;
  const y = (evento.touches ? evento.touches[0].clientY : evento.clientY) - rect.top;
  circulos.push(new Circulo(x, y));
  atualizarContador();
}

canvas.addEventListener('click', adicionarCirculoToque);
canvas.addEventListener('touchstart', adicionarCirculoToque);

// 🔹 Botões
document.getElementById('btnAdd').onclick = adicionarCirculo;
document.getElementById('btnClear').onclick = limparCanvas;
document.getElementById('btnPause').onclick = alternarPausa;
document.getElementById('btnSpeed').onclick = mudarVelocidade;

// 🔹 Inicialização
inicializarCirculos(window.innerWidth < 600 ? 3 : 5);
animar();
