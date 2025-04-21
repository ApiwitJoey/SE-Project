import { Service } from "../../interfaces"

const ServiceCard = ({service, isEditable, deleteOnclick, editOnclick} : {service: Service, isEditable:boolean, deleteOnclick?:Function, editOnclick?:Function}) => {
  return (
    <div
        key={service._id}
        className="bg-emerald-50 rounded-lg p-5 border border-emerald-100 hover:shadow-md transition-shadow"
    >
        <h3 className="text-xl font-medium text-emerald-800 mb-2">
            {service.name}
        </h3>
        <p className="text-emerald-700 mb-3">
            {service.details}
        </p>
        <p className="text-emerald-600 font-bold">
            ฿{service.price}
        </p>
        <p className="text-emerald-600 font-bold mb-3">
            {service.type}
        </p>

        {
            isEditable && deleteOnclick && editOnclick && (
                <div className="mt-auto ml-auto flex flex-row gap-2">
                    <button onClick={(e) => {editOnclick()}} className="px-5 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors flex items-center">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                    </button>
                    
                    <button onClick={(e) => {deleteOnclick(service._id)}} className="flex w-fit px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors">
                        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M9 7h6m-7 0h8a1 1 0 001-1V5a1 1 0 00-1-1H8a1 1 0 00-1 1v1z" />
                        </svg>
                        Delete
                    </button>
                </div>
            )
        }
    </div>
  )
}

export default ServiceCard