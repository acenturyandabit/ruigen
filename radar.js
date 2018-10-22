function JQInit(_f){
    if (typeof jQuery == 'undefined') {
        // preinject jquery so that noone else after us is going to
        //inject jquery
        scr = document.createElement("script");
        scr.src = src = "https://code.jquery.com/jquery-3.3.1.slim.min.js";
        document.getElementsByTagName("head")[0].appendChild(scr);
        jQuery = "";
    }
    if (typeof jQuery == 'string') {
        function tryStartJQ(f) {
            if (typeof jQuery != 'string' && typeof jQuery != 'undefined') f();
            else setTimeout(()=>{tryStartJQ(f)}, 1000);
        }
        document.addEventListener("ready", tryStartJQ(_f));
    } else {
        $(_f);
    }
}
JQInit(startRadar);


function startRadar() {
    radars = [];
    $("canvas.radar").each((i, e) => {
        e.width = 400;
        e.height = 400;
        radars.push({
            data: {
                r: 200,
                t: 0
            },
            ctx: e.getContext('2d')
        });
    });
    setInterval(() => {
        radars.forEach((v, i) => {
            //sweep
            v.ctx.beginPath();
            v.ctx.moveTo(200, 200);
            v.ctx.lineTo(200 + v.data.r * Math.cos(v.data.t), 200 + v.data.r * Math.sin(
                v.data.t));
            v.ctx.arc(200, 200, v.data.r, v.data.t, v.data.t + 2);
            v.data.t += 0.1;
            v.ctx.lineTo(200, 200);
            v.ctx.strokeStyle = "green";
            v.ctx.stroke();
            v.ctx.fillStyle = "rgba(0,50,0,0.1)";
            v.ctx.fill();
            v.ctx.closePath();
            //fading
            v.ctx.fillStyle = "rgba(0,0,0,0.1)";
            v.ctx.fillRect(0, 0, 401, 401);
            //plot points
            rth = Math.random() * 2 + v.data.t;
            rr = Math.random() * 190;
            v.ctx.beginPath();
            v.ctx.arc(200 + Math.cos(rth) * rr, 200 + Math.sin(rth) * rr, 5, 0, 2 *
                Math.PI);
            v.ctx.fillStyle = "rgb(200,50,0)";
            v.ctx.fill();
            v.ctx.closePath();
        })
    }, 200)
}