import React, { useEffect, useState } from "react";
import api, { createTable, createUser } from "./api";

const UsersList = () => {
  const [users, setUsers] = useState([]);

  const loadUsers = async () => {
    const users = await api.getUsers();
    setUsers(users ?? []);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div>
      <h1>Usuarios</h1>
      <button onClick={createTable}>Crear tabla</button>

      <button onClick={createUser}> Añadir usuario</button>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo electrónico</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((user, index) => (
            <tr key={index}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
