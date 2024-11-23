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
        for (let i = 0; i < canvas.width; i += 20) {
            const offset = Math.sin(i / 10) * 10;
            ctx.beginPath();
            ctx.arc(i, 300 + offset, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}

function drawLightRays() {
    ctx.strokeStyle = 'black';
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
    const angleOfReflection = surfaceType === 'smooth' ? angleOfIncidence : Math.random() * Math.PI / 4;

    const reflectedX = startX + 300 * Math.cos(angleOfReflection);
    const reflectedY = surfaceY - 300 * Math.sin(angleOfReflection);

    // Draw incident ray
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(300, surfaceY);
    ctx.stroke();

    // Add arrow
    drawArrow((startX + 300) / 2, (startY + surfaceY) / 2);

    // Draw reflected ray
    ctx.beginPath();
    ctx.moveTo(300, surfaceY);
    ctx.lineTo(reflectedX, reflectedY);
    ctx.stroke();

    // Add arrow
    drawArrow((300 + reflectedX) / 2, (surfaceY + reflectedY) / 2);

    // Draw normal
    drawNormal(300, surfaceY);

    // Calculate and display angles
    displayAngles(angleOfIncidence, angleOfReflection);
}

function drawArrow(x, y) {
    ctx.beginPath();
    ctx.moveTo(x - 5, y - 5);
    ctx.lineTo(x, y);
    ctx.lineTo(x - 5, y + 5);
    ctx.stroke();
}

function drawNormal(x, y) {
    ctx.setLineDash([5, 5]);
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y - 150);
    ctx.stroke();
    ctx.setLineDash([]);
}

function displayAngles(incidence, reflection) {
    const incidenceDeg = Math.abs((incidence * 180) / Math.PI).toFixed(1);
    const reflectionDeg = Math.abs((reflection * 180) / Math.PI).toFixed(1);

    document.getElementById('angle-incidence').textContent = incidenceDeg;
    document.getElementById('angle-reflection').textContent = reflectionDeg;
}

drawScene();
