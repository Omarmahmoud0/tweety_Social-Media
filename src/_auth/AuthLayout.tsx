import { useUserContext } from "@/context/AuthContext"
import { Outlet , Navigate } from "react-router-dom"

const AuthLayout = () => {
  const {isAuthenticated} = useUserContext()

  return (
    <>
      {
        isAuthenticated ? (
          <Navigate to="/" />
        ) : (
          <>
            <section className="flex flex-1 justify-center items-center flex-col">
              <Outlet />
            </section>

            <img 
              src="/assets/images/pexels-cottonbro-4881650.jpg"
              alt="logo"
              className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat rounded-lg"
            />

          </>
        )
      }
    </>
  )
}

export default AuthLayout