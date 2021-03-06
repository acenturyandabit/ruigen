/*
kaleidoCoreSettings{
  sinusoidal: true or false.
  raidalScalingFactor: how much the shape dilates as it goes out. 10 is a nice number for phones.
}















*/
function JQInit(_f) {
  if (typeof jQuery == "undefined") {
    // preinject jquery so that noone else after us is going to
    //inject jquery
    scr = document.createElement("script");
    scr.src = src = "https://code.jquery.com/jquery-3.3.1.slim.min.js";
    document.getElementsByTagName("head")[0].appendChild(scr);
    jQuery = "";
  }
  if (typeof jQuery == "string") {
    function tryStartJQ(f) {
      if (typeof jQuery != "string" && typeof jQuery != "undefined") f();
      else
        setTimeout(() => {
          tryStartJQ(f);
        }, 1000);
    }
    document.addEventListener("ready", tryStartJQ(_f));
  } else {
    $(_f);
  }
}
function randcol() {
  var output = "#00";
  var ac_char = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "0",
    "a",
    "b",
    "c",
    "d",
    "e",
    "f"
  ];
  for (var i = 0; i < 2; i++) {
    output += ac_char[Math.floor(Math.random() * 17)];
  }
  output += "00";
  return output;
}
JQInit(startKaleidoCore);
var kaleidoCoreDefaultSettings = {
  factor: 8,
  angularAmplitude: 0.1,
  colorGenerator: randcol,
  radialScalingFactor:0,
  backgroundFillColor:"black",
  maxVertices:8,
  radialAmplitude:1
};
var kaleidoCoreSettings;
if (!kaleidoCoreSettings) kaleidoCoreSettings = kaleidoCoreDefaultSettings;
else
  kaleidoCoreSettings = Object.assign(
    kaleidoCoreDefaultSettings,
    kaleidoCoreSettings
  );

kaleidoCore = [];

function shape(maxR, ramR) {
  this.factor = kaleidoCoreSettings.factor; //Math.round(Math.random()*2+3);//how many times it repeats
  this.tRate = (Math.random() * 2 - 1) * kaleidoCoreSettings.angularAmplitude; //rate of rotation
  this.rRate = (Math.random() * 4 + 1) * kaleidoCoreSettings.radialAmplitude; //rate of radius increase
  //for sinusoidal radius
  if (kaleidoCoreSettings.sinusoidal) {
    this.ram = (Math.random() * 0.5 + 0.5) * ramR; // the radius at which the sin function peaks.
    this.rsin = 0; //term in the sin function for sinusoidal radius
  }
  //end sinusoidal radius
  this.r = 0; //radius
  this.t = Math.random() * Math.PI; //theta
  this.color = kaleidoCoreSettings.colorGenerator(); //this color
  var p = Math.floor(Math.random() * (kaleidoCoreSettings.maxVertices-3) + 3);
  this.bits = [];
  for (var i = 0; i < p; i++) this.bits.push(new bit(maxR));
  this.bitT=0;
  this.bitDt=(Math.random()*2-1)*0.01;
}

function bit(maxR) {
  this.dt = Math.random() * 5;
  this.dr = Math.random() * maxR;
}

///////Kaleiocore
function startKaleidoCore() {
  $(".kaleidocore").each((i, e) => {
    kaleidoCanvas = document.createElement("canvas");
    kaleidoCanvas.width = e.clientWidth;
    kaleidoCanvas.height = e.clientHeight;
    e.appendChild(kaleidoCanvas);
    ctx = kaleidoCanvas.getContext("2d");
    kaleidoCore.push({
      ctx: ctx,
      e: kaleidoCanvas,
      phase: 0,
      data: {
        predisp: [],
        shapes: []
      },
      radius:Math.min(kaleidoCanvas.width, kaleidoCanvas.height)/2
    });
  });
  setInterval(() => {
    kaleidoCore.forEach((v, i) => {
      v.ctx.fillStyle = kaleidoCoreSettings.backgroundFillColor;
      v.ctx.fillRect(0, 0, v.e.width, v.e.height);
      //make new shapes, in waves
      if (Math.random() * 1 < 0.15) {
        v.data.shapes.push(new shape(30, v.radius));
      }
      /*
			if (Math.random() * 3 < 1 && v.phase%100<50) {
				v.data.predisp.push(new shape(50-(v.phase%100)+4));
			}
			v.phase++;
			if (v.phase%100==60){
				v.data.shapes=v.data.shapes.concat(v.data.predisp);
			}
			*/
      //shift everything outwards
      for (var i = 0; i < v.data.shapes.length; i++) {
        s = v.data.shapes[i];
        if (kaleidoCoreSettings.sinusoidal) {
          s.rsin += s.rRate;
          s.r = s.ram * Math.sin(s.rsin / 100) ** 1.8;
        } else {
          s.r += s.rRate;
        }
        s.t += (s.tRate / Math.log(s.r + 1 + 1000)) * 3;
		if (s.r > v.e.width * 0.7 || s.r < -0.1) v.data.shapes.splice(i, 1);
		s.bitT+=s.bitDt;
      }
      //draw everything
      for (var k = 0; k < v.data.shapes.length; k++) {
        s = v.data.shapes[k];
        for (var i = 0; i < s.factor; i++) {
          v.ctx.beginPath();
          var ist = true;
          for (var j = 0; j < s.bits.length; j++) {
            b = s.bits[j];
			kr = b.dr* (1 + s.r / v.e.height * kaleidoCoreSettings.radialScalingFactor);
			kd=b.dt+s.bitT;
            xx =
              s.r * Math.cos(s.t + (i * Math.PI * 2) / s.factor) +
              kr * Math.cos(kd + (i * Math.PI * 2) / s.factor) +
              v.e.width / 2;
            yy =
              s.r * Math.sin(s.t + (i * Math.PI * 2) / s.factor) +
              kr * Math.sin(kd + (i * Math.PI * 2) / s.factor) +
              v.e.height / 2;
            if (ist) {
              v.ctx.moveTo(xx, yy);
              ist = false;
            } else v.ctx.lineTo(xx, yy);
          }
          b = s.bits[0];
          xx =
            s.r * Math.cos(s.t + (i * Math.PI * 2) / s.factor) +
            kr * Math.cos(kd + (i * Math.PI * 2) / s.factor) +
            v.e.width / 2;
          yy =
            s.r * Math.sin(s.t + (i * Math.PI * 2) / s.factor) +
            kr * Math.sin(kd + (i * Math.PI * 2) / s.factor) +
            v.e.height / 2;
          v.ctx.lineTo(xx, yy);
          v.ctx.fillStyle = s.color;
          v.ctx.closePath();
          v.ctx.fill();
        }
      }
      //draw centre circle
      //draw eye mask
    });
  }, 100);
}
