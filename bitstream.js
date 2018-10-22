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
JQInit(startBitStream);


///////////////bitstream/////////
bitstreams = [];
bitsettings = {
    chipsize: 15,
    spacing: 1,
    stripcount: 6
}
function startBitStream(){
    $("canvas.bitstream").each((i, e) => {
        e.width = 400;
        e.height = (bitsettings.chipsize + bitsettings.spacing) * bitsettings.stripcount;
        bitstreams.push({
            data: {
                selfc: e,
                pos: 0
            },
            ctx: e.getContext('2d')
        });
    });
    setInterval(() => {
        bitstreams.forEach((v, i) => {
            //Generate bit
            v.ctx.fillStyle = "rgb(0," + Math.floor(Math.random() * 255) + ",0)";
            v.ctx.fillRect(bitsettings.spacing, (bitsettings.chipsize + bitsettings.spacing) *
                v.data.pos + 1, bitsettings.chipsize, bitsettings.chipsize);
            v.data.pos++;
            //iterate
            if (v.data.pos == bitsettings.stripcount) {
                v.data.pos = 0;
                v.ctx.drawImage(v.data.selfc, bitsettings.chipsize + bitsettings.spacing,
                    0);
                v.ctx.fillStyle = "black";
                v.ctx.fillRect(0, bitsettings.chipsize, bitsettings.chipsize +
                    bitsettings.spacing, (bitsettings.chipsize + bitsettings.spacing) *
                    bitsettings.stripcount);
            }
        })
    }, 100)
}