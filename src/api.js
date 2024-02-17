const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("cavidades.sqlite3");
/*const sqlMapa = `CREATE TABLE IF NOT EXISTS mapas (id  INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,url TEXT)`;
db.run(sqlMapa, function (err) {
  if (err) {
    console.log("Ha habido un error"); //err.message
  }
});*/

module.exports = {
  createTable(concejo) {
    // const sqlMapa = `CREATE TABLE IF NOT EXISTS mapas (id  INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,url TEXT)`;
    // db.run(sqlMapa, function (err) {
    //   if (err) {
    //     console.log("Ha habido un error"); //err.message
    //   }
    // });
    const sql = `CREATE TABLE IF NOT EXISTS ${concejo} (id  INTEGER PRIMARY KEY AUTOINCREMENT,denominacion TEXT, X TEXT, Y TEXT, Z TEXT, elipsoide TEXT, huso TEXT, zonaUTM TEXT, hermisferio TEXT, concejo TEXT, latitud TEXT, longitud TEXT)`;
    return db.run(sql);
  },
  getMaps() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM mapas", (error, rows) => {
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

        console.log(row);
        return resolve(row.url);
      });
    });
    // return db.all("SELECT url FROM mapas WHERE id = ?", [id]);
  },

  createCueva(
    denominacion,
    X,
    Y,
    Z,
    elipsoide,
    huso,
    zonaUTM,
    hermisferio,
    concejo,
    latitud,
    longitud
  ) {
    // PARA MAPAS
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

    //FUNCIONAAAAAAAAAA
    // return db.run(
    //   `INSERT INTO cuevas (name, email) VALUES (?, ?)`,
    //   ["John Doe", "johndoe@example.com"],
    //   function (err) {
    //     if (err) {
    //       return console.log(err.message);
    //     }
    //   }
    // );
    // return db.run(
    //   `INSERT INTO ${concejo} (denominacion, X, Y, Z, elipsoide, huso, zonaUTM, hermisferio, concejo, latitud, longitud) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) WHERE NOT EXISTS (SELECT 1 FROM ${concejo} WHERE denominacion = ?)`,
    //   [
    //     denominacion,
    //     X,
    //     Y,
    //     Z,
    //     elipsoide,
    //     huso,
    //     zonaUTM,
    //     hermisferio,
    //     concejo,
    //     latitud,
    //     longitud,
    //   ],
    //   function (err) {
    //     if (err) {
    //       return console.log(err.message);
    //     }
    //   }
    // );
    // Primero, verifica si ya existe un registro con la misma denominacion
    db.get(
      `SELECT 1 FROM ${concejo} WHERE denominacion = ?`,
      [denominacion],
      (err, row) => {
        if (err) {
          return console.error("Error al ejecutar la consulta:", err.message);
        }

        // Si row no está definido, significa que no se encontró ningún registro con la misma denominacion
        if (!row) {
          // Ejecuta la inserción
          db.run(
            `INSERT INTO ${concejo} (denominacion, X, Y, Z, elipsoide, huso, zonaUTM, hermisferio, concejo, latitud, longitud) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              denominacion,
              X,
              Y,
              Z,
              elipsoide,
              huso,
              zonaUTM,
              hermisferio,
              concejo,
              latitud,
              longitud,
            ],
            function (err) {
              if (err) {
                return console.error(
                  "Error al insertar el registro:",
                  err.message
                );
              }
              console.log("Registro insertado correctamente.");
            }
          );
        } else {
          // Si ya existe un registro con la misma denominacion, muestra un mensaje de error
          console.error("Ya existe un registro con la misma denominación.");
        }
      }
    );
  },
  getCuevas() {
    return new Promise((resolve, reject) => {
      db.all(
        "SELECT denominacion, longitud, latitud FROM cangasdeOnís",
        (error, rows) => {
          if (error) {
            console.error("DB Error: ", error);
            return reject(error);
          }

          console.log(rows);
          return resolve(rows);
        }
      );
    });
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
