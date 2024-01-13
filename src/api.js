const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("cavidades.sqlite3");
/*const sqlMapa = `CREATE TABLE IF NOT EXISTS mapas (id  INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,url TEXT)`;
db.run(sqlMapa, function (err) {
  if (err) {
    console.log("Ha habido un error"); //err.message
  }
});*/

module.exports = {
  createTable() {
    // const sqlMapa = `CREATE TABLE IF NOT EXISTS mapas (id  INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,url TEXT)`;
    // db.run(sqlMapa, function (err) {
    //   if (err) {
    //     console.log("Ha habido un error"); //err.message
    //   }
    // });
    const sql = `CREATE TABLE IF NOT EXISTS cuevas (id  INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,email TEXT)`;
    return db.run(sql);
  },
  getUsers() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM cuevas", (error, rows) => {
        if (error) {
          console.error("DB Error: ", error);
          return reject(error);
        }

        console.log(rows);
        return resolve(rows);
      });
    });
  },

  getMap(id) {
    return new Promise((resolve, reject) => {
      db.get("SELECT url FROM mapas WHERE id = ?", [id], (error, row) => {
        if (error) {
          console.error("DB Error: ", error);
          return reject(error);
        }

        console.log(row.url);
        return resolve(row.url);
      });
    });
    // return db.all("SELECT url FROM mapas WHERE id = ?", [id]);
  },

  createUser() {
    // db.run(
    //   `INSERT INTO mapas (name, url) VALUES (?, ?)`,
    //   ["Google Maps", "https://mt0.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"],
    //   function (err) {
    //     if (err) {
    //       return console.log(err.message);
    //     }
    //   }
    // );
    // db.run(
    //   `INSERT INTO mapas (name, url) VALUES (?, ?)`,
    //   [
    //     "Terrain Maps",
    //     "https://1.aerial.maps.ls.hereapi.com/maptile/2.1/maptile/newest/terrain.day/{z}/{x}/{y}/256/png8?app_id=eAdkWGYRoc4RfxVo0Z4B&app_code=TrLJuXVK62IQk0vuXFzaig&lg=eng",
    //   ],
    //   function (err) {
    //     if (err) {
    //       return console.log(err.message);
    //     }
    //   }
    // );
    // db.run(
    //   `INSERT INTO mapas (name, url) VALUES (?, ?)`,
    //   [
    //     "Satélite",
    //     "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    //   ],
    //   function (err) {
    //     if (err) {
    //       return console.log(err.message);
    //     }
    //   }
    // );

    return db.run(
      `INSERT INTO cuevas (name, email) VALUES (?, ?)`,
      ["John Doe", "johndoe@example.com"],
      function (err) {
        if (err) {
          return console.log(err.message);
        }
      }
    );
  },

  updateUser(id, user) {
    return db.run("UPDATE  cuevas SET name = ?, email = ? WHERE id = ?", [
      user.name,
      user.email,
      id,
    ]);
  },

  deleteUser(id) {
    return db.run("DELETE FROM  cuevas WHERE id = ?", [id]);
  },
};
