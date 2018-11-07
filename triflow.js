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
JQInit(startTriflow);


////////triflow//////
triflow = [];
triflowsettings = {
    flowrate: 1,
    bitprob: 0.1
}
function startTriflow(){
    $(".triflow").each((i, _e) => {
        e=document.createElement("canvas");
        _e.append(e);
        e.width = _e.clientWidth;
        e.height = _e.clientHeight;
        triflow.push({
            data: {
                bits: []
            },
            ctx: e.getContext('2d'),
            h:e.height,
            w:e.width,
            tick:0
        });
    });
    setInterval(() => {
        triflow.forEach((v, i) => {
            //Generate bit
            if (Math.random() < triflowsettings.bitprob) {
                v.data.bits.push({
                    x: -2 / triflowsettings.bitprob,
                    //c: e.clientHeight*(0.4 + Math.random() * 0.1),
                    c:e.clientHeight/2,
                    a: e.clientHeight*(0.2 + Math.random() * 0.05),
                    //a:e.clientHeight/4,
                    //omg: 0.02 + Math.random() * 0.1,
                    omg:0.07,
                    phi: Math.random() * 2 * Math.PI
                    //phi: v.tick*0.01*Math.PI
                })
                //v.tick+=Math.random()*5;
            }
            //clear screen
            v.ctx.fillStyle = "black";
            v.ctx.fillRect(0, 0, v.w,v.h);
            //Draw bits
            if (v.data.bits.length > 3) {
                for (i = 2; i < v.data.bits.length; i++) {
                    //v.ctx.fillStyle = "rgb(0," + Math.floor(Math.random() * 255) + ",0)";
                    //v.ctx.strokeStyle = "rgb(0," + Math.floor(Math.random() * 255) + ",0)";
                    v.ctx.strokeStyle = "green"
                    v.ctx.beginPath();
                    v.ctx.moveTo(v.data.bits[i].x, v.data.bits[i].c + v.data.bits[i].a *
                        Math.sin(v.data.bits[i].phi));
                    v.ctx.lineTo(v.data.bits[i - 1].x, v.data.bits[i - 1].c + v.data.bits[
                        i - 1].a * Math.sin(v.data.bits[i - 1].phi));
                    v.ctx.lineTo(v.data.bits[i - 2].x, v.data.bits[i - 2].c + v.data.bits[
                        i - 2].a * Math.sin(v.data.bits[i - 2].phi));
                    v.ctx.lineTo(v.data.bits[i].x, v.data.bits[i].c + v.data.bits[i].a *
                        Math.sin(v.data.bits[i].phi));
                    //v.ctx.fill();
                    v.ctx.stroke();
                }
            }
            //update all bits
            for (i = 0; i < v.data.bits.length; i++) {
                v.data.bits[i].phi += v.data.bits[i].omg;
                v.data.bits[i].x++;
            }
            while (v.data.bits.length && v.data.bits[0].x > v.w) v
                .data.bits.shift();
        })
    }, 100)
}