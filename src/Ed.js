"use strict";
const fs = require("fs");
const pop = require("pop");
const path = require("path");

const Game = require("./Game");

const {
  CanvasRenderer,
  Container,
  Sprite,
  Texture
} = pop;

class Ed {
  constructor (w = 800, h = 500) {
    this.w = w;
    this.h = h;
    this.game = null;

    this.container = new Container();
    const renderer = this.renderer = new CanvasRenderer(w, h);
    document.querySelector("#board").appendChild(renderer.view);

    document.querySelector("#btnAdd").addEventListener("click", () => {
      const conf = this.game.config;
      const e2 = {
        "name": "player2",
        "comps": [
          ["Position", 71, 150, 67, 94, 10],
          ["KeyController"],
          ["Player"],
          ["Renderer", "", "jump", "p1_stand.png", 1]
        ]
      };
      conf.scenes[conf.main].entities.push(e2);
    }, false);
  }

  loadProject (config) {
    const {w, h, container} = this;
    const pathname = path.dirname(config);
    fs.readFile(config, "utf8", (err, data) => {
      const conf = JSON.parse(data);
      if (!conf.meta) {
        alert("not a ed3 config file");
        return;
      }
      document.querySelector("#config").value = JSON.stringify(conf, null, 2);
      this.game = new Game(conf);

      document.querySelector("#game_name").textContent = conf.name;

      const scene = conf.scenes[conf.main];

      this.game.components = conf.components.reduce((cs, c) => {
        cs[c] = require(`${pathname}/components/${c}`);
        return cs;
      }, {});

      scene.events.forEach(e => {
        e.comps.forEach(c => {
          const comp = this.game.components[c[0]];
          new comp(c[1]);
        });
      });

      scene.entities
        .map(e => e.comps.find(c => c[0] === "Renderer"))
        .filter(r => !!r)
        .map(r => new Sprite(new Texture(pathname + "/assets/images/" + r[3])))
        .forEach(s => {
          s.pos.x = Math.random() * w;
          s.pos.y = Math.random() * h;
          s.off = Math.random();
          container.add(s);
        });
    });
  }

  saveProject (config) {
    // serialize project, and write it to files[0].
    fs.writeFile(config, JSON.stringify(this.game.config, null, 2), err => {
      if(err) {
        return console.log(err);
      }
      console.log("The file saved");
    });
  }

  tick (dt = 16) {
    const { container: { children } } = this;
    children.forEach(({ pos, off }) => {
      pos.x += Math.sin(Date.now() / 1000 * off) * 0.33 * dt * off;
      pos.y += Math.sin(Date.now() / 400 * off) * 0.24 * dt * off;
    });
  }

  render () {
    const {renderer, container} = this;
    renderer.render(container);
  }
}

module.exports = Ed;
