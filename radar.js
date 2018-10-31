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
    $(".radar").each((i, _e) => {
        e=document.createElement("canvas");
        _e.append(e);
        slen=_e.clientHeight;
        if (slen>_e.clientWidth)slen=e.clientWidth;
        e.width = _e.clientWidth;
        e.height = _e.clientHeight;
        radars.push({
            data: {
                r: slen/2,
                t: 0
            },
            ctx: e.getContext('2d'),
            cx:e.width/2,
            cy:e.height/2,
        });
    });
    setInterval(() => {
        radars.forEach((v, i) => {
            //sweep
            v.ctx.beginPath();
            v.ctx.moveTo(v.cx, v.cy);
            v.ctx.lineTo(v.cx + v.data.r * Math.cos(v.data.t), v.cy + v.data.r * Math.sin(
                v.data.t));
            v.ctx.arc(v.cx, v.cy, v.data.r, v.data.t, v.data.t + 2);
            v.data.t += 0.1;
            v.ctx.lineTo(v.cx, v.cy);
            v.ctx.strokeStyle = "green";
            v.ctx.stroke();
            v.ctx.fillStyle = "rgba(0,50,0,0.1)";
            v.ctx.fill();
            v.ctx.closePath();
            //fading
            v.ctx.fillStyle = "rgba(0,0,0,0.1)";
            v.ctx.fillRect(0, 0, v.cx*2, v.cy*2);
            //plot points
            rth = Math.random() * 2 + v.data.t;
            rr = Math.random() * v.data.r*0.9;
            v.ctx.beginPath();
            v.ctx.arc(v.cx + Math.cos(rth) * rr, v.cy + Math.sin(rth) * rr, 5, 0, 2 *
                Math.PI);
            v.ctx.fillStyle = "rgb(200,50,0)";
            v.ctx.fill();
            v.ctx.closePath();
        })
    }, 200)
}