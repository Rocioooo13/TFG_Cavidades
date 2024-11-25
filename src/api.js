const sqlite3 = require("sqlite3");
const db = new sqlite3.Database("cavidades.sqlite3");

// const sqlMapa = `CREATE TABLE IF NOT EXISTS mapas (id  INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,url TEXT)`;
// db.run(sqlMapa, function (err) {
//   if (err) {
//     console.log("Ha habido un error"); //err.message
//   }
// });

function addNameOfLayerOrContour(nombre, type) {
  return nombre + "_" + type;
}

function removeArrayNameOfLayersOrContours(rows) {
  for (let index = 0; index < rows.length; index++) {
    const row = rows[index];
    row.nombre = removeLayerOrContourName(row.nombre);
  }
}

function removeLayerOrContourName(nombre) {
  if (nombre.includes("_layer")) {
    return nombre.replace("_layer", "");
  }

  if (nombre.includes("_contour")) {
    return nombre.replace("_contour", "");
  }

  return nombre;
}

module.exports = {
  obtenertablas() {
    return new Promise((resolve, reject) => {
      db.all(" SELECT * FROM listaCapas", (error, rows) => {
        if (error) {
          console.error("DB Error: ", error);
          return reject(error);
        }

        // Quitar los nombres con _
        removeArrayNameOfLayersOrContours(rows);
        return resolve(rows);
      });
    });
  },
  createTable(concejo) {
    return new Promise((resolve, reject) => {
      const nombreLayer = addNameOfLayerOrContour(concejo, "layer");
      const sql = `CREATE TABLE IF NOT EXISTS ${nombreLayer} (id  INTEGER PRIMARY KEY AUTOINCREMENT,denominacion TEXT, X TEXT, Y TEXT, Z TEXT, elipsoide TEXT, huso TEXT, zonaUTM TEXT, hemisferio TEXT, concejo TEXT, latitud TEXT, longitud TEXT, archivo TEXT)`;
      db.run(sql, function (err) {
        if (err) {
          alert("Error al crear la capa. Detalle del error: ", err.message);
          console.log("DB error: "); //err.message
          return reject(err);
        } else {
          return resolve();
        }
      });
    });
  },
  createListaCapas() {
    return new Promise((resolve, reject) => {
      const sql = `CREATE TABLE IF NOT EXISTS listaCapas (id  INTEGER PRIMARY KEY AUTOINCREMENT,nombre TEXT)`;
      return db.run(sql, function (err) {
        if (err) {
          console.log("Ha habido un error: ", err.message);
          return reject(err);
        } else {
          return resolve();
        }
      });
    });
  },
  añadirCapaListaCapas(conc2) {
    const nombreCapa = addNameOfLayerOrContour(conc2, "layer");
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
            // console.log("Registro insertado correctamente.");
          }
        );
      } else {
        // Si ya existe un registro con la misma denominacion, muestra un mensaje de error
      }
    });
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
                alert(
                  "Error al añadir el mapa. Detalle del error: ",
                  err.message
                );
                console.error("Error al insertar el registro:", err.message);
                return reject(err);
              }
              alert("Mapa registrado correctamente.");
              console.log("Registro insertado correctamente.");
              return resolve();
            }
          );
        } else {
          // Si ya existe un registro con la misma denominacion, muestra un mensaje de error
          alert("Ya existe un mapa con esa url en la base de datos.");
          console.error(
            "Ya existe este mapa en la lista de propiedades de mapas."
          );
          return reject();
        }
      });
    });
  },

  createMapTable() {
    return new Promise((resolve, reject) => {
      const sqlMapa = `CREATE TABLE IF NOT EXISTS mapas (id  INTEGER PRIMARY KEY AUTOINCREMENT,name TEXT,url TEXT)`;
      db.run(sqlMapa, function (err) {
        if (err) {
          console.log("Ha habido un error: ", err.message);
          return reject(err);
        } else {
          return resolve();
        }
      });
    });
  },

  getMaps() {
    return new Promise((resolve, reject) => {
      // TODO -> Comprobar
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
        return resolve(row?.url ?? null);
      });
    });
    // return db.all("SELECT url FROM mapas WHERE id = ?", [id]);
  },

  deleteMapaListaMapas(id) {
    return new Promise((resolve, reject) => {
      // const nombreCapa = addNameOfLayerOrContour(nombreConcejo, "layer");
      db.run(`DELETE FROM mapas WHERE id = ?`, [id], function (err) {
        if (err) {
          alert("Error al eliminar la cueva. Detalle del error: ", err.message);
          console.error("Error al eliminar el registro:", err.message);
          reject(err);
        } else {
          alert("El mapa se ha eliminado correctamente");
          console.log("Registro eliminado correctamente.");
          resolve();
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
    longitud,
    archivo
  ) {
    return new Promise((resolve, reject) => {
      const nombreCapa = addNameOfLayerOrContour(concejo, "layer");
      db.get(
        `SELECT 1 FROM ${nombreCapa} WHERE denominacion = ?`,
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
              `INSERT INTO ${nombreCapa} (denominacion, X, Y, Z, elipsoide, huso, zonaUTM, hemisferio, concejo, latitud, longitud, archivo) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
                archivo,
              ],
              function (err) {
                if (err) {
                  // alert(
                  //   "Error al insertar la cueva. Detalle del error: ",
                  //   err.message
                  // );
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
            alert("Ya existe una cueva con esa denominación en esta capa");
            console.error("Ya existe un registro con la misma denominación.");
            resolve();
          }
        }
      );
    });
  },

  getCuevasExportacion(concejo) {
    return new Promise((resolve, reject) => {
      if (!concejo) {
        return reject("El concejo no esta definido");
      }
      const nombreCapa = addNameOfLayerOrContour(concejo, "layer");
      db.all(`SELECT * FROM ${nombreCapa}`, (error, rows) => {
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

      const nombreCapa = addNameOfLayerOrContour(concejo, "layer");
      const sql = `SELECT * FROM ${nombreCapa}`;
      db.all(sql, (error, rows) => {
        if (error) {
          console.error("DB Error: ", error);
          return reject(error);
        }
        return resolve(rows);
      });
    });
  },

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
    archivo,
    id,
    denominacionAnterior
  ) {
    return new Promise((resolve, reject) => {
      const nombreCapa = addNameOfLayerOrContour(concejo, "layer");
      db.get(
        `SELECT 1 FROM ${nombreCapa} WHERE denominacion = ?`,
        [denominacionAnterior],
        (err, row) => {
          if (err) {
            console.error("Error al ejecutar la consulta:", err.message);
            reject(err);
          }
          if (row) {
            // Ejecuta la inserción
            db.run(
              `UPDATE ${nombreCapa} SET denominacion = ?, X = ?,Y = ?, Z= ?, latitud= ?, longitud= ?, archivo = ? WHERE id IS ?`,
              [
                denominacion,
                xDelForm,
                yDelForm,
                zDelForm,
                lat,
                long,
                archivo,
                id,
              ],
              function (err) {
                if (err) {
                  alert(
                    "Error al actualizar la cueva. Detalle del error: ",
                    err.message
                  );
                  // return console.error(
                  //   "Error al actualizar el registro:",
                  //   err.message
                  // );
                }
                alert("Cueva actualizada correctamente ");
                //console.log("Registro actualizado correctamente.");
              }
            );
            resolve();
          } else {
            // Si ya existe un registro con la misma denominacion, muestra un mensaje de error
            alert("No existe un registro con esa denominación");
            console.error("No existe un registro con la misma denominación.");
            resolve();
          }
        }
      );
    });
  },

  //Elimina una cueva
  deleteCueva(nombreConcejo, id) {
    return new Promise((resolve, reject) => {
      const nombreCapa = addNameOfLayerOrContour(nombreConcejo, "layer");
      db.run(`DELETE FROM  ${nombreCapa} WHERE id = ?`, [id], function (err) {
        if (err) {
          alert("Error al eliminar la cueva. Detalle del error: ", err.message);
          console.error("Error al eliminar el registro:", err.message);
          reject(err);
        } else {
          alert("La cueva se ha eliminado correctamente");
          console.log("Registro eliminado correctamente.");
          resolve();
        }
      });
    });
  },

  //Elimina una capa entera
  deleteCapa(nombreConcejo) {
    return new Promise((resolve, reject) => {
      const nombreCapa = addNameOfLayerOrContour(nombreConcejo, "layer");
      db.run(`DROP TABLE ${nombreCapa}`, function (err) {
        if (err) {
          alert("Error al eliminar la capa. Detalle del error: ", err.message);
          console.error("Error al eliminar la capa:", err.message);
          reject(err);
        } else {
          alert("La capa se ha eliminado correctamente.");
          console.log("Capa eliminada correctamente.");
          resolve();
        }
      });
    });
  },

  //Elimina una capa de la lista de capas
  deleteCuevaListaCapas(nombreConcejo) {
    return new Promise((resolve, reject) => {
      // const nombreCapa = addNameOfLayerOrContour(nombreConcejo, "layer");
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
      // const nombreContorno = addNameOfLayerOrContour(nombre, "contour");
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

        // Quitar los nombres con _
        removeArrayNameOfLayersOrContours(rows);
        return resolve(rows);
      });
    });
  },
  createContourTable(nombre) {
    return new Promise((resolve, reject) => {
      const nombreContorno = addNameOfLayerOrContour(nombre, "contour");
      const sql = `CREATE TABLE IF NOT EXISTS ${nombreContorno} (id  INTEGER PRIMARY KEY AUTOINCREMENT, nombre TEXT, latitud TEXT, longitud TEXT)`;
      db.run(sql, function (err) {
        if (err) {
          alert("Error al crear el contorno. Detalle del error: ", err.message);
          console.log("DB error: "); //err.message
          return reject(err);
        } else {
          return resolve();
        }
      });
    });
  },

  addContour(nombre, coordenada) {
    return new Promise((resolve, reject) => {
      const nombreContorno = addNameOfLayerOrContour(nombre, "contour");
      db.run(
        `INSERT INTO ${nombreContorno} (nombre, latitud, longitud) 
    VALUES (?,?,?)`,
        [nombre, coordenada[1], coordenada[0]],
        function (err) {
          if (err) {
            // alert(
            //   "Error al añadir las coordenadas al contorno. Detalle del error: ",
            //   err.message
            // );
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
      const nombreContorno = addNameOfLayerOrContour(nombre, "contour");
      db.run(
        `INSERT INTO ${nombreContorno} (nombre, latitud, longitud) 
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

      const nombreContorno = addNameOfLayerOrContour(nombre, "contour");
      const sql = `SELECT * FROM ${nombreContorno}`;
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

      const nombreContorno = addNameOfLayerOrContour(nombre, "contour");
      const sql = `SELECT latitud,longitud FROM ${nombreContorno}`;
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
      // const nombreContorno = addNameOfLayerOrContour(nombre, "contour");
      db.get(
        "SELECT * FROM listContoursProps WHERE nombre = ?",
        [nombre],
        (error, row) => {
          if (error) {
            console.error("DB Error: ", error);
            return reject(error);
          }
          return resolve(row?.color ?? null);
        }
      );
    });
    // return db.all("SELECT url FROM mapas WHERE id = ?", [id]);
  },
  deleteContorno(nombre) {
    return new Promise((resolve, reject) => {
      const nombreContorno = addNameOfLayerOrContour(nombre, "contour");
      db.run(`DROP TABLE ${nombreContorno}`, function (err) {
        if (err) {
          alert(
            "Error al eliminar el contorno. Detalle del error: ",
            err.message
          );
          console.error("Error al eliminar el contorno:", err.message);
          reject(err);
        } else {
          alert("Contorno eliminado correctamente.");
          console.log("Contorno eliminado correctamente.");
          resolve();
        }
      });
    });
  },
  //Elimina una cueva de la lista de capas
  deleteCuevaListaContornos(nombre) {
    return new Promise((resolve, reject) => {
      const nombreContorno = addNameOfLayerOrContour(nombre, "contour");
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
