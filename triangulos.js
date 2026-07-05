
// 1

function startTriangulo1() {
    let cx = mainCanvas.width / 2 + 20;
    let cy = mainCanvas.height / 2;
    let opacity = 0.2;

    function handleMotion(event) {
        let acc = event.accelerationIncludingGravity;
        if (!acc) return;
        
        let force = Math.abs(acc.x) + Math.abs(acc.y) + Math.abs(acc.z);
        if (force > 18) { // Sacudida fuerte detectada
            opacity += 0.1;
            if (opacity >= 1) {
                // Loop de bajada
                setTimeout(() => opacity = 0.2, 600);
            }
        }
    }

    window.addEventListener('devicemotion', handleMotion, true);

    // Limpieza especial para sensores
    let oldStop = stopCurrentAnimation;
    stopCurrentAnimation = function() {
        window.removeEventListener('devicemotion', handleMotion, true);
        oldStop();
    };

    function animate() {
        animation = requestAnimationFrame(animate);
        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        
        // La opacidad va bajando lentamente si no sacuden
        if(opacity > 0.2) opacity -= 0.005;

        drawGradientTriangle(mainCtx, cx, cy, 70, 255, 0, 0, opacity);
    }
    animate();
}


//  2

function startTriangulo2() {
    let cx = mainCanvas.width / 2 + 20;
    let cy = mainCanvas.height / 2;
    
    let triX = cx;
    let triY = cy;
    let sensitivity = 1;
    let fails = 0;
    let bgColors = ["#ffffff", "#ffe6e6", "#ffcccc", "#ff9999"];

    // Aumenta la dificultad (sensibilidad) cada 10 segundos
    let difficultyInterval = setInterval(() => sensitivity += 0.8, 10000);

    function handleOrientation(event) {
        let beta = event.beta;  // Inclinación Adelante/Atrás
        let gamma = event.gamma; // Inclinación Izquierda/Derecha
        
        if (beta === null || gamma === null) return;

        triX += gamma * sensitivity * 0.15;
        triY += beta * sensitivity * 0.15;

        // Comprobar si se salió del centro (Balance perdido)
        let distance = Math.hypot(triX - cx, triY - cy);
        if (distance > mainCanvas.height * 0.4) {
            fails++;
            triX = cx; triY = cy; // Reinicia
            sensitivity = 1; // Resetea dificultad
        }
    }

    window.addEventListener('deviceorientation', handleOrientation, true);

    let oldStop = stopCurrentAnimation;
    stopCurrentAnimation = function() {
        window.removeEventListener('deviceorientation', handleOrientation, true);
        clearInterval(difficultyInterval);
        oldStop();
    };

    function animate() {
        animation = requestAnimationFrame(animate);
        
        // Cambiar fondo si falla
        let currentBg = bgColors[Math.min(fails, bgColors.length - 1)];
        mainCtx.fillStyle = currentBg;
        mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

        // Retorno elástico constante al centro (simula que es resbaladizo)
        triX += (cx - triX) * 0.02;
        triY += (cy - triY) * 0.02;

        drawGradientTriangle(mainCtx, triX, triY, 70, 255, 0, 0, 1);
    }
    animate();
}

function startTriangulo3() {

    let gravityX = 0;
    let gravityY = 0;
    let successCount = 0;
    let gameOverTimeout = null;


    let targets = [
        { x: mainCanvas.width * 0.25, y: mainCanvas.height * 0.3, size: 60, angle: 0, matched: false, glow: 0 },
        { x: mainCanvas.width * 0.75, y: mainCanvas.height * 0.4, size: 60, angle: Math.PI * 2 / 3, matched: false, glow: 0 },
        { x: mainCanvas.width * 0.5,  y: mainCanvas.height * 0.7, size: 60, angle: Math.PI * 4 / 3, matched: false, glow: 0 }
    ];

    let pieces = targets.map((t, index) => ({
        x: Math.random() * (mainCanvas.width - 100) + 50,
        y: Math.random() * (mainCanvas.height - 100) + 50,
        vx: 0,
        vy: 0,
        size: 58, 
        angle: t.angle, 
        targetIndex: index
    }));

   
    function handleOrientation(event) {
   
        gravityX = event.gamma * 0.15; 
        gravityY = event.beta * 0.15;
    }
    
    window.addEventListener('deviceorientation', handleOrientation);

  
    let keys = {};
    window.onkeydown = (e) => keys[e.key] = true;
    window.onkeyup = (e) => keys[e.key] = false;

    function drawTriangle(ctx, x, y, size, angle, color) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.beginPath();
    
        ctx.moveTo(0, -size / Math.sqrt(3));
        ctx.lineTo(-size / 2, size / (2 * Math.sqrt(3)));
        ctx.lineTo(size / 2, size / (2 * Math.sqrt(3)));
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
        ctx.restore();
    }

    function animate() {
        animation = requestAnimationFrame(animate);
        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

        // Fallback de teclado si no hay acelerómetro activo
        if (keys["ArrowLeft"]) gravityX = -5;
        if (keys["ArrowRight"]) gravityX = 5;
        if (keys["ArrowUp"]) gravityY = -5;
        if (keys["ArrowDown"]) gravityY = 5;
        if (!keys["ArrowLeft"] && !keys["ArrowRight"] && !keys["ArrowUp"] && !keys["ArrowDown"] && gravityX === 0 && gravityY === 0) {
            gravityX = 0; gravityY = 0;
        }

        // 1. Dibujar Huecos Grises (Targets)
        targets.forEach(t => {
            let color = `rgb(${100 + t.glow * 155}, ${100 + t.glow * 155}, ${100 + t.glow * 155})`;
            drawTriangle(mainCtx, t.x, t.y, t.size, t.angle, t.matched ? color : "#555555");
            
            // Reducir el brillo paulatinamente si ya se iluminó
            if (t.glow > 0) t.glow -= 0.02;
        });

        // 2. Actualizar y Dibujar Piezas Rojas
        successCount = 0;
        pieces.forEach(p => {
            let t = targets[p.targetIndex];

            if (!t.matched) {
                // Aplicar aceleración por inclinación (van rápido)
                p.vx += gravityX * 0.4;
                p.vy += gravityY * 0.4;
                
                // Fricción para que no se descontrolen infinitamente
                p.vx *= 0.85;
                p.vy *= 0.85;

                p.x += p.vx;
                p.y += p.vy;

                // Límites de la pantalla (Bounce simple)
                if (p.x < 0 || p.x > mainCanvas.width) p.vx *= -0.5;
                if (p.y < 0 || p.y > mainCanvas.height) p.vy *= -0.5;
                p.x = Math.max(0, Math.min(mainCanvas.width, p.x));
                p.y = Math.max(0, Math.min(mainCanvas.height, p.y));

                // Detección de encaje (Distancia corta entre centros)
                let dist = Math.hypot(p.x - t.x, p.y - t.y);
                if (dist < 12) { 
                    t.matched = true;
                    t.glow = 1.0; // Activa iluminación máxima
                    p.x = t.x; // Clavar en su lugar exacto
                    p.y = t.y;
                }
            }

            // Dibujar la pieza roja si no está totalmente encajada o si brilla
            if (!t.matched) {
                drawTriangle(mainCtx, p.x, p.y, p.size, p.angle, "#FF0000");
            } else {
                successCount++;
            }
        });

        // 3. Condición de Victoria Anticlímax (Todos encajados)
        if (successCount === targets.length && !gameOverTimeout) {
            // Espera 1.5 segundos iluminados creando expectativa, y destruye la escena volviendo al menú
            gameOverTimeout = setTimeout(() => {
                window.removeEventListener('deviceorientation', handleOrientation);
                cancelAnimationFrame(animation);
                
                // Lógica para cerrar el overlay/volver al menú
                const overlay = document.getElementById("overlay");
                if (overlay) overlay.style.display = "none"; 
                
                alert("Fin del sistema. Volviendo al menú."); // Remueve o cambia por tu función de cierre
            }, 1500);
        }
    }

    animate();
}
