// 1
function startCirculo1(){

    let square={
        x:mainCanvas.width/2,
        y:mainCanvas.height/2,
        size:180
    };

    let circle={
        startX:mainCanvas.width/2+170,
        startY:mainCanvas.height/2,

        x:mainCanvas.width/2+170,
        y:mainCanvas.height/2,

        r:28
    };

    let dragging=false;
    let shake=0;
    let rejected=false;

    function insideSquare(x,y){

        return(
            x>square.x-square.size/2 &&
            x<square.x+square.size/2 &&
            y>square.y-square.size/2 &&
            y<square.y+square.size/2
        );

    }

    mainCanvas.onmousedown=function(e){

        const rect=mainCanvas.getBoundingClientRect();

        const mx=(e.clientX-rect.left)*(mainCanvas.width/rect.width);
        const my=(e.clientY-rect.top)*(mainCanvas.height/rect.height);

        const d=Math.hypot(mx-circle.x,my-circle.y);

        if(d<circle.r){

            dragging=true;

        }

    }

    mainCanvas.onmouseup=function(){

        dragging=false;

    }

    mainCanvas.onmouseleave=function(){

        dragging=false;

    }

    mainCanvas.onmousemove=function(e){

        if(!dragging) return;

        const rect=mainCanvas.getBoundingClientRect();

        const mx=(e.clientX-rect.left)*(mainCanvas.width/rect.width);
        const my=(e.clientY-rect.top)*(mainCanvas.height/rect.height);

        circle.x=mx;
        circle.y=my;

        if(insideSquare(circle.x,circle.y)){

            dragging=false;
            rejected=true;
            shake=12;

        }

    }

    function animate(){

        animation=requestAnimationFrame(animate);

        mainCtx.clearRect(0,0,mainCanvas.width,mainCanvas.height);

        if(rejected){

            circle.x+=(circle.startX-circle.x)*0.08;
            circle.y+=(circle.startY-circle.y)*0.08;

            if(
                Math.abs(circle.x-circle.startX)<1 &&
                Math.abs(circle.y-circle.startY)<1
            ){

                rejected=false;

            }

        }

        let sx=square.x;

        if(shake>0){

            sx+=(Math.random()-0.5)*shake;
            shake*=0.82;

        }

        // cuadrado

        mainCtx.strokeStyle="#0900FF";
        mainCtx.lineWidth=7;

        mainCtx.strokeRect(

            sx-square.size/2,
            square.y-square.size/2,

            square.size,
            square.size

        );

        // círculo

        mainCtx.beginPath();

        mainCtx.fillStyle="#FFD400";

        mainCtx.arc(

            circle.x,
            circle.y,

            circle.r,

            0,
            Math.PI*2

        );

        mainCtx.fill();

    }

    animate();

}



// 2

function startCirculo2() {
    let containers = [];
    let orbs = [];
    let isDragging = null;

    function initGame() {
        containers = [];
        orbs = [];
    
        let cx = mainCanvas.width / 2 + 20; 
        let cy = mainCanvas.height / 2;

  
        for (let i = 0; i < 5; i++) {
            containers.push({
                x: cx,
                y: cy + (i - 2) * 75,
                radius: 35
            });
        }

        const initialSetup = [
            ['C', 'C', 'V', 'V'], [], [], ['C', 'C', 'V'], ['C', 'V', 'V']
        ];

        initialSetup.forEach((contents, index) => {
            let container = containers[index];
            contents.forEach(type => {
                orbs.push({
                    type: type,
                    x: container.x + (Math.random() - 0.5) * 30,
                    y: container.y + (Math.random() - 0.5) * 30,
                    currentContainer: index,
                    radius: 10
                });
            });
        });
    }

    initGame();

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
        let pos = getPointerPos(e);
        for (let i = orbs.length - 1; i >= 0; i--) {
            let o = orbs[i];
            if (Math.hypot(pos.x - o.x, pos.y - o.y) < o.radius * 3) {
                isDragging = o;
                break;
            }
        }
    }

    function onMove(e) {
        if (!isDragging) return;
        let pos = getPointerPos(e);
        isDragging.x = pos.x;
        isDragging.y = pos.y;
    }

    function onEnd() {
        if (!isDragging) return;
        let closest = -1;
        let minDist = Infinity;
        containers.forEach((c, index) => {
            let dist = Math.hypot(isDragging.x - c.x, isDragging.y - c.y);
            if (dist < c.radius + 15 && dist < minDist) {
                minDist = dist;
                closest = index;
            }
        });

        if (closest !== -1) isDragging.currentContainer = closest;
        isDragging = null;
        
      
        let allValid = true;
        for (let i = 0; i < 5; i++) {
            let inThis = orbs.filter(o => o.currentContainer === i);
            if (inThis.length !== 2) { 
                allValid = false; 
                break; 
            }
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

        containers.forEach(c => drawGradientCircle(mainCtx, c.x, c.y, c.radius, 200, 160, 255, 1));

        orbs.forEach(o => {
            if (isDragging !== o) {
                let tc = containers[o.currentContainer];
                o.x += (tc.x - o.x) * 0.1;
                o.y += (tc.y - o.y) * 0.1;
            }
            if (o.type === 'C') drawGradientCircle(mainCtx, o.x, o.y, o.radius, 100, 200, 255, 1);
            else drawGradientCircle(mainCtx, o.x, o.y, o.radius, 150, 230, 150, 1);
        });
    }
    animate();
}


// 3

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
