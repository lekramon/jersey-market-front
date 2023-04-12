import { useEffect, useState } from 'react'
import './styles.css'
import axios from 'axios'
import { useParams } from 'react-router-dom';
import { NavLink } from 'react-router-dom';

interface User  {
  name: string;
  email: string;
  status: string;
  userGroup: string;
  id: number;
}

export const UserList = () => {
  

  const [users, setUsers] = useState<User[]>([])

  async function retrieveUsers () {
    try {
      const {data}  = await axios.get("https://jersey-market-api-production.up.railway.app/user/list")
      setUsers(data)
      } catch(e) {
      console.log(e)
    }
  }

  useEffect(() => {
    retrieveUsers()
  }, [])

  return (
    <div className="container">
      <h1>Funcionários</h1>
      <table>
      
      <thead>
        <tr>
          <th>ID</th>
          <th>Nome</th>
          <th>E-mail</th>
          <th>Status</th>
          <th>Grupo</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {users.map(users => (
          <tr key={users.id}>
            <td>{users.id}</td>
            <td><NavLink to={`/admin/user/${users.id}/edit`} >{users.name}</NavLink></td>
            <td>{users.email}</td>
            <td>{users.userGroup}</td>
            <td>{users.status}</td>
            <td><NavLink to={`/admin/user/${users.id}/edit`} >Editar</NavLink></td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  )
}
