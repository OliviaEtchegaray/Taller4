
//  1

function startCirculo1() {
    let cx = mainCanvas.width / 2;
    let cy = mainCanvas.height / 2;


    let rejectTarget = { x: cx - 55, y: cy + 10, radius: 55 };
    let acceptTarget = { x: cx + 55, y: cy - 45, radius: 55 }; 
    let startPos = { x: cx + 55, y: cy + 70 };                 
    
    let orb = { 
        x: startPos.x, y: startPos.y, 
        radius: 18, 
        r: 255, g: 235, b: 150,
        isDragging: false,
        state: "idle" 
    };

    function getPointerPos(e) {
        const rect = mainCanvas.getBoundingClientRect();
        let clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: (clientX - rect.left) * (mainCanvas.width / rect.width),
            y: (clientY - rect.top) * (mainCanvas.height / rect.height)
        };
    }

    function onStart(e) {
        if (orb.state === "accepted" || orb.state === "restarting") return;
        let pos = getPointerPos(e);

        if (Math.hypot(pos.x - orb.x, pos.y - orb.y) < orb.radius * 3) {
            orb.isDragging = true;
            orb.state = "idle";
        }
    }

    function onMove(e) {
        if (!orb.isDragging) return;
        let pos = getPointerPos(e);
        orb.x = pos.x;
        orb.y = pos.y;
    }

    function onEnd() {
        if (!orb.isDragging) return;
        orb.isDragging = false;

        let distToReject = Math.hypot(orb.x - rejectTarget.x, orb.y - rejectTarget.y);
        let distToAccept = Math.hypot(orb.x - acceptTarget.x, orb.y - acceptTarget.y);


        if (distToReject < rejectTarget.radius) {
            orb.state = "bouncing";
        } else if (distToAccept < acceptTarget.radius) {
            orb.state = "accepted";
        } else {
            orb.state = "bouncing"; 
        }
    }

    mainCanvas.onmousedown = onStart; mainCanvas.onmousemove = onMove; mainCanvas.onmouseup = onEnd;
    mainCanvas.ontouchstart = (e) => { e.preventDefault(); onStart(e); };
    mainCanvas.ontouchmove = (e) => { e.preventDefault(); onMove(e); };
    mainCanvas.ontouchend = onEnd;

    function animate() {
        animation = requestAnimationFrame(animate);
        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);


        drawGradientCircle(mainCtx, rejectTarget.x, rejectTarget.y, rejectTarget.radius, 200, 160, 255, 1);
        mainCtx.beginPath(); mainCtx.arc(rejectTarget.x, rejectTarget.y, rejectTarget.radius, 0, Math.PI*2); 
        mainCtx.strokeStyle = "#333"; mainCtx.lineWidth = 1; mainCtx.stroke();


        mainCtx.beginPath(); mainCtx.arc(acceptTarget.x, acceptTarget.y, acceptTarget.radius, 0, Math.PI*2); 
        mainCtx.strokeStyle = "#333"; mainCtx.lineWidth = 1; mainCtx.stroke();


        if (orb.state === "bouncing") {
    
            orb.x += (startPos.x - orb.x) * 0.15;
            orb.y += (startPos.y - orb.y) * 0.15;
            if (Math.hypot(orb.x - startPos.x, orb.y - startPos.y) < 1) orb.state = "idle";
            
        } else if (orb.state === "accepted") {

            orb.x += (acceptTarget.x - orb.x) * 0.1;
            orb.y += (acceptTarget.y - orb.y) * 0.1;
 
            orb.radius += (acceptTarget.radius - orb.radius) * 0.05;


            orb.r += (200 - orb.r) * 0.05;
            orb.g += (160 - orb.g) * 0.05;
            orb.b += (255 - orb.b) * 0.05;

   
            if (Math.abs(orb.radius - acceptTarget.radius) < 0.5) {
                orb.state = "restarting"; 
                setTimeout(() => {
         
                    orb.x = startPos.x; 
                    orb.y = startPos.y;
                    orb.radius = 18;
                    orb.r = 255; orb.g = 235; orb.b = 150;
                    orb.state = "idle";
                }, 2000); 
            }
        }
)
        drawGradientCircle(mainCtx, orb.x, orb.y, orb.radius, Math.round(orb.r), Math.round(orb.g), Math.round(orb.b), 1);
        
  
        mainCtx.beginPath(); mainCtx.arc(orb.x, orb.y, orb.radius, 0, Math.PI*2); 
        mainCtx.strokeStyle = "rgba(0,0,0,0.2)"; mainCtx.lineWidth = 1; mainCtx.stroke();
    }
    
    animate();
}


// 2

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
            
      
            let isHinting = (index === 0 && !isDragging && inThis.length > 2);

            inThis.forEach((o, i) => {
                let targetX = c.x;
                let targetY = c.y;

       
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
//  3

function startCirculo3() {
    let cx = mainCanvas.width / 2;
    let groundY = mainCanvas.height * 0.8; // Piso
    
    let c1 = { x: cx - 20, y: groundY, radius: 35 };
    let c2 = { x: cx + 20, y: groundY, radius: 35 };

    let targetY = groundY;
    let targetDistance = 40;
    let targetBrightness = 0.2;

    function handleDrag(e) {
        if (!e.touches) return;
        
        // esta es toda la aprte que lo mueve
        let avgY = 0;
        for(let i=0; i<e.touches.length; i++) {
            avgY += e.touches[i].clientY;
        }
        avgY /= e.touches.length;

        
        if(e.touches.length >= 2) {
            targetDistance = Math.abs(e.touches[0].clientX - e.touches[1].clientX);
        }

      
        targetY = avgY - mainCanvas.getBoundingClientRect().top;
        targetBrightness = Math.max(0.2, 1 - (targetY / mainCanvas.height));
    }

    mainCanvas.ontouchmove = (e) => { e.preventDefault(); handleDrag(e); };
    mainCanvas.ontouchstart = (e) => { e.preventDefault(); handleDrag(e); };
    mainCanvas.ontouchend = () => { 
      
        targetY = groundY; 
        targetDistance = 40;
        targetBrightness = 0.2; 
    };

    function animate() {
        animation = requestAnimationFrame(animate);
        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height);

        // Físicas suaves
        c1.y += (targetY - c1.y) * 0.1;
        c2.y += (targetY - c2.y) * 0.1;

        c1.x += ((cx - targetDistance/2) - c1.x) * 0.1;
        c2.x += ((cx + targetDistance/2) - c2.x) * 0.1;

        drawGradientCircle(mainCtx, c1.x, c1.y, c1.radius, 200, 160, 255, targetBrightness);
        drawGradientCircle(mainCtx, c2.x, c2.y, c2.radius, 200, 160, 255, targetBrightness);
    }
    animate();
}
