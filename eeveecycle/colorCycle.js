function JQInit(_f) {
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
            else setTimeout(() => {
                tryStartJQ(f)
            }, 1000);
        }
        document.addEventListener("ready", tryStartJQ(_f));
    } else {
        $(_f);
    }
}
JQInit(startcolorCycle);

/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR 
 * h, s, v
*/
function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}


function startcolorCycle() {
    colorCycles = [];
    $(".colorCycle").each((i, _e) => {
        backimg = document.createElement("img");
        backimg.src = "img.png";
        backimg.style.display = "none";
        _e.append(backimg);
        e = document.createElement("canvas");
        _e.append(e);
        slen = _e.clientHeight;
        if (slen > _e.clientWidth) slen = e.clientWidth;
        e.width = _e.clientWidth;
        e.height = _e.clientHeight;
        colorCycles.push({
            e:e,
            data: {
                col: 0
            },
            img: backimg,
            ctx: e.getContext('2d'),
            cx: e.width / 2,
            cy: e.height / 2,
        });
    });
    setInterval(() => {
        colorCycles.forEach((v, i) => {
            //draw original image
            v.ctx.globalCompositeOperation="source-over";
            v.ctx.drawImage(v.img,0,0,v.e.width, v.e.height);
            //hue update
            v.data.col++;
            v.data.col%=255;
            //hue cycle
            v.ctx.globalCompositeOperation="hue";
            let rgb=HSVtoRGB(v.data.col/255,1,0.5);
            v.ctx.fillStyle="rgb("+rgb.r+","+rgb.g+","+rgb.b+")";
            v.ctx.fillRect(0,0,v.e.width, v.e.height);
        })
    }, 100)
}