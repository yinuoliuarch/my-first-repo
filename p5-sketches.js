const p5Colors = {
  black: "#050505",
  pink: "#ff2aa7",
  hotPink: "#ff66c8",
  darkPink: "#b90068",
  white: "#ffffff",
  cyan: "#59d7ff",
  lime: "#c9ff4d"
};

function startWhenP5Ready(callback) {
  if (window.p5) {
    callback();
    return;
  }

  let attempts = 0;
  const timer = window.setInterval(() => {
    attempts += 1;
    if (window.p5) {
      window.clearInterval(timer);
      callback();
    }

    if (attempts > 60) {
      window.clearInterval(timer);
    }
  }, 100);
}

function fitCanvasToParent(p, parentId) {
  const parent = document.querySelector(`#${parentId}`);
  return {
    width: parent.clientWidth,
    height: parent.clientHeight
  };
}

startWhenP5Ready(() => {
  new p5((p) => {
    let stage;

    p.setup = () => {
      stage = fitCanvasToParent(p, "p5-static");
      const canvas = p.createCanvas(stage.width, stage.height);
      canvas.parent("p5-static");
      p.noLoop();
    };

    p.windowResized = () => {
      stage = fitCanvasToParent(p, "p5-static");
      p.resizeCanvas(stage.width, stage.height);
      p.redraw();
    };

    p.draw = () => {
      const w = p.width;
      const h = p.height;

      p.background(p5Colors.black);

      for (let x = 0; x < w; x += 18) {
        p.stroke(255, 42, 167, 55);
        p.line(x, 0, x - h * 0.35, h);
      }

      p.noStroke();
      p.fill(p5Colors.darkPink);
      p.rect(18, 18, w - 36, h - 36);
      p.fill(0);
      p.rect(30, 30, w - 60, h - 60);

      p.fill(p5Colors.hotPink);
      p.triangle(w * 0.3, h * 0.36, w * 0.4, h * 0.14, w * 0.49, h * 0.38);
      p.triangle(w * 0.7, h * 0.36, w * 0.6, h * 0.14, w * 0.51, h * 0.38);

      p.fill(245);
      p.ellipse(w * 0.5, h * 0.5, w * 0.42, h * 0.46);

      p.fill(p5Colors.black);
      p.ellipse(w * 0.42, h * 0.46, 24, 34);
      p.ellipse(w * 0.58, h * 0.46, 24, 34);
      p.fill(p5Colors.pink);
      p.ellipse(w * 0.42, h * 0.52, 34, 10);
      p.ellipse(w * 0.58, h * 0.52, 34, 10);

      p.stroke(p5Colors.black);
      p.strokeWeight(3);
      p.line(w * 0.5, h * 0.51, w * 0.47, h * 0.57);
      p.line(w * 0.5, h * 0.51, w * 0.53, h * 0.57);
      p.noStroke();

      p.fill(p5Colors.pink);
      p.triangle(w * 0.5, h * 0.48, w * 0.47, h * 0.53, w * 0.53, h * 0.53);

      p.stroke(p5Colors.cyan);
      p.strokeWeight(2);
      for (let i = 0; i < 3; i += 1) {
        const y = h * 0.56 + i * 15;
        p.line(w * 0.38, y, w * 0.18, y - 14);
        p.line(w * 0.62, y, w * 0.82, y - 14);
      }

      p.noStroke();
      p.fill(p5Colors.pink);
      p.rect(46, h - 72, w - 92, 32);
      p.fill(p5Colors.white);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(16);
      p.textStyle(p.BOLD);
    };
  }, "p5-static");

  new p5((p) => {
    let tears = [];
    let stage;

    p.setup = () => {
      stage = fitCanvasToParent(p, "p5-interactive");
      const canvas = p.createCanvas(stage.width, stage.height);
      canvas.parent("p5-interactive");

      tears = Array.from({ length: 32 }, () => ({
        x: p.random(p.width),
        y: p.random(-p.height, p.height),
        speed: p.random(1.2, 3.8),
        size: p.random(7, 18)
      }));
    };

    p.windowResized = () => {
      stage = fitCanvasToParent(p, "p5-interactive");
      p.resizeCanvas(stage.width, stage.height);
    };

    p.draw = () => {
      const mood = p.constrain(p.mouseX / Math.max(p.width, 1), 0, 1);

      p.background(8, 8, 12);
      p.noStroke();

      for (let i = 0; i < 9; i += 1) {
        p.fill(255, 42, 167, 18 + i * 5);
        p.ellipse(p.width * mood, p.height * 0.5, 70 + i * 30, 70 + i * 30);
      }

      p.fill(p5Colors.white);
      p.ellipse(p.width / 2, p.height * 0.48, 150, 130);

      p.fill(p5Colors.black);
      p.triangle(p.width * 0.34, p.height * 0.35, p.width * 0.43, p.height * 0.18, p.width * 0.48, p.height * 0.38);
      p.triangle(p.width * 0.66, p.height * 0.35, p.width * 0.57, p.height * 0.18, p.width * 0.52, p.height * 0.38);

      p.fill(p5Colors.pink);
      p.ellipse(p.width * 0.43, p.height * 0.47, 22, 30 + mood * 18);
      p.ellipse(p.width * 0.57, p.height * 0.47, 22, 30 + mood * 18);

      tears.forEach((tear) => {
        p.fill(89, 215, 255, 180);
        p.ellipse(tear.x, tear.y, tear.size * 0.65, tear.size);
        tear.y += tear.speed + mood * 3;
        if (tear.y > p.height + 20) {
          tear.y = -20;
          tear.x = p.random(p.width);
        }
      });

      p.fill(p5Colors.lime);
      p.textAlign(p.CENTER, p.CENTER);
      p.textSize(14);
      p.textStyle(p.BOLD);
    };
  }, "p5-interactive");
});
