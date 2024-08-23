const sqlite3 = require("sqlite3");

const db = new sqlite3.Database("cavidades.sqlite3");
/*const sqlMapa = `CREATE TABLE IF NOT EXISTS mapas (id  INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,url TEXT)`;
db.run(sqlMapa, function (err) {
  if (err) {
    console.log("Ha habido un error"); //err.message
  }
});*/

module.exports = {
  obtenertablas() {
    return new Promise((resolve, reject) => {
      db.all(" SELECT * FROM listaCapas", (error, rows) => {
        if (error) {
          console.error("DB Error: ", error);
          return reject(error);
        }

        // console.log(rows);
        return resolve(rows);
      });
    });
  },
  createTable(concejo) {
    return new Promise((resolve, reject) => {
      const sql = `CREATE TABLE IF NOT EXISTS ${concejo} (id  INTEGER PRIMARY KEY AUTOINCREMENT,denominacion TEXT, X TEXT, Y TEXT, Z TEXT, elipsoide TEXT, huso TEXT, zonaUTM TEXT, hemisferio TEXT, concejo TEXT, latitud TEXT, longitud TEXT)`;
      db.run(sql, function (err) {
        if (err) {
          console.log("DB error: "); //err.message
          return reject(err);
        } else {
          return resolve();
        }
      });
    });
  },
  createListaCapas() {
    const sql = `CREATE TABLE IF NOT EXISTS listaCapas (id  INTEGER PRIMARY KEY AUTOINCREMENT,nombre TEXT)`;
    return db.run(sql);
  },
  añadirCapaListaCapas(conc2) {
    db.get(`SELECT 1 FROM listaCapas WHERE nombre = ?`, [conc2], (err, row) => {
      if (err) {
        return console.error("Error al ejecutar la consulta:", err.message);
      }
      // Si row no está definido, significa que no se encontró ningún registro con la misma denominacion
      if (!row) {
        // Ejecuta la inserción
        db.run(
          `INSERT INTO listaCapas (nombre) 
    VALUES (?)`,
          [conc2],
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
        console.error("Ya existe esta tabla en la lista de tablas.");
      }
    });
  },

  getMaps() {
    return new Promise((resolve, reject) => {
      db.all("SELECT * FROM mapas", (error, rows) => {
        if (error) {
          console.error("DB Error: ", error);
          return reject(error);
        }

        // console.log(rows);
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

        // console.log(row);
        return resolve(row.url);
      });
    });
    // return db.all("SELECT url FROM mapas WHERE id = ?", [id]);
  },
  addMap(nombre, url) {
    return new Promise((resolve, reject) => {
      db.get(`SELECT 1 FROM mapas WHERE url = ?`, [url], (err, row) => {
        if (err) {
          console.error("Error al ejecutar la consulta:", err.message);
          return reject(err);
        }
        // Si row no está definido, significa que no se encontró ningún registro con la misma denominacion
        if (!row) {
          // Ejecuta la inserción
          db.run(
            `INSERT INTO mapas (name, url) 
    VALUES (?,?)`,
            [nombre, url],
            function (err) {
              if (err) {
                console.error("Error al insertar el registro:", err.message);
                return reject(err);
              }
              console.log("Registro insertado correctamente.");
              return resolve();
            }
          );
        } else {
          // Si ya existe un registro con la misma denominacion, muestra un mensaje de error
          console.error(
            "Ya existe este mapa en la lista de propiedades de mapas."
          );
          return reject();
        }
      });
    });
  },

  createCueva(
    denominacion,
    X,
    Y,
    Z,
    elipsoide,
    huso,
    zonaUTM,
    hemisferio,
    concejo,
    latitud,
    longitud
    //archivo
  ) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT 1 FROM ${concejo} WHERE denominacion = ?`,
        [denominacion],
        (err, row) => {
          if (err) {
            console.error("Error al ejecutar la consulta:", err.message);
            reject(err);
          }

          // Si row no está definido, significa que no se encontró ningún registro con la misma denominacion
          if (!row) {
            // Ejecuta la inserción
            db.run(
              //`INSERT INTO ${concejo} (denominacion, X, Y, Z, elipsoide, huso, zonaUTM, hemisferio, concejo, latitud, longitud, archivo)
              // VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`
              `INSERT INTO ${concejo} (denominacion, X, Y, Z, elipsoide, huso, zonaUTM, hemisferio, concejo, latitud, longitud) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
              [
                denominacion,
                X,
                Y,
                Z,
                elipsoide,
                huso,
                zonaUTM,
                hemisferio,
                concejo,
                latitud,
                longitud,
                //archivo,
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
            resolve();
          } else {
            // Si ya existe un registro con la misma denominacion, muestra un mensaje de error
            console.error("Ya existe un registro con la misma denominación.");
            resolve();
          }
        }
      );
    });
  },
  // getCuevas(concejo) {
  //   return new Promise((resolve, reject) => {
  //     db.all(`SELECT * FROM ${concejo}`, (error, rows) => {
  //       if (error) {
  //         console.error("DB Error: ", error);
  //         return reject(error);
  //       }
  //       console.log(rows);
  //       return resolve(rows);
  //     });
  //   });
  // },
  getCuevas() {
    return new Promise((resolve, reject) => {
      db.all(`SELECT * FROM pruebadeImportacion`, (error, rows) => {
        if (error) {
          console.error("DB Error: ", error);
          return reject(error);
        }
        // console.log(rows);
        return resolve(rows);
      });
    });
  },

  getCuevas2(concejo) {
    return new Promise((resolve, reject) => {
      if (!concejo) {
        return reject("El concejo no esta definido");
      }

      const sql = `SELECT * FROM ${concejo}`;
      db.all(sql, (error, rows) => {
        if (error) {
          console.error("DB Error: ", error);
          return reject(error);
        }
        return resolve(rows);
      });
    });
  },

  getLayers(concejo) {
    return new Promise((resolve, reject) => {
      if (!concejo) {
        return reject("El concejo no esta definido");
      }

      const sql = `SELECT * FROM ${concejo}`;
      db.all(sql, (error, rows) => {
        if (error) {
          console.error("DB Error: ", error);
          return reject(error);
        }
        return resolve(rows);
      });
    });
  },

  getCuevas3(concejo) {
    return new Promise((resolve, reject) => {
      if (!concejo) {
        return reject();
      }

      const sql = `SELECT * FROM ${concejo}`;
      db.all(sql, (error, rows) => {
        if (error) {
          console.error("DB Error: ", error);
          return reject(error);
        }
        return resolve(rows);
      });
    });
  },

  /*getCueva(denominacion) {
    return new Promise((resolve, reject) => {
      db.get("SELECT * FROM mapas WHERE denominacion = ?", [denominacion], (error, rows) => {
        if (error) {
          console.error("DB Error: ", error);
          return reject(error);
        }

        console.log(rows);
        return resolve(rows);
      });
    });
    // return db.all("SELECT url FROM mapas WHERE id = ?", [id]);
  },*/

  //A esta funcion tengo que pasarle el nombre del concejo para que me busque en la tabla correspondiente
  // updateCueva(denominacion, id, denominacionAnterior) {

  //   return new Promise((resolve, _) => {
  //     // console.log("Entro en updateCueva");
  //     db.run(
  //       "UPDATE concejodePrueba SET denominacion = ? WHERE id IS ? AND denominacion IS ?",
  //       [denominacion, id, denominacionAnterior]
  //     );
  //     resolve();
  //   });
  // },

  updateCueva(
    concejo,
    denominacion,
    xDelForm,
    yDelForm,
    zDelForm,
    elip,
    huso,
    zonautm,
    lat,
    long,
    id,
    denominacionAnterior
  ) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT 1 FROM ${concejo} WHERE denominacion = ?`,
        [denominacionAnterior],
        (err, row) => {
          if (err) {
            console.error("Error al ejecutar la consulta:", err.message);
            reject(err);
          }
          console.error("He hecho el get y devuelvo, ", row);
          if (row) {
            // Ejecuta la inserción
            console.log("Row no esta vacío");
            db.run(
              `UPDATE ${concejo} SET denominacion = ?, X = ?,Y = ?, Z= ?, latitud= ?, longitud= ? WHERE id IS ?`,
              [denominacion, xDelForm, yDelForm, zDelForm, lat, long, id],
              function (err) {
                if (err) {
                  return console.error(
                    "Error al insertar el registro:",
                    err.message
                  );
                }
                console.log("Registro actualizado correctamente.");
              }
            );
            resolve();
          } else {
            // Si ya existe un registro con la misma denominacion, muestra un mensaje de error
            console.error("No existe un registro con la misma denominación.");
            resolve();
          }
        }
      );
    });
  },
  // return new Promise((resolve, reject) => {
  //   db.get(
  //     `SELECT 1 FROM ${concejo} WHERE denominacion = ?`,
  //     [denominacion],
  //     (err, row) => {
  //       if (err) {
  //         console.error("Error al ejecutar la consulta:", err.message);
  //         reject(err);
  //       }

  //       // Si row no está definido, significa que no se encontró ningún registro con la misma denominacion
  //       if (!row) {
  //         // Ejecuta la inserción
  //         db.run(
  //           //`INSERT INTO ${concejo} (denominacion, X, Y, Z, elipsoide, huso, zonaUTM, hemisferio, concejo, latitud, longitud, archivo)
  //           // VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)`
  //           `INSERT INTO ${concejo} (denominacion, X, Y, Z, elipsoide, huso, zonaUTM, hemisferio, concejo, latitud, longitud)
  //     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  //           [
  //             denominacion,
  //             X,
  //             Y,
  //             Z,
  //             elipsoide,
  //             huso,
  //             zonaUTM,
  //             hemisferio,
  //             concejo,
  //             latitud,
  //             longitud,
  //             //archivo,
  //           ],
  //           function (err) {
  //             if (err) {
  //               return console.error(
  //                 "Error al insertar el registro:",
  //                 err.message
  //               );
  //             }
  //             console.log("Registro insertado correctamente.");
  //           }
  //         );
  //         resolve();
  //       } else {
  //         // Si ya existe un registro con la misma denominacion, muestra un mensaje de error
  //         console.error("Ya existe un registro con la misma denominación.");
  //         resolve();
  //       }
  //     }
  //   );
  // });

  //Elimina una cueva
  deleteCueva(nombreConcejo, id) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM  ${nombreConcejo} WHERE id = ?`,
        [id],
        function (err) {
          if (err) {
            console.error("Error al eliminar el registro:", err.message);
            reject(err);
          } else {
            console.log("Registro eliminado correctamente.");
            resolve();
          }
        }
      );
    });
  },

  //Elimina una capa entera
  deleteCapa(nombreConcejo) {
    return new Promise((resolve, reject) => {
      db.run(`DROP TABLE ${nombreConcejo}`, function (err) {
        if (err) {
          console.error("Error al eliminar la capa:", err.message);
          reject(err);
        } else {
          console.log("Capa eliminada correctamente.");
          resolve();
        }
      });
    });
  },

  //Elimina una cueva de la lista de capas
  deleteCuevaListaCapas(nombreConcejo) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM  listaCapas WHERE nombre = ?`,
        [nombreConcejo],
        function (err) {
          if (err) {
            console.error("Error al eliminar el registro:", err.message);
            reject(err);
          } else {
            console.log("Capa eliminada correctamente de la lista de capas.");
            resolve();
          }
        }
      );
    });
  },

  // CREAR CONTORNOS
  createContourPropsTable() {
    return new Promise((resolve, reject) => {
      const sql = `CREATE TABLE IF NOT EXISTS listContoursProps (id  INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, color TEXT)`;
      db.run(sql, function (err) {
        if (err) {
          console.log("DB error: "); //err.message
          return reject(err);
        } else {
          return resolve();
        }
      });
    });
  },
  addContourProps(nombre, color) {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT 1 FROM listContoursProps WHERE nombre = ?`,
        [nombre],
        (err, row) => {
          if (err) {
            console.error("Error al ejecutar la consulta:", err.message);
            return reject(err);
          }
          // Si row no está definido, significa que no se encontró ningún registro con la misma denominacion
          if (!row) {
            // Ejecuta la inserción
            db.run(
              `INSERT INTO listContoursProps (nombre, color) 
    VALUES (?,?)`,
              [nombre, color],
              function (err) {
                if (err) {
                  console.error("Error al insertar el registro:", err.message);
                  return reject(err);
                }
                console.log("Registro insertado correctamente.");
                return resolve();
              }
            );
          } else {
            // Si ya existe un registro con la misma denominacion, muestra un mensaje de error
            console.error(
              "Ya existe este contorno en la lista de propiedades de contornos."
            );
            return reject();
          }
        }
      );
    });
  },
  //Obtener contornos
  obtenerContornos() {
    return new Promise((resolve, reject) => {
      db.all(" SELECT * FROM listContoursProps", (error, rows) => {
        if (error) {
          console.error("DB Error: ", error);
          return reject(error);
        }

        // console.log(rows);
        return resolve(rows);
      });
    });
  },
  createContourTable(nombre) {
    return new Promise((resolve, reject) => {
      const sql = `CREATE TABLE IF NOT EXISTS ${nombre} (id  INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, latitud TEXT, longitud TEXT)`;
      db.run(sql, function (err) {
        if (err) {
          console.log("DB error: "); //err.message
          return reject(err);
        } else {
          return resolve();
        }
      });
    });
  },

  //No se si para crear la tabla del contorno deberia añadir una columna identificativa como nombre????????
  // addContour(nombre, coordenadas) {
  //   return new Promise((resolve, reject) => {
  //     for (const coordenada of coordenadas) {
  //       db.run(
  //         `INSERT INTO ${nombre} (nombre, latitud, longitud)
  //   VALUES (?,?,?)`,
  //         [nombre, coordenada[0], coordenada[1]],
  //         function (err) {
  //           if (err) {
  //             console.error("Error al insertar el registro:", err.message);
  //             return reject(err);
  //           }
  //           console.log("Registro insertado correctamente.");
  //           return resolve();
  //         }
  //       );
  //     }
  //   });
  // },
  addContour(nombre, coordenada) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO ${nombre} (nombre, latitud, longitud) 
    VALUES (?,?,?)`,
        [nombre, coordenada[1], coordenada[0]],
        function (err) {
          if (err) {
            console.error("Error al insertar el registro:", err.message);
            return reject(err);
          }
          console.log("Registro insertado correctamente.");
          return resolve();
        }
      );
    });
  },
  addContourImport(nombre, coordenada) {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO ${nombre} (nombre, latitud, longitud) 
    VALUES (?,?,?)`,
        [nombre, coordenada[0], coordenada[1]],
        function (err) {
          if (err) {
            console.error("Error al insertar el registro:", err.message);
            return reject(err);
          }
          console.log("Registro insertado correctamente.");
          return resolve();
        }
      );
    });
  },

  getPolygons(nombre) {
    return new Promise((resolve, reject) => {
      if (!nombre) {
        return reject("El contorno no esta definido");
      }

      const sql = `SELECT * FROM ${nombre}`;
      db.all(sql, (error, rows) => {
        if (error) {
          console.error("DB Error: ", error);
          return reject(error);
        }
        return resolve(rows);
      });
    });
  },
  getPolygons2(nombre) {
    return new Promise((resolve, reject) => {
      if (!nombre) {
        return reject("El contorno no esta definido");
      }

      const sql = `SELECT latitud,longitud FROM ${nombre}`;
      db.all(sql, (error, rows) => {
        if (error) {
          console.error("DB Error: ", error);
          return reject(error);
        }
        return resolve(rows);
      });
    });
  },
  getColor(nombre) {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT * FROM listContoursProps WHERE nombre = ?",
        [nombre],
        (error, row) => {
          if (error) {
            console.error("DB Error: ", error);
            return reject(error);
          }
          return resolve(row.color);
        }
      );
    });
    // return db.all("SELECT url FROM mapas WHERE id = ?", [id]);
  },
  deleteContorno(nombre) {
    return new Promise((resolve, reject) => {
      db.run(`DROP TABLE ${nombre}`, function (err) {
        if (err) {
          console.error("Error al eliminar el contorno:", err.message);
          reject(err);
        } else {
          console.log("Contorno eliminado correctamente.");
          resolve();
        }
      });
    });
  },
  //Elimina una cueva de la lista de capas
  deleteCuevaListaContornos(nombre) {
    return new Promise((resolve, reject) => {
      db.run(
        `DELETE FROM listContoursProps WHERE nombre = ?`,
        [nombre],
        function (err) {
          if (err) {
            console.error("Error al eliminar el registro:", err.message);
            reject(err);
          } else {
            console.log(
              "Contorno eliminado correctamente de la lista de contornos."
            );
            resolve();
          }
        }
      );
    });
  },
};
