import ShopList from "@/components/ShopList"
import FilterBanner from "@/components/Filterbanner"

const ShopPage = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-emerald-800 mb-3">Our Massage Shops</h1>
          <p className="text-emerald-600 max-w-3xl mx-auto text-lg">
            Discover our massage locations for your relaxation journey
          </p>
        </div>
        
        {/* Add the filter banner component */}
        <FilterBanner />
        
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-emerald-100">
          <ShopList />
        </div>
      </div>
    </main>
  )
}

export default ShopPage