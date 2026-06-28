
// 1


function startBlue1(){

    let trails=[];

    let square={

        x:mainCanvas.width/4,
        y:mainCanvas.height/4,
        size:70

    };

    let mouse={

        x:square.x,
        y:square.y

    };

    mainCanvas.onmousemove=function(e){

        const rect=mainCanvas.getBoundingClientRect();

        mouse.x=(e.clientX-rect.left)*(mainCanvas.width/rect.width);
        mouse.y=(e.clientY-rect.top)*(mainCanvas.height/rect.height);

    }

    function animate(){

        animation=requestAnimationFrame(animate);

        mainCtx.clearRect(0,0,mainCanvas.width,mainCanvas.height);

        square.x+=(mouse.x-square.x)*0.12;
        square.y+=(mouse.y-square.y)*0.12;

        trails.push({

            x:square.x,
            y:square.y,

            alpha:1,

            size:square.size

        });

        trails.forEach(t=>{

            mainCtx.fillStyle=`rgba(9,0,255,${t.alpha})`;

            mainCtx.fillRect(

                t.x-t.size/2,
                t.y-t.size/2,

                t.size,
                t.size

            );

            t.alpha-=0.012;

        });

        trails=trails.filter(t=>t.alpha>0);

        mainCtx.fillStyle="#0900FF";

        mainCtx.fillRect(

            square.x-square.size/2,
            square.y-square.size/2,

            square.size,
            square.size

        );

    }

    animate();

}


// =======================================================
// BLUE 2
// GENERAR CUADRADOS
// =======================================================

function startBlue2(){

    let square={

        x:mainCanvas.width/2,
        y:mainCanvas.height/2,

        size:80,

        scale:1

    };

    let minis=[];

    let pulse=0;

    mainCanvas.onclick=function(e){

        const rect=mainCanvas.getBoundingClientRect();

        const x=(e.clientX-rect.left)*(mainCanvas.width/rect.width);
        const y=(e.clientY-rect.top)*(mainCanvas.height/rect.height);

        minis.push({

            x:x,
            y:y,

            size:12+Math.random()*22,

            angle:Math.random()*Math.PI*2,

            alpha:1

        });

    }

    function animate(){

        animation=requestAnimationFrame(animate);

        mainCtx.clearRect(0,0,mainCanvas.width,mainCanvas.height);

        pulse+=0.22;

        square.scale=1+Math.sin(pulse*2)*0.08;

        minis.forEach(m=>{

            mainCtx.save();

            mainCtx.translate(m.x,m.y);

            mainCtx.rotate(m.angle);

            mainCtx.fillStyle=`rgba(9,0,255,${m.alpha})`;

            mainCtx.fillRect(

                -m.size/2,
                -m.size/2,

                m.size,
                m.size

            );

            mainCtx.restore();

            m.alpha-=0.003;

        });

        minis=minis.filter(m=>m.alpha>0);

        mainCtx.save();

        mainCtx.translate(square.x,square.y);

        mainCtx.scale(square.scale,square.scale);

        mainCtx.fillStyle="#0900FF";

        mainCtx.fillRect(

            -square.size/2,
            -square.size/2,

            square.size,
            square.size

        );

        mainCtx.restore();

    }

    animate();

}


// =======================================================
// BLUE 3
// SALVAR CUADRADOS
// =======================================================

function startBlue3(){

    let squares=[];
    let holding=false;

    while(squares.length<30){

        squares.push({

            x:Math.random()*mainCanvas.width,
            y:Math.random()*mainCanvas.height,

            size:20+Math.random()*45,

            alpha:1,

            fading:true

        });

    }

    mainCanvas.onmousedown=()=>holding=true;
    mainCanvas.onmouseup=()=>holding=false;
    mainCanvas.onmouseleave=()=>holding=false;

    mainCanvas.onmousemove=function(e){

        if(!holding) return;

        const rect=mainCanvas.getBoundingClientRect();

        const mx=(e.clientX-rect.left)*(mainCanvas.width/rect.width);
        const my=(e.clientY-rect.top)*(mainCanvas.height/rect.height);

        squares.forEach(s=>{

            if(

                mx>s.x-s.size/2 &&
                mx<s.x+s.size/2 &&
                my>s.y-s.size/2 &&
                my<s.y+s.size/2

            ){

                s.alpha=1;
                s.fading=false;

            }

        });

    }

    function animate(){

        animation=requestAnimationFrame(animate);

        mainCtx.clearRect(0,0,mainCanvas.width,mainCanvas.height);

        if(Math.random()<0.03){

            squares.push({

                x:Math.random()*mainCanvas.width,
                y:Math.random()*mainCanvas.height,

                size:20+Math.random()*45,

                alpha:1,

                fading:true

            });

        }

        squares.forEach(s=>{

            if(s.fading){

                s.alpha-=0.003;

            }else{

                s.alpha-=0.0008;

            }

            mainCtx.fillStyle=`rgba(9,0,255,${Math.max(s.alpha,0)})`;

            mainCtx.fillRect(

                s.x-s.size/2,
                s.y-s.size/2,

                s.size,
                s.size

            );

        });

        squares=squares.filter(s=>s.alpha>0);

    }

    animate();

}