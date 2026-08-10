// ==========================================
// CÍRCULO: MULTITOUCH (SOSTENER Y ARRASTRAR)
// ==========================================
function startCirculoMultitouch() {
    let cx = mainCanvas.width / 2;
    let cy = mainCanvas.height / 2;

    // Colores base
    let colors = [
        { name: 'violet', r: 200, g: 162, b: 255 },
        { name: 'green', r: 150, g: 230, b: 150 }
    ];

    // Asignamos los bordes de manera aleatoria al iniciar
    let shuffledColors = Math.random() > 0.5 ? [colors[0], colors[1]] : [colors[1], colors[0]];

    // Contenedores (Círculos vacíos con borde de color)
    let containers = [
        { x: cx - 65, y: cy - 40, radius: 55, color: shuffledColors[0], isPressed: false, touchId: null },
        { x: cx + 65, y: cy - 40, radius: 55, color: shuffledColors[1], isPressed: false, touchId: null }
    ];

    // Bolitas (Orbes)
    let orbs = [
        { id: 1, startX: cx - 45, startY: cy + 90, x: cx - 45, y: cy + 90, radius: 18, color: colors[0], isDragging: false, touchId: null, state: 'idle' },
        { id: 2, startX: cx + 45, startY: cy + 90, x: cx + 45, y: cy + 90, radius: 18, color: colors[1], isDragging: false, touchId: null, state: 'idle' }
    ];

    // Función auxiliar para obtener posición relativa en el Canvas
    function getCanvasPos(touch) {
        const rect = mainCanvas.getBoundingClientRect();
        return {
            x: (touch.clientX - rect.left) * (mainCanvas.width / rect.width),
            y: (touch.clientY - rect.top) * (mainCanvas.height / rect.height)
        };
    }

    function onTouchStart(e) {
        // Iteramos sobre todos los dedos que acaban de tocar la pantalla
        for (let i = 0; i < e.changedTouches.length; i++) {
            let touch = e.changedTouches[i];
            let pos = getCanvasPos(touch);

            // 1. Verificamos si tocamos un contenedor (para sostenerlo)
            containers.forEach(c => {
                if (Math.hypot(pos.x - c.x, pos.y - c.y) < c.radius) {
                    c.isPressed = true;
                    c.touchId = touch.identifier; // Guardamos qué dedo lo está apretando
                }
            });

            // 2. Verificamos si tocamos una bolita (para arrastrarla)
            orbs.forEach(o => {
                if (Math.hypot(pos.x - o.x, pos.y - o.y) < o.radius * 3 && o.state !== 'accepted') {
                    o.isDragging = true;
                    o.touchId = touch.identifier;
                    o.state = 'idle';
                }
            });
        }
    }

    function onTouchMove(e) {
        // Actualizamos posiciones según el dedo que se mueve
        for (let i = 0; i < e.changedTouches.length; i++) {
            let touch = e.changedTouches[i];
            let pos = getCanvasPos(touch);

            // Mover bolita si este dedo la está arrastrando
            orbs.forEach(o => {
                if (o.isDragging && o.touchId === touch.identifier) {
                    o.x = pos.x;
                    o.y = pos.y;
                }
            });

            // Opcional: Si el dedo se resbala fuera del contenedor, lo "des-presionamos"
            containers.forEach(c => {
                if (c.touchId === touch.identifier) {
                    if (Math.hypot(pos.x - c.x, pos.y - c.y) > c.radius * 1.5) {
                        c.isPressed = false;
                        c.touchId = null;
                    } else {
                        c.isPressed = true;
                    }
                }
            });
        }
    }

    function onTouchEnd(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            let touch = e.changedTouches[i];

            // 1. Si soltamos un contenedor
            containers.forEach(c => {
                if (c.touchId === touch.identifier) {
                    c.isPressed = false;
                    c.touchId = null;
                }
            });

            // 2. Si soltamos una bolita
            orbs.forEach(o => {
                if (o.isDragging && o.touchId === touch.identifier) {
                    o.isDragging = false;
                    o.touchId = null;

                    // Verificamos si cayó dentro de algún contenedor
                    let droppedInContainer = null;
                    containers.forEach(c => {
                        if (Math.hypot(o.x - c.x, o.y - c.y) < c.radius) {
                            droppedInContainer = c;
                        }
                    });

                    if (droppedInContainer) {
                        // LA MAGIA: Para que sea exitoso, el contenedor DEBE estar presionado Y los colores deben coincidir
                        if (droppedInContainer.isPressed && droppedInContainer.color.name === o.color.name) {
                            o.state = 'accepted';
                            o.targetC = droppedInContainer;
                        } else {
                            // Si no coincide o si no estaba manteniendo presionado el contenedor, rebota
                            o.state = 'bouncing';
                        }
                    } else {
                        o.state = 'bouncing'; // La soltó en la nada
                    }
                }
            });
        }
    }

    // Asignamos los eventos de Touch (fundamental prevenir el default para que la pantalla no haga scroll)
    mainCanvas.ontouchstart = (e) => { e.preventDefault(); onTouchStart(e); };
    mainCanvas.ontouchmove = (e) => { e.preventDefault(); onTouchMove(e); };
    mainCanvas.ontouchend = (e) => { e.preventDefault(); onTouchEnd(e); };
    mainCanvas.ontouchcancel = (e) => { e.preventDefault(); onTouchEnd(e); };

    // Limpiamos los eventos de mouse porque esta lógica es estrictamente multitouch
    mainCanvas.onmousedown = null; mainCanvas.onmousemove = null; mainCanvas.onmouseup = null;

    function animate() {
        animation = requestAnimationFrame(animate);
        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

        // Dibujamos los contenedores
        containers.forEach(c => {
            mainCtx.beginPath();
            mainCtx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
            
            let colorStr = `rgba(${c.color.r}, ${c.color.g}, ${c.color.b}, 1)`;
            
            // Feedback visual: Si lo están apretando, se pinta con baja opacidad
            if (c.isPressed) {
                mainCtx.fillStyle = `rgba(${c.color.r}, ${c.color.g}, ${c.color.b}, 0.2)`;
                mainCtx.fill();
                mainCtx.lineWidth = 4;
            } else {
                mainCtx.lineWidth = 2;
            }
            
            mainCtx.strokeStyle = colorStr;
            mainCtx.stroke();
        });

        // Dibujamos y animamos las bolitas
        orbs.forEach(o => {
            if (o.state === 'bouncing') {
                o.x += (o.startX - o.x) * 0.15;
                o.y += (o.startY - o.y) * 0.15;
                if (Math.hypot(o.x - o.startX, o.y - o.startY) < 1) o.state = 'idle';
                
            } else if (o.state === 'accepted') {
                o.x += (o.targetC.x - o.x) * 0.15;
                o.y += (o.targetC.y - o.y) * 0.15;
                
                // Crece un poco al encajar
                o.radius += (o.targetC.radius * 0.6 - o.radius) * 0.1; 
            }

            // Usamos tu función para dibujar la bolita
            drawGradientCircle(mainCtx, o.x, o.y, o.radius, o.color.r, o.color.g, o.color.b, 1);
        });
    }
    
    animate();
}

// 2


// ==========================================
// CÍRCULO 2: ORDENAR (ALINEADOS HORIZONTAL Y LADO A LADO)
// ==========================================
function startCirculo2() {
    let containers = [];
    let orbs = [];
    let isDragging = null;
    let time = 0;

    function initGame() {
        containers = [];
        orbs = [];
        
        // Alineación Horizontal con separación calculada
        let startX = mainCanvas.width * 0.15; 
        let spacingX = (mainCanvas.width * 0.7) / 4; 
        let cy = mainCanvas.height / 2;

        for (let i = 0; i < 5; i++) {
            containers.push({ x: startX + (i * spacingX), y: cy, radius: 28 });
        }

        const initialSetup = [ ['C', 'C', 'V', 'V'], [], [], ['C', 'C', 'V'], ['C', 'V', 'V'] ];

        initialSetup.forEach((contents, index) => {
            contents.forEach(type => {
                orbs.push({ type: type, x: containers[index].x, y: containers[index].y, currentContainer: index, radius: 8 });
            });
        });
    }

    initGame();

    // ... (Tu misma lógica de onStart, onMove, onEnd) ...
    function getPointerPos(e) { /* Igual que antes */ 
        const rect = mainCanvas.getBoundingClientRect();
        let cx = e.touches ? e.touches[0].clientX : e.clientX;
        let cy = e.touches ? e.touches[0].clientY : e.clientY;
        return { x: (cx - rect.left) * (mainCanvas.width / rect.width), y: (cy - rect.top) * (mainCanvas.height / rect.height) };
    }

    function onStart(e) {
        let pos = getPointerPos(e);
        for (let i = orbs.length - 1; i >= 0; i--) {
            let o = orbs[i];
            if (Math.hypot(pos.x - o.x, pos.y - o.y) < o.radius * 3) { isDragging = o; break; }
        }
    }

    function onMove(e) { if (isDragging) { let pos = getPointerPos(e); isDragging.x = pos.x; isDragging.y = pos.y; } }

    function onEnd() {
        if (!isDragging) return;
        let closest = -1; let minDist = Infinity;
        containers.forEach((c, index) => {
            let dist = Math.hypot(isDragging.x - c.x, isDragging.y - c.y);
            if (dist < c.radius + 15 && dist < minDist) { minDist = dist; closest = index; }
        });
        if (closest !== -1) isDragging.currentContainer = closest;
        isDragging = null;
        
        let allValid = true;
        for (let i = 0; i < 5; i++) {
            if (orbs.filter(o => o.currentContainer === i).length !== 2) { allValid = false; break; }
        }
        if (allValid) setTimeout(initGame, 1000); 
    }

    mainCanvas.onmousedown = onStart; mainCanvas.onmousemove = onMove; mainCanvas.onmouseup = onEnd;
    mainCanvas.ontouchstart = (e) => { e.preventDefault(); onStart(e); };
    mainCanvas.ontouchmove = (e) => { e.preventDefault(); onMove(e); };
    mainCanvas.ontouchend = onEnd;

    function animate() {
        animation = requestAnimationFrame(animate);
        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        time += 0.05;

        containers.forEach(c => drawGradientCircle(mainCtx, c.x, c.y, c.radius, 200, 160, 255, 1));

        containers.forEach((c, index) => {
            let inThis = orbs.filter(o => o.currentContainer === index);
            
            // Animación de tirón (indicador visual) en el primer contenedor
            let isHinting = (index === 0 && !isDragging && inThis.length > 2);

            inThis.forEach((o, i) => {
                let targetX = c.x;
                let targetY = c.y;

                // Acomodarlos lado a lado según cuántos haya
                if(inThis.length === 1) { targetX = c.x; targetY = c.y; }
                else if(inThis.length === 2) { targetX = c.x + (i===0 ? -10 : 10); targetY = c.y; }
                else if(inThis.length === 3) { targetX = c.x + (i===0 ? -10 : i===1 ? 10 : 0); targetY = c.y + (i===2 ? 10 : -10); }
                else if(inThis.length >= 4) { targetX = c.x + (i%2===0 ? -10 : 10); targetY = c.y + (i<2 ? -10 : 10); }

                // Aplicar el tirón al objetivo para dar pistas al jugador
                if (isHinting && i >= 2) { targetX += Math.abs(Math.sin(time)) * 20; } 

                if (isDragging !== o) {
                    o.x += (targetX - o.x) * 0.2;
                    o.y += (targetY - o.y) * 0.2;
                }

                // Dibujar con los colores correctos (Celeste y Verde)
                if (o.type === 'C') drawGradientCircle(mainCtx, o.x, o.y, o.radius, 100, 200, 255, 1);
                else drawGradientCircle(mainCtx, o.x, o.y, o.radius, 150, 230, 150, 1);
            });
        });
    }
    animate();
}
// 
function startCirculo3() {
    let cx = mainCanvas.width / 2 + 20;
    
   
    let c1 = { x: cx, y: mainCanvas.height / 2, radius: 35 };
    let c2 = { x: cx, y: mainCanvas.height / 2, radius: 35 };

    let targetY = mainCanvas.height * 0.75; 
    let targetBrightness = 0.2;
    let brightness = 0.2;

    function handleMultiTouch(e) {
        if (e.touches.length >= 2) {
            const rect = mainCanvas.getBoundingClientRect();
            let y1 = (e.touches[0].clientY - rect.top);
            let y2 = (e.touches[1].clientY - rect.top);
            let x1 = (e.touches[0].clientX - rect.left);
            let x2 = (e.touches[1].clientX - rect.left);

            targetBrightness = Math.max(0.2, 1 - ((y1 + y2) / 2 / mainCanvas.height));
            
            let distX = Math.abs(x1 - x2);
            c1.radius = 35 + Math.max(0, (200 - distX) * 0.3); 
            c2.radius = c1.radius;

            c1.x = x1; c1.y = y1;
            c2.x = x2; c2.y = y2;
        } else {
            targetBrightness = 0.2;
            c1.radius = 35; c2.radius = 35;
        }
    }

    mainCanvas.ontouchmove = (e) => { e.preventDefault(); handleMultiTouch(e); };
    mainCanvas.ontouchstart = (e) => { e.preventDefault(); handleMultiTouch(e); };
    mainCanvas.ontouchend = handleMultiTouch;

    function animate() {
        animation = requestAnimationFrame(animate);
        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

        brightness += (targetBrightness - brightness) * 0.1;

     
        if(c1.y < targetY) {
            c1.y += 5;
            c2.y += 5;
            c1.x += (cx - 40 - c1.x) * 0.1; 
            c2.x += (cx + 40 - c2.x) * 0.1;
        }

        drawGradientCircle(mainCtx, c1.x, c1.y, c1.radius, 200, 160, 255, brightness);
        drawGradientCircle(mainCtx, c2.x, c2.y, c2.radius, 200, 160, 255, brightness);
    }
    animate();
}
