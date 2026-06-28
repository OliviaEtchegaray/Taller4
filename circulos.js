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

function startCirculo2(){

    const circles=[

        {
            x:mainCanvas.width/2-180,
            y:mainCanvas.height/2,
            r:28,
            dragging:false
        },

        {
            x:mainCanvas.width/2+180,
            y:mainCanvas.height/2,
            r:28,
            dragging:false
        }

    ];

    let selected=null;

    function getMouse(e){

        const rect=mainCanvas.getBoundingClientRect();

        return{

            x:(e.clientX-rect.left)*(mainCanvas.width/rect.width),
            y:(e.clientY-rect.top)*(mainCanvas.height/rect.height)

        };

    }

    mainCanvas.onmousedown=function(e){

        const m=getMouse(e);

        circles.forEach(c=>{

            const d=Math.hypot(m.x-c.x,m.y-c.y);

            if(d<c.r){

                selected=c;
                c.dragging=true;

            }

        });

    }

    mainCanvas.onmouseup=function(){

        if(selected){

            selected.dragging=false;
            selected=null;

        }

    }

    mainCanvas.onmouseleave=function(){

        if(selected){

            selected.dragging=false;
            selected=null;

        }

    }

    mainCanvas.onmousemove=function(e){

        if(!selected) return;

        const m=getMouse(e);

        selected.x=m.x;
        selected.y=m.y;

    }

    function animate(){

        animation=requestAnimationFrame(animate);

        mainCtx.clearRect(0,0,mainCanvas.width,mainCanvas.height);

        const a=circles[0];
        const b=circles[1];

        const dx=b.x-a.x;
        const dy=b.y-a.y;

        let dist=Math.hypot(dx,dy);

        const target=a.r+b.r;

        // impedir que se atraviesen

        if(dist<target){

            const overlap=target-dist;

            const nx=dx/dist;
            const ny=dy/dist;

            if(a.dragging){

                a.x-=nx*overlap;
                a.y-=ny*overlap;

            }
            else if(b.dragging){

                b.x+=nx*overlap;
                b.y+=ny*overlap;

            }

            dist=target;

        }

        // cuanto más cerca, más brillan

        const proximity=Math.max(
            0,
            Math.min(
                1,
                1-(dist-target)/220
            )
        );

        const radius=28+proximity*18;

        const alpha=0.35+proximity*0.65;

        circles.forEach(c=>{

            c.r+=((radius)-c.r)*0.15;

            mainCtx.beginPath();

            mainCtx.fillStyle=`rgba(255,212,0,${alpha})`;

            mainCtx.arc(

                c.x,
                c.y,
                c.r,

                0,
                Math.PI*2

            );

            mainCtx.fill();

        });

    }

    animate();

}

function startCirculo3(){

    let circles=[];

    function newCircle(){

        circles.push({

            x:60+Math.random()*(mainCanvas.width-120),
            y:60+Math.random()*(mainCanvas.height-120),

            r:12+Math.random()*10,

            dragging:false,

            glow:0

        });

    }

    // círculos iniciales
    for(let i=0;i<12;i++){

        newCircle();

    }

    // aparecen nuevos
    const spawn=setInterval(()=>{

        newCircle();

    },500);

    let selected=null;

    function mouse(e){

        const rect=mainCanvas.getBoundingClientRect();

        return{

            x:(e.clientX-rect.left)*(mainCanvas.width/rect.width),
            y:(e.clientY-rect.top)*(mainCanvas.height/rect.height)

        };

    }

    mainCanvas.onmousedown=function(e){

        const m=mouse(e);

        // seleccionar el círculo superior
        for(let i=circles.length-1;i>=0;i--){

            const c=circles[i];

            if(Math.hypot(m.x-c.x,m.y-c.y)<c.r){

                selected=c;
                c.dragging=true;
                break;

            }

        }

    }

    mainCanvas.onmouseup=function(){

        if(selected){

            selected.dragging=false;
            selected=null;

        }

    }

    mainCanvas.onmouseleave=function(){

        if(selected){

            selected.dragging=false;
            selected=null;

        }

    }

    mainCanvas.onmousemove=function(e){

        if(!selected) return;

        const m=mouse(e);

        selected.x=m.x;
        selected.y=m.y;

    }

    function animate(){

        animation=requestAnimationFrame(animate);

        mainCtx.clearRect(0,0,mainCanvas.width,mainCanvas.height);

        // absorciones
        for(let i=0;i<circles.length;i++){

            for(let j=circles.length-1;j>i;j--){

                const a=circles[i];
                const b=circles[j];

                const d=Math.hypot(a.x-b.x,a.y-b.y);

                if(d<Math.max(a.r,b.r)){

                    if(a.r>=b.r){

                        a.r+=b.r*0.28;
                        a.glow=1;
                        circles.splice(j,1);

                    }else{

                        b.r+=a.r*0.28;
                        b.glow=1;
                        circles.splice(i,1);

                        i--;
                        break;

                    }

                }

            }

        }

        circles.forEach(c=>{

            c.glow*=0.96;

            const alpha=0.45+c.glow*0.55;

            // halo

            if(c.glow>0.01){

                mainCtx.beginPath();

                mainCtx.fillStyle=`rgba(255,212,0,${c.glow*0.18})`;

                mainCtx.arc(

                    c.x,
                    c.y,

                    c.r+10+c.glow*10,

                    0,
                    Math.PI*2

                );

                mainCtx.fill();

            }

            // círculo

            mainCtx.beginPath();

            mainCtx.fillStyle=`rgba(255,212,0,${alpha})`;

            mainCtx.arc(

                c.x,
                c.y,

                c.r,

                0,
                Math.PI*2

            );

            mainCtx.fill();

        });

    }

    animate();

    // limpiar intervalo al cerrar
    const oldStop=stopCurrentAnimation;

    stopCurrentAnimation=function(){

        clearInterval(spawn);

        oldStop();

    }

}