// ==========================================
// CÍRCULO 1: MULTITOUCH (SOSTENER Y ARRASTRAR)
// ==========================================
function startCirculo1() {
    let cx = mainCanvas.width / 2;
    let cy = mainCanvas.height / 2;

    let colors = [
        { name: 'violet', r: 200, g: 162, b: 255 },
        { name: 'green', r: 150, g: 230, b: 150 } // Se usa verde como solicitaste, aunque la ref sea amarilla
    ];

    let shuffledColors = Math.random() > 0.5 ? [colors[0], colors[1]] : [colors[1], colors[0]];

    // Posiciones basadas en la estética de la imagen
    let containers = [
        { x: cx - 80, y: cy - 20, radius: 65, color: shuffledColors[0], isPressed: false, touchId: null },
        { x: cx + 70, y: cy - 60, radius: 65, color: shuffledColors[1], isPressed: false, touchId: null }
    ];

    let orbs = [
        { id: 1, startX: cx - 20, startY: cy + 90, x: cx - 20, y: cy + 90, radius: 18, color: colors[1], isDragging: false, touchId: null, state: 'idle' },
        { id: 2, startX: cx + 80, startY: cy + 70, x: cx + 80, y: cy + 70, radius: 18, color: colors[0], isDragging: false, touchId: null, state: 'idle' }
    ];

    function getCanvasPos(touch) {
        const rect = mainCanvas.getBoundingClientRect();
        return {
            x: (touch.clientX - rect.left) * (mainCanvas.width / rect.width),
            y: (touch.clientY - rect.top) * (mainCanvas.height / rect.height)
        };
    }

    function onTouchStart(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            let touch = e.changedTouches[i];
            let pos = getCanvasPos(touch);

            containers.forEach(c => {
                if (Math.hypot(pos.x - c.x, pos.y - c.y) < c.radius) {
                    c.isPressed = true;
                    c.touchId = touch.identifier;
                }
            });

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
        for (let i = 0; i < e.changedTouches.length; i++) {
            let touch = e.changedTouches[i];
            let pos = getCanvasPos(touch);

            orbs.forEach(o => {
                if (o.isDragging && o.touchId === touch.identifier) {
                    o.x = pos.x;
                    o.y = pos.y;
                }
            });

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

            containers.forEach(c => {
                if (c.touchId === touch.identifier) {
                    c.isPressed = false;
                    c.touchId = null;
                }
            });

            orbs.forEach(o => {
                if (o.isDragging && o.touchId === touch.identifier) {
                    o.isDragging = false;
                    o.touchId = null;

                    let droppedInContainer = null;
                    containers.forEach(c => {
                        if (Math.hypot(o.x - c.x, o.y - c.y) < c.radius) {
                            droppedInContainer = c;
                        }
                    });

                    if (droppedInContainer) {
                        if (droppedInContainer.isPressed && droppedInContainer.color.name === o.color.name) {
                            o.state = 'accepted';
                            o.targetC = droppedInContainer;
                        } else {
                            o.state = 'bouncing';
                        }
                    } else {
                        o.state = 'bouncing';
                    }
                }
            });
        }
    }

    mainCanvas.ontouchstart = (e) => { e.preventDefault(); onTouchStart(e); };
    mainCanvas.ontouchmove = (e) => { e.preventDefault(); onTouchMove(e); };
    mainCanvas.ontouchend = (e) => { e.preventDefault(); onTouchEnd(e); };
    mainCanvas.ontouchcancel = (e) => { e.preventDefault(); onTouchEnd(e); };
    mainCanvas.onmousedown = null; mainCanvas.onmousemove = null; mainCanvas.onmouseup = null;

    function animate() {
        animation = requestAnimationFrame(animate);
        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

        containers.forEach(c => {
            mainCtx.beginPath();
            mainCtx.arc(c.x, c.y, c.radius, 0, Math.PI * 2);
            let colorStr = `rgba(${c.color.r}, ${c.color.g}, ${c.color.b}, 1)`;
            if (c.isPressed) {
                mainCtx.fillStyle = `rgba(${c.color.r}, ${c.color.g}, ${c.color.b}, 0.2)`;
                mainCtx.fill();
                mainCtx.lineWidth = 4;
            } else {
                mainCtx.lineWidth = 1;
            }
            mainCtx.strokeStyle = colorStr;
            mainCtx.stroke();
        });

        orbs.forEach(o => {
            if (o.state === 'bouncing') {
                o.x += (o.startX - o.x) * 0.15;
                o.y += (o.startY - o.y) * 0.15;
                if (Math.hypot(o.x - o.startX, o.y - o.startY) < 1) o.state = 'idle';
            } else if (o.state === 'accepted') {
                o.x += (o.targetC.x - o.x) * 0.15;
                o.y += (o.targetC.y - o.y) * 0.15;
                o.radius += (o.targetC.radius * 0.6 - o.radius) * 0.1; 
            }
            drawGradientCircle(mainCtx, o.x, o.y, o.radius, o.color.r, o.color.g, o.color.b, 1);
        });
    }
    
    animate();
}

// ==========================================
// CÍRCULO 2: LANZAMIENTO MULTITOUCH
// ==========================================
function startCirculo2() {
    let cx = mainCanvas.width / 2;
    let cy = mainCanvas.height / 2;
    
    let bigC = { x: cx - 60, y: cy, radius: 70 };
    let smallC = { x: cx + 80, y: cy, radius: 45, isPressed: false, touchId: null };
    let pulseTime = 0;

    let orbs = [];
    for(let i=0; i<6; i++) {
        orbs.push({
            id: i,
            x: bigC.x + Math.random() * 20, 
            y: bigC.y + (Math.random() - 0.5) * 40,
            radius: 10,
            vx: 0, vy: 0,
            isDragging: false, touchId: null, state: 'idle',
            lastTouchs: []
        });
    }

    function getCanvasPos(touch) {
        const rect = mainCanvas.getBoundingClientRect();
        return {
            x: (touch.clientX - rect.left) * (mainCanvas.width / rect.width),
            y: (touch.clientY - rect.top) * (mainCanvas.height / rect.height)
        };
    }

    function onTouchStart(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            let touch = e.changedTouches[i];
            let pos = getCanvasPos(touch);

            // Seleccionar contenedor vacio
            if (Math.hypot(pos.x - smallC.x, pos.y - smallC.y) < smallC.radius * 1.5) {
                smallC.isPressed = true;
                smallC.touchId = touch.identifier;
            }

            // Agarrar orbe
            orbs.forEach(o => {
                if (Math.hypot(pos.x - o.x, pos.y - o.y) < o.radius * 3 && o.state === 'idle') {
                    o.isDragging = true;
                    o.touchId = touch.identifier;
                    o.lastTouchs = [{x: pos.x, y: pos.y, time: Date.now()}];
                }
            });
        }
    }

    function onTouchMove(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            let touch = e.changedTouches[i];
            let pos = getCanvasPos(touch);

            orbs.forEach(o => {
                if (o.isDragging && o.touchId === touch.identifier) {
                    o.x = pos.x;
                    o.y = pos.y;
                    o.lastTouchs.push({x: pos.x, y: pos.y, time: Date.now()});
                    if (o.lastTouchs.length > 5) o.lastTouchs.shift();
                }
            });

            if (smallC.touchId === touch.identifier) {
                if (Math.hypot(pos.x - smallC.x, pos.y - smallC.y) > smallC.radius * 2) {
                    smallC.isPressed = false;
                    smallC.touchId = null;
                } else {
                    smallC.isPressed = true;
                }
            }
        }
    }

    function onTouchEnd(e) {
        for (let i = 0; i < e.changedTouches.length; i++) {
            let touch = e.changedTouches[i];

            if (smallC.touchId === touch.identifier) {
                smallC.isPressed = false;
                smallC.touchId = null;
            }

            orbs.forEach(o => {
                if (o.isDragging && o.touchId === touch.identifier) {
                    o.isDragging = false;
                    o.touchId = null;
                    
                    // Calcular velocidad del "flick" (lanzamiento)
                    if (o.lastTouchs.length > 1) {
                        let first = o.lastTouchs[0];
                        let last = o.lastTouchs[o.lastTouchs.length - 1];
                        let dt = Math.max(1, last.time - first.time);
                        o.vx = ((last.x - first.x) / dt) * 15; // Multiplicador de fuerza
                        o.vy = ((last.y - first.y) / dt) * 15;
                    }
                    o.state = 'flying';
                }
            });
        }
    }

    mainCanvas.ontouchstart = (e) => { e.preventDefault(); onTouchStart(e); };
    mainCanvas.ontouchmove = (e) => { e.preventDefault(); onTouchMove(e); };
    mainCanvas.ontouchend = (e) => { e.preventDefault(); onTouchEnd(e); };
    mainCanvas.ontouchcancel = (e) => { e.preventDefault(); onTouchEnd(e); };
    mainCanvas.onmousedown = null; mainCanvas.onmousemove = null; mainCanvas.onmouseup = null;

    function animate() {
        animation = requestAnimationFrame(animate);
        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);
        pulseTime += 0.1;

        // Dibujar contenedor grande
        mainCtx.beginPath();
        mainCtx.arc(bigC.x, bigC.y, bigC.radius, 0, Math.PI * 2);
        mainCtx.strokeStyle = "rgba(200, 162, 255, 0.5)";
        mainCtx.lineWidth = 1;
        mainCtx.stroke();

        // Dibujar contenedor pequeño vacío
        mainCtx.beginPath();
        mainCtx.arc(smallC.x, smallC.y, smallC.radius, 0, Math.PI * 2);
        let alphaC2 = 0.3 + Math.abs(Math.sin(pulseTime)) * 0.7; 
        
        if (smallC.isPressed) {
            mainCtx.fillStyle = `rgba(200, 162, 255, 0.2)`;
            mainCtx.fill();
            mainCtx.lineWidth = 3;
            mainCtx.strokeStyle = `rgba(200, 162, 255, 1)`;
        } else {
            mainCtx.lineWidth = 1.5;
            mainCtx.strokeStyle = `rgba(200, 162, 255, ${alphaC2})`;
        }
        mainCtx.stroke();

        // Lógica y render de orbes
        orbs.forEach(o => {
            if (o.state === 'idle') {
                // Simular empuje queriendo salir a la derecha
                let targetX = bigC.x + bigC.radius - 15;
                o.x += (targetX - o.x) * 0.02 + (Math.random() - 0.5) * 1.5;
                o.y += (bigC.y - o.y) * 0.02 + (Math.random() - 0.5) * 1.5;
                
                // Mantener dentro del grande
                let distToCenter = Math.hypot(o.x - bigC.x, o.y - bigC.y);
                if (distToCenter > bigC.radius - o.radius) {
                    let angle = Math.atan2(o.y - bigC.y, o.x - bigC.x);
                    o.x = bigC.x + Math.cos(angle) * (bigC.radius - o.radius);
                    o.y = bigC.y + Math.sin(angle) * (bigC.radius - o.radius);
                }
            } else if (o.state === 'flying') {
                o.x += o.vx;
                o.y += o.vy;
                o.vx *= 0.96; // Fricción
                o.vy *= 0.96;

                let distToSmall = Math.hypot(o.x - smallC.x, o.y - smallC.y);
                
                // Si entra en el pequeño y está presionado
                if (distToSmall < smallC.radius) {
                    if (smallC.isPressed) {
                        o.state = 'accepted';
                    } else {
                        // Rebota si no está apretado
                        o.vx *= -1;
                        o.vy *= -1;
                    }
                }
                
                // Si pierde velocidad, vuelve a idle y regresa
                if (Math.abs(o.vx) < 0.5 && Math.abs(o.vy) < 0.5) {
                    o.state = 'returning';
                }
            } else if (o.state === 'returning') {
                o.x += (bigC.x - o.x) * 0.05;
                o.y += (bigC.y - o.y) * 0.05;
                if (Math.hypot(o.x - bigC.x, o.y - bigC.y) < 10) o.state = 'idle';
            } else if (o.state === 'accepted') {
                o.x += (smallC.x - o.x) * 0.1;
                o.y += (smallC.y - o.y) * 0.1;
            }

            drawGradientCircle(mainCtx, o.x, o.y, o.radius, 200, 162, 255, 1);
        });
    }
    animate();
}

// ==========================================
// CÍRCULO 3: UNIÓN Y SATURACIÓN
// ==========================================
function startCirculo3() {
    let cx = mainCanvas.width / 2;
    let cy = mainCanvas.height / 2;
    
    let c1 = { x: cx, y: cy - 80, radius: 35 };
    let c2 = { x: cx, y: cy + 80, radius: 35 };

    // Valores iniciales y actuales (r, g, b desaturado)
    let baseColor = { r: 180, g: 180, b: 180 };
    let targetColor = { r: 200, g: 162, b: 255 }; // Violeta saturado
    let currentColor = { r: 180, g: 180, b: 180 };

    function handleMultiTouch(e) {
        if (e.touches.length >= 2) {
            const rect = mainCanvas.getBoundingClientRect();
            let x1 = (e.touches[0].clientX - rect.left) * (mainCanvas.width / rect.width);
            let y1 = (e.touches[0].clientY - rect.top) * (mainCanvas.height / rect.height);
            let x2 = (e.touches[1].clientX - rect.left) * (mainCanvas.width / rect.width);
            let y2 = (e.touches[1].clientY - rect.top) * (mainCanvas.height / rect.height);

            c1.x = x1; c1.y = y1;
            c2.x = x2; c2.y = y2;

            // Distancia entre los dos dedos
            let distance = Math.hypot(x1 - x2, y1 - y2);
            
            // Si la distancia es mayor a 300, factor 0 (gris). Si es 0, factor 1 (saturado).
            let factor = Math.max(0, Math.min(1, 1 - (distance / 300)));

            currentColor.r = baseColor.r + (targetColor.r - baseColor.r) * factor;
            currentColor.g = baseColor.g + (targetColor.g - baseColor.g) * factor;
            currentColor.b = baseColor.b + (targetColor.b - baseColor.b) * factor;

            // Crecer un poco al juntarse
            c1.radius = 35 + (factor * 20);
            c2.radius = c1.radius;

        } else {
            // Regresar a estado inicial si sueltan
            currentColor = { ...baseColor };
            c1.radius = 35;
            c2.radius = 35;
        }
    }

    mainCanvas.ontouchstart = (e) => { e.preventDefault(); handleMultiTouch(e); };
    mainCanvas.ontouchmove = (e) => { e.preventDefault(); handleMultiTouch(e); };
    mainCanvas.ontouchend = (e) => { e.preventDefault(); handleMultiTouch(e); };
    mainCanvas.ontouchcancel = (e) => { e.preventDefault(); handleMultiTouch(e); };
    mainCanvas.onmousedown = null; mainCanvas.onmousemove = null; mainCanvas.onmouseup = null;

    function animate() {
        animation = requestAnimationFrame(animate);
        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

        // Si no hay 2 toques, devolver lentamente a su posición original
        if (!mainCanvas.ontouchmove || !navigator.maxTouchPoints) {
            // Un pequeño resguardo si queremos animar la vuelta
        }

        drawGradientCircle(mainCtx, c1.x, c1.y, c1.radius, currentColor.r, currentColor.g, currentColor.b, 1);
        drawGradientCircle(mainCtx, c2.x, c2.y, c2.radius, currentColor.r, currentColor.g, currentColor.b, 1);
    }
    animate();
}
