'use client'
import { FilledInput, FormControl, InputAdornment, InputLabel, TextField } from "@mui/material"
import { useState } from "react";

const EditShopServiceForm = ({ onSubmit } : { onSubmit: Function }) => {

    const [serviceName, setServiceName] = useState("");
    const [price, setPrice] = useState<string>("");
    const [detail, setDetail] = useState("")

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 border border-emerald-100 my-6">
            <h1 className="text-2xl font-bold text-emerald-800">Add New Sevice</h1>

            <div className="h-1 w-full bg-emerald-500 rounded mb-4 mt-1"></div>

            <form className="space-y-6">
                <div>
                    <label className="block text-emerald-700 font-medium mb-2">
                        Fill out the new service's information:
                    </label>
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full">
                        <TextField
                            id="service-name"
                            label="Service Name"
                            variant="outlined"
                            fullWidth
                            value={serviceName}
                            onChange={(e) => setServiceName(e.target.value)}
                            sx={{
                                flex: 1,
                                bgcolor: "white",
                                color: "emerald.900",
                                "& .MuiInputBase-root": {
                                color: "#064e3b", // emerald-900
                                bgcolor: "#ffffff",
                                },
                                "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#d1fae5", // default border (emerald-100)
                                },
                                "&:hover fieldset": {
                                    borderColor: "#10b981", // emerald-500 on hover
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#047857", // emerald-700 on focus
                                },
                                },
                                "& .MuiInputLabel-root": {
                                color: "#065f46", // label color
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                color: "#047857", // label color when focused (emerald-700)
                                },
                                py: 1, // padding on the y-axis
                            }}
                        />
                        <TextField
                            id="detail"
                            label="Detail"
                            variant="outlined"
                            fullWidth
                            value={detail}
                            onChange={(e) => setDetail(e.target.value)}
                            sx={{
                                flex: 1,
                                bgcolor: "white",
                                color: "emerald.900",
                                "& .MuiInputBase-root": {
                                color: "#064e3b", // emerald-900
                                bgcolor: "#ffffff",
                                },
                                "& .MuiOutlinedInput-root": {
                                "& fieldset": {
                                    borderColor: "#d1fae5", // default border (emerald-100)
                                },
                                "&:hover fieldset": {
                                    borderColor: "#10b981", // emerald-500 on hover
                                },
                                "&.Mui-focused fieldset": {
                                    borderColor: "#047857", // emerald-700 on focus
                                },
                                },
                                "& .MuiInputLabel-root": {
                                color: "#065f46", // label color
                                },
                                "& .MuiInputLabel-root.Mui-focused": {
                                color: "#047857", // label color when focused (emerald-700)
                                },
                                py: 1, // padding on the y-axis
                            }}
                        />
                    </div>
                    <FormControl fullWidth sx={{ mt: 2 }} variant="filled">
                        <InputLabel htmlFor="filled-adornment-amount">Price</InputLabel>
                        <FilledInput
                            id="filled-adornment-amount"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)} // Convert to number
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        />
                    </FormControl>

                    <button 
                        type="submit" 
                        className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition duration-300 font-medium flex items-center justify-center"
                        onClick={(e) => { e.preventDefault(); onSubmit(serviceName, price, detail); }}
                    >
                    Confirm
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </button>
                </div>
            </form>
        </div>
    )
}

export default EditShopServiceForm