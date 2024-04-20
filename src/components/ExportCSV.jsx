// import React, { useState } from "react";
// import { CSVLink } from "react-csv";
// import api from "../api";

// export const ExportCSV = () => {
//   //Me creo las cabeceras del excel.
//   const headers = [
//     { label: "Denominacion", key: "denominacion" },
//     { label: "X", key: "X" },
//     { label: "Y", key: "Y" },
//     { label: "Z", key: "Z" },
//     { label: "Elipsoide", key: "elipsoide" },
//     { label: "Huso", key: "huso" },
//     { label: "Zona UTM", key: "zonaUTM" },
//     { label: "Hemisferio", key: "hemisferio" },
//     { label: "Concejo", key: "concejo" },
//     { label: "Latitud", key: "latitud" },
//     { label: "Longitud", key: "longitud" },
//   ];

//   //Obtengo las cuevas y las guardo en la variable cuevas
//   const [cuevas, setCuevas] = useState([]);
//   const loadCuevas = async () => {
//     const cuevas = await api.getCuevas();
//     setCuevas(cuevas ?? []);
//   };

//   //en CsvReport creo tres variables a las que le doy los valores de cuevas, las cabeceras y el nombre del archivo
//   const csvReport = {
//     data: cuevas,
//     headers: headers,
//     filename: "Cuevas.csv",
//   };

//   //Rellena el archivo y hace la descarga
//   const clicDownload = () => {
//     console.log("Empieza la descarga");
//     const csvData = csvReport.data
//       .map(
//         (item) =>
//           `${item.denominacion},${item.X},${item.Y},${item.Z},${item.elipsoide},${item.huso},${item.zonaUTM},${item.hemisferio},${item.concejo},${item.latitud},${item.longitud}`
//       )
//       .join("\n");
//     const csvContent = `${csvReport.data.headers
//       .map((header) => header.label)
//       .join(",")}\n${csvData}`;
//     const blob = new Blob([csvContent], { type: "text/csv" });
//     const url = window.URL.createObjectURL(blob);
//     window.location.href = url;
//     // const link = document.createElement('a');
//     // link.href = url;
//     // link.setAttribute('download', 'example.csv');
//     // document.body.appendChild(link);
//     // link.click();
//     // document.body.removeChild(link);
//   };
//   // return (
//   //   // <div classname="App">
//   //   //   <h3>Export data to CSV in React - <a href="https://cluemediator.com" target="_blank" rel="noopener noreferrer">Cuevas</a></h3>
//   //   //   <CSVLink {...csvReport}>Export to CSV</CSVLink>
//   //   // </div>
//   //   <div>
//   //     <h1>Download CSV Example</h1>
//   //     <CSVLink data={cuevas} headers={headers} filename={"example.csv"}>
//   //       <button>Download CSV</button>
//   //     </CSVLink>
//   //   </div>
//   // );
// };
