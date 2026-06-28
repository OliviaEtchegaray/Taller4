
// ELEMENTOS


const cards = document.querySelectorAll(".card");
const overlay = document.getElementById("overlay");
const windowBox = document.getElementById("window");

const mainCanvas = document.getElementById("mainCanvas");
const mainCtx = mainCanvas.getContext("2d");

let animation = null;
let currentSystem = 0;

// CANVAS PRINCIPAL


function resizeMainCanvas(){

    mainCanvas.width = windowBox.clientWidth;
    mainCanvas.height = windowBox.clientHeight;

}

window.addEventListener("resize", resizeMainCanvas);

resizeMainCanvas();


// PREVIEWS


function resizePreview(canvas){

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

}


// ABRIR SISTEMAS


cards.forEach(card=>{

    if(card.classList.contains("disabled")) return;

    card.addEventListener("click",()=>{

        currentSystem = Number(card.dataset.system);

        overlay.classList.add("active");

        resizeMainCanvas();

        stopCurrentAnimation();

        openSystem(currentSystem);

    });

});


// CERRAR OVERLAY


overlay.addEventListener("click",(e)=>{

    if(e.target!==overlay) return;

    overlay.classList.remove("active");

    stopCurrentAnimation();

    mainCtx.clearRect(
        0,
        0,
        mainCanvas.width,
        mainCanvas.height
    );

});



function stopCurrentAnimation(){

    if(animation){

        cancelAnimationFrame(animation);
        animation=null;

    }

    mainCanvas.onclick=null;
    mainCanvas.onmousemove=null;
    mainCanvas.onmousedown=null;
    mainCanvas.onmouseup=null;
    mainCanvas.onmouseleave=null;

}



function openSystem(id){

    switch(id){

        case 1:
            startBlue1();
            break;

        case 2:
            startBlue2();
            break;

        case 3:
            startBlue3();
            break;

        case 4:
            startCirculo1();
            break;

        case 5:
            startCirculo2();
            break;

        case 6:
            startCirculo3();
            break;

        case 7:
            startTriangulo1();
            break;

        case 8:
            startTriangulo2();
            break;

        case 9:
            startTriangulo3();
            break;

    }

}


// PREVIEW 1


const p1 = document.getElementById("preview1");
const c1 = p1.getContext("2d");

resizePreview(p1);

let x1=0;
let trail1=[];

function preview1(){

    resizePreview(p1);

    c1.clearRect(0,0,p1.width,p1.height);

    let cx=p1.width/2+Math.sin(x1)*20;
    let cy=p1.height/2;

    trail1.push({
        x:cx,
        y:cy,
        a:1
    });

    trail1.forEach(t=>{

        c1.fillStyle=`rgba(9,0,255,${t.a})`;

        c1.fillRect(
            t.x-16,
            t.y-16,
            32,
            32
        );

        t.a-=0.03;

    });

    trail1=trail1.filter(t=>t.a>0);

    c1.fillStyle="#0900FF";

    c1.fillRect(
        cx-16,
        cy-16,
        32,
        32
    );

    x1+=0.03;

    requestAnimationFrame(preview1);

}

preview1();


// PREVIEW 2


const p2=document.getElementById("preview2");
const c2=p2.getContext("2d");

resizePreview(p2);

let pulse=0;

function preview2(){

    resizePreview(p2);

    c2.clearRect(0,0,p2.width,p2.height);

    pulse+=0.13;

    let s=36+Math.sin(pulse*2)*6;

    c2.fillStyle="#0900FF";

    c2.fillRect(

        p2.width/2-s/2,
        p2.height/2-s/2,

        s,
        s

    );

    requestAnimationFrame(preview2);

}

preview2();


//  3


const p3=document.getElementById("preview3");
const c3=p3.getContext("2d");

resizePreview(p3);

let particles=[];

setInterval(()=>{

    particles.push({

        x:Math.random()*p3.width,
        y:Math.random()*p3.height,

        a:1,

        s:18+Math.random()*20

    });

},350);

function preview3(){

    resizePreview(p3);

    c3.clearRect(0,0,p3.width,p3.height);

    particles.forEach(p=>{

        c3.fillStyle=`rgba(9,0,255,${p.a})`;

        c3.fillRect(

            p.x-p.s/2,
            p.y-p.s/2,

            p.s,
            p.s

        );

        p.a-=0.01;

    });

    particles=particles.filter(p=>p.a>0);

    requestAnimationFrame(preview3);

}

preview3();

//  4


const p4 = document.getElementById("preview4");
const c4 = p4.getContext("2d");

resizePreview(p4);

let t4 = 0;

function preview4(){

    resizePreview(p4);

    c4.clearRect(0,0,p4.width,p4.height);

    const cx = p4.width/2;
    const cy = p4.height/2;

    // Cuadrado
    c4.strokeStyle="#0900FF";
    c4.lineWidth=5;

    c4.strokeRect(cx-32,cy-32,64,64);

    // Círculo
    let offset = 52 - Math.abs(Math.sin(t4))*18;

    c4.beginPath();
    c4.fillStyle="#FFD400";
    c4.arc(cx+offset,cy,13,0,Math.PI*2);
    c4.fill();

    t4 += 0.05;

    requestAnimationFrame(preview4);

}

preview4();



//5


const p5 = document.getElementById("preview5");
const c5 = p5.getContext("2d");

resizePreview(p5);

let t5 = 0;

function preview5(){

    resizePreview(p5);

    c5.clearRect(0,0,p5.width,p5.height);

    const cx = p5.width/2;
    const cy = p5.height/2;

    let move = Math.abs(Math.sin(t5))*16;

    // izquierda

    c5.beginPath();
    c5.fillStyle="rgba(255,212,0,.45)";
    c5.arc(cx-55+move,cy,14+move*0.08,0,Math.PI*2);
    c5.fill();

    // derecha

    c5.beginPath();
    c5.arc(cx+55-move,cy,14+move*0.08,0,Math.PI*2);
    c5.fill();

    t5+=0.05;

    requestAnimationFrame(preview5);

}

preview5();



//  6


const p6 = document.getElementById("preview6");
const c6 = p6.getContext("2d");

resizePreview(p6);

let miniCircles=[];

for(let i=0;i<12;i++){

    miniCircles.push({

        x:Math.random()*p6.width,
        y:Math.random()*p6.height,

        tx:Math.random()*p6.width,
        ty:Math.random()*p6.height,

        r:5+Math.random()*3

    });

}

function preview6(){

    resizePreview(p6);

    c6.clearRect(0,0,p6.width,p6.height);

    miniCircles.forEach(c=>{

        c.x += (c.tx-c.x)*0.01;
        c.y += (c.ty-c.y)*0.01;

        if(

            Math.abs(c.tx-c.x)<4 &&
            Math.abs(c.ty-c.y)<4

        ){

            c.tx=Math.random()*p6.width;
            c.ty=Math.random()*p6.height;

        }

        c6.beginPath();

        c6.fillStyle="rgba(255,212,0,.35)";

        c6.arc(

            c.x,
            c.y,
            c.r,

            0,
            Math.PI*2

        );

        c6.fill();

    });

    requestAnimationFrame(preview6);

}

preview6();


// 7


// 8

// =======================================================
// PREVIEW 8 (Sistema de equilibrio / Mantener recto)
// FONDO BLANCO Y TRIÁNGULOS VIBRANDO/BAMBOLEÁNDOSE
// =======================================================

const p8 = document.getElementById("preview8"); 
const c8 = p8.getContext("2d");

resizePreview(p8);

// 3 Moldes fijos en la preview
const previewTargets8 = [
    { x: p8.width * 0.25, y: p8.height * 0.35, size: 14, angle: 0 },
    { x: p8.width * 0.75, y: p8.height * 0.45, size: 14, angle: Math.PI * 2 / 3 },
    { x: p8.width * 0.5,  y: p8.height * 0.75, size: 14, angle: Math.PI * 4 / 3 }
];

let previewTime8 = 0;

function drawPreviewTriangle8(ctx, x, y, size, angle, color) {
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

function preview8(){

    resizePreview(p8);

    // Fondo Blanco solicitado
    c8.fillStyle = "#FFFFFF";
    c8.fillRect(0, 0, p8.width, p8.height);
    
    previewTime8 += 0.4; // Velocidad de la vibración

    previewTargets8.forEach((t, index) => {
        // Dibujar hueco gris de fondo
        drawPreviewTriangle8(c8, t.x, t.y, t.size, t.angle, "rgba(85, 85, 85, 0.3)");

        // Animación de indicación: Vibración y bamboleo constante
        let vibX = Math.sin(previewTime8 * 1.5 + index) * 1.8;
        let vibY = Math.cos(previewTime8 * 1.2 - index) * 1.8;
        let bamboleo = Math.sin(previewTime8 * 0.6 + index) * 0.25; // Rotación leve de lado a lado

        // Dibujar triángulo rojo encima temblando
        drawPreviewTriangle8(c8, t.x + vibX, t.y + vibY, t.size - 1, t.angle + bamboleo, "#FF0000");
    });

    requestAnimationFrame(preview8);

}

preview8();

// 9

const p9 = document.getElementById("preview9"); 
const c9 = p9.getContext("2d");

resizePreview(p9);
       c9.fillStyle = "#FFFFFF";

const previewTargets = [
    { x: p9.width * 0.3,  y: p9.height * 0.4, size: 14, angle: 0 },
    { x: p9.width * 0.7,  y: p9.height * 0.3, size: 14, angle: Math.PI * 2 / 3 },
    { x: p9.width * 0.5,  y: p9.height * 0.7, size: 14, angle: Math.PI * 4 / 3 }
];

let previewTime = 0;

function drawPreviewTriangle(ctx, x, y, size, angle, color) {
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

function preview9(){


    resizePreview(p9);

    c9.clearRect(0, 0, p9.width, p9.height);
    
    previewTime += 0.04; 

    previewTargets.forEach((t, index) => {
        
        drawPreviewTriangle(c9, t.x, t.y, t.size, t.angle, "rgba(85, 85, 85, 0.4)");

      
        let offsetY = Math.sin(previewTime + index * 1.5) * 12; 
        
        let rojoX = t.x;
        let rojoY = t.y + 15 + offsetY; 

        
        drawPreviewTriangle(c9, rojoX, rojoY, t.size - 1, t.angle, "#FF0000");
    });

    requestAnimationFrame(preview9);

}

preview9();