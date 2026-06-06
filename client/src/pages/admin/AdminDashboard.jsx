import { Link } from "react-router-dom"

function AdminDashboard() {
  return (
    <div className="mt-20 w-full h-full flex items-center justify-center">
      <div>
        <header className=" text-2xl font-bold">
          <h1 className="font-bold text-center">Admin Dashboard</h1>
          <nav className="mt-4 flex justify-start border-2 border-gray-300 bg-gradient-to-bl from-gray-100 to-gray-200 w-fit h-full p-5">
            <ul>
              <li className="border-b-2 border-gray-300 pt-2">
                <Link to="/admin/products">Products</Link>
              </li>
              <li className="border-b-2 border-gray-300 pt-2">
                <Link to="/admin/users">Users</Link>
              </li>
              <li className="border-b-2 border-gray-300 pt-2">
                <Link to="/admin/products/add">Add Product</Link>
              </li>
            </ul>
          </nav>
        </header>
      </div>
    </div>

  )
}
export default AdminDashboard