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
    spacing: 1,
    stripcount: 6
}
function startBitStream(){
    $(".bitstream").each((i, _e) => {
        e=document.createElement("canvas");
        _e.append(e);
        e.width = _e.clientWidth;
        e.height=_e.clientHeight;
        //e.height = (v.chipsize + bitsettings.spacing) * bitsettings.stripcount;
        //clear the screen on first run
        _ctx=e.getContext('2d');
        _ctx.fillStyle="black";
        _ctx.fillRect(0, 0, e.clientWidth,e.clientHeight);
        bitstreams.push({
            data: {
                selfc: e,
                pos: 0
            },
            ctx: _ctx,
            chipsize: e.height/bitsettings.stripcount-bitsettings.spacing,
            h:e.height
        });
    });
    setInterval(() => {
        bitstreams.forEach((v, i) => {
            //Generate bit
            v.ctx.fillStyle = "rgb(0," + Math.floor(Math.random() * 255) + ",0)";
            v.ctx.fillRect(bitsettings.spacing, (v.chipsize + bitsettings.spacing) *
                v.data.pos + 1, v.chipsize, v.chipsize);
            v.data.pos++;
            //iterate
            if (v.data.pos == bitsettings.stripcount) {
                v.data.pos = 0;
                v.ctx.drawImage(v.data.selfc, v.chipsize + bitsettings.spacing,
                    0);
                v.ctx.fillStyle = "black";
                v.ctx.fillRect(0, 0, v.chipsize +
                    bitsettings.spacing, v.h);
            }
        })
    }, 100)
}