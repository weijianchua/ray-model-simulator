const canvas = document.getElementById('simulationCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 400;

const lightSource = { x: 100, y: 200 };
let rayType = 'single';
let surfaceType = 'smooth';

document.getElementById('ray-type').addEventListener('change', (e) => {
    rayType = e.target.value;
    drawScene();
});

document.getElementById('surface-type').addEventListener('change', (e) => {
    surfaceType = e.target.value;
    drawScene();
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    lightSource.x = e.clientX - rect.left;
    lightSource.y = e.clientY - rect.top;
    drawScene();
});

function drawScene() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSurface();
    drawLightRays();
}

function drawSurface() {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 300);
    ctx.lineTo(canvas.width, 300);
    ctx.stroke();

    if (surfaceType === 'rough') {
        for (let i = 0; i < canvas.width; i += 10) {
            const offset = Math.random() * 10 - 5;
            ctx.beginPath();
            ctx.moveTo(i, 300);
            ctx.lineTo(i, 300 + offset);
            ctx.stroke();
        }
    }
}

function drawLightRays() {
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 2;

    if (rayType === 'single') {
        drawRay(lightSource.x, lightSource.y, 300, surfaceType);
    } else if (rayType === 'beam') {
        drawRay(lightSource.x - 10, lightSource.y, 300, surfaceType);
        drawRay(lightSource.x, lightSource.y, 300, surfaceType);
        drawRay(lightSource.x + 10, lightSource.y, 300, surfaceType);
    }
}

function drawRay(startX, startY, surfaceY, surfaceType) {
    const angleOfIncidence = Math.atan2(surfaceY - startY, 300 - startX);
    const reflectionAngle = surfaceType === 'smooth' ? angleOfIncidence : Math.random() * Math.PI / 4;

    const reflectedX = startX + 300 * Math.cos(reflectionAngle);
    const reflectedY = surfaceY - 300 * Math.sin(reflectionAngle);

    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(startX + 300, surfaceY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(startX + 300, surfaceY);
    ctx.lineTo(reflectedX, reflectedY);
    ctx.stroke();
}

drawScene();
