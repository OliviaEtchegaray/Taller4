
function startTriangulo1() { }


function startTriangulo2() {
    let gravityX = 0;
    let gravityY = 0;
    let gameTime = 0;
    let gameOverTimeout = null;
    
    // Contador de tiempo que el usuario logra mantener el celular recto
    let quietTimer = 0; 
    const TIME_TO_SURVIVE = 360; // 360 frames equivalen a unos 6 segundos a 60fps

    // Creamos MAS triángulos y MAS GRANDES (ej. 8 triángulos de tamaño 100)
    let pieces = [];
    const totalPieces = 8;

    for (let i = 0; i < totalPieces; i++) {
        pieces.push({
            // Posiciones iniciales esparcidas
            x: mainCanvas.width * 0.1 + Math.random() * (mainCanvas.width * 0.8),
            y: mainCanvas.height * 0.1 + Math.random() * (mainCanvas.height * 0.8),
            vx: 0,
            vy: 0,
            size: 100, // <-- ¡Más grandes! (Antes eran de 58)
            angle: Math.random() * Math.PI * 2, // Orientaciones variadas
            baseAngle: Math.random() * Math.PI * 2
        });
    }

    // --- DETECTAR BALANCEO EXAGERADO ---
    function handleOrientation(event) {
        let tolerance = 0.5; // Margen estricto de pulso recto
        let rawX = event.gamma || 0;
        let rawY = event.beta || 0;

        // Si se pasa de la tolerancia, se multiplica el movimiento salvajemente
        gravityX = Math.abs(rawX) > tolerance ? rawX * 4.5 : 0;
        gravityY = Math.abs(rawY) > tolerance ? rawY * 4.5 : 0;
    }
    
    window.addEventListener('deviceorientation', handleOrientation);

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
        
        // Fondo blanco limpio
        mainCtx.fillStyle = "#FFFFFF";
        mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

        gameTime += 0.25; // Para la velocidad del bamboleo/vibración

        // Verificar si el dispositivo está perfectamente quieto y recto
        let isQuiet = (gravityX === 0 && gravityY === 0);

        if (isQuiet) {
            quietTimer++; // Suma tiempo de supervivencia
        } else {
            quietTimer = Math.max(0, quietTimer - 2); // Si se mueve, castiga bajando el contador rápido
        }

        pieces.forEach((p, index) => {
            // Físicas extremas si hay balanceo
            p.vx += gravityX * 0.6;
            p.vy += gravityY * 0.6;
            
            // Fricción baja para que patinen un montón
            p.vx *= 0.93;
            p.vy *= 0.93;

            p.x += p.vx;
            p.y += p.vy;

            // --- ANIMACIÓN DE INDICACIÓN (Bamboleo/Vibración constante en el lugar) ---
            // Solo se aplica con fuerza real cuando el celular está quieto.
            let vibX = isQuiet ? Math.sin(gameTime * 2 + index) * 3 : 0;
            let vibY = isQuiet ? Math.cos(gameTime * 1.5 - index) * 3 : 0;
            let rotBamboleo = isQuiet ? Math.sin(gameTime * 0.7 + index) * 0.2 : 0;

            // Límites de pantalla con rebote duro e inestable
            if (p.x < 0 || p.x > mainCanvas.width) p.vx *= -0.9;
            if (p.y < 0 || p.y > mainCanvas.height) p.vy *= -0.9;
            
            p.x = Math.max(0, Math.min(mainCanvas.width, p.x));
            p.y = Math.max(0, Math.min(mainCanvas.height, p.y));

            // Dibujar los triángulos gigantes rojos con su respectiva vibración
            drawTriangle(mainCtx, p.x + vibX, p.y + vibY, p.size, p.angle + rotBamboleo, "#FF0000");
        });

        // --- CONDICIÓN DE LOGRO ANTICLÍMAX ---
        // Si aguantó el tiempo requerido sin moverlo exageradamente:
        if (quietTimer >= TIME_TO_SURVIVE && !gameOverTimeout) {
            
            // Generamos un destello blanco que ocupa toda la pantalla para dar la falsa expectativa
            mainCtx.fillStyle = "rgba(255, 255, 255, 0.9)";
            mainCtx.fillRect(0, 0, mainCanvas.width, mainCanvas.height);

            gameOverTimeout = setTimeout(() => {
                window.removeEventListener('deviceorientation', handleOrientation);
                cancelAnimationFrame(animation);
                
                // Cierra el juego de golpe y vuelve a la grilla
                const overlay = document.getElementById("overlay");
                if (overlay) overlay.style.display = "none";
            }, 1000); // 1 segundo de destello expectante
        }
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