import { MenuHorizontal } from "./MenuHorizontal";
import { Map } from "./Map";
import { ListMaps } from "./ListMaps";

export const App = () => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <div style={{ width: "100%", height: "100%" }}>
        <MenuHorizontal />
      </div>

      <Map />
      <ListMaps />
    </div>
  );
};
