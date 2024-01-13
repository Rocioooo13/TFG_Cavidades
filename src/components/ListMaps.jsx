import React from "react";
import { useState } from "react";
import api from "../api";

export const ListMaps = () => {
  const [map, setMap] = useState(api.getMap(2)[0]);
  //   if (map.length > 0) {
  //     console.log(map[0]);
  //   }

  return <div>ListMaps</div>;
};

// export default ListMaps
