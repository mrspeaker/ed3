const Ed = require("./src/Ed");
const menu = require("./src/menu");

// Editoring
const ed = new Ed(800, 500);
menu(ed);

const dt = 1000 / 30;
setInterval(() => {
  ed.tick(dt);
  ed.render();
}, dt);
