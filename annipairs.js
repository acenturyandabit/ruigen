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
JQInit(startAnniPairs);
///////annihilation-pairs/////
annipair = [];
annipairSettings = {
    r: 2
}
function startAnniPairs(){
    $(".annipairs").each((i, _e) => {
        e=document.createElement("canvas");
        _e.append(e);
        e.width = 400;
        e.height = 100;
        annipair.push({
            data: {
                bits: []
            },
            ctx: e.getContext('2d')
        });
    });
    setInterval(() => {
        annipair.forEach((v, i) => {
            //Generate bit
            if (Math.random() < triflowsettings.bitprob) {
                v.data.bits.push({
                    cx: 50 + Math.random() * 300,
                    cy: 25 + Math.random() * 50,
                    dist: 400
                })
            }
            //clear screen
            v.ctx.fillStyle = "rgba(0,0,0,0.3)";
            v.ctx.fillRect(0, 0, 400, 200);
            //update and draw all bits
            v.ctx.fillStyle = "rgb(0,255,0)";
            for (i = 0; i < v.data.bits.length; i++) {
                if (v.data.bits[i].dist > 0) {
                    v.ctx.fillRect(v.data.bits[i].cx - annipairSettings.r + v.data.bits[
                            i].dist, v.data.bits[i].cy - annipairSettings.r,
                        2 * annipairSettings.r, 2 * annipairSettings.r);
                    v.ctx.fillRect(v.data.bits[i].cx - annipairSettings.r - v.data.bits[
                            i].dist, v.data.bits[i].cy - annipairSettings.r,
                        2 * annipairSettings.r, 2 * annipairSettings.r);
                    v.data.bits[i].dist = 400 - (400 - v.data.bits[i].dist) * 1.02 - 1;
                } else {
                    v.ctx.fillRect(v.data.bits[i].cx + v.data.bits[
                            i].dist / 2, v.data.bits[i].cy + v
                        .data
                        .bits[i].dist / 2, -v.data.bits[i].dist, -v.data.bits[i].dist
                    );
                    v.data.bits[i].dist--;

                }
            }
            while (v.data.bits.length && v.data.bits[0].dist < -10)
                v.data.bits.shift();
        })
    }, 100)
}
