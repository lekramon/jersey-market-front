import axios from 'axios'
import { useEffect, useState } from 'react'
import { UserForm } from '../../../../sections/User/Form'
import { useParams } from 'react-router-dom'
export const UserEdit = () => {

  const { id } = useParams();
  const [user, setUser] = useState()

  const retrieveUser = async () => {
    try {
      const { data } = await axios.get(`https://jersey-market-api-production-1377.up.railway.app/user/id${id}`)
      console.log(data, "User/Id")
      setUser(data)
    } catch (e) {
      console.log(e, "User/Id")
    }
  }

  useEffect(() => {
    retrieveUser();
  }, [])

  return (
    <UserForm isEdit currentUser={user} />
  )
}
