import ServiceList from "@/components/ServiceList"

const ServicesPage = () => {
    return (
        <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-10 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-emerald-800 mb-3">Our Massage Services</h1>
            <p className="text-emerald-600 max-w-3xl mx-auto text-lg">
                Choose Your Relaxation Experience
            </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 border border-emerald-100">
                <ServiceList />
            </div>
        </div>
        </main>
    )
}

export default ServicesPage