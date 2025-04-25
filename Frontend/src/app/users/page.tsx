import UserCart from "@/components/UserCart"

const UserPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-10 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-emerald-800 mb-2">User Management</h1>
          <p className="text-emerald-600 max-w-2xl mx-auto">
            Manage all registered users, view their details, and perform administrative actions
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 border border-emerald-100">
          <UserCart/>
        </div>
      </div>
    </main>
  )
}

export default UserPage