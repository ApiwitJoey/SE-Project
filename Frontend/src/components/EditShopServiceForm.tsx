'use client'
import { FilledInput, FormControl, InputAdornment, InputLabel, TextField, Select, MenuItem } from "@mui/material"
import { useEffect, useState } from "react";

export interface PrevInfo {
    serviceName: string,
    price: string,
    detail: string,
    targetArea: string,
    massageType: string
}

const EditShopServiceForm = ({ onSubmit, header, prevInfo } : { onSubmit: Function, header:string, prevInfo?:PrevInfo|undefined }) => {

    const [serviceName, setServiceName] = useState("");
    const [price, setPrice] = useState("");
    const [detail, setDetail] = useState("");
    const [targetArea, setTargetArea] = useState("");
    const [massageType, setMassageType] = useState("");

    useEffect(() => {
        if (prevInfo) {
            setServiceName(prevInfo.serviceName);
            setPrice(prevInfo.price);
            setDetail(prevInfo.detail);
            setTargetArea(prevInfo.targetArea);
            setMassageType(prevInfo.massageType);
        }
    }, [prevInfo]);

    const targetAreas = [
        'Head & Shoulder', 
        'Foot', 
        'Neck-Shoulder-Back', 
        'Chair', 
        'Abdominal', 
        'Hand & Arm', 
        'Leg', 
        'Full Body'
    ];

    const massageTypes = [
        'Thai', 
        'Swedish', 
        'Oil/Aromatherapy', 
        'Herbal Compress',
        'Deep Tissue', 
        'Sports', 
        'Office Syndrome',
        'Shiatsu', 
        'Lomi-Lomi', 
        'Trigger Point',
        'Others'
    ];

    return (
        <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 border border-emerald-100 mb-6">
            <h1 className="text-2xl font-bold text-emerald-800">{header}</h1>

            <div className="h-1 w-full bg-emerald-500 rounded mb-4 mt-1"></div>

            <form>
                <div>
                    <label className="block text-emerald-700 font-medium mb-2">
                        Fill out the new service's information:
                    </label>
                    <TextField
                        id="service-name"
                        label="Service Name"
                        variant="outlined"
                        fullWidth
                        value={serviceName}
                        onChange={(e) => setServiceName(e.target.value)}
                        sx={{
                            bgcolor: "white",
                            color: "emerald.900",
                            "& .MuiInputBase-root": {
                            color: "#064e3b",
                            bgcolor: "#ffffff",
                            },
                            "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "#d1fae5",
                            },
                            "&:hover fieldset": {
                                borderColor: "#10b981",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#047857",
                            },
                            },
                            "& .MuiInputLabel-root": {
                            color: "#065f46",
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                            color: "#047857",
                            },
                            py: 1,
                        }}
                    />

                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full mt-2">
                        <FormControl fullWidth sx={{ flex: 1 }}>
                            <InputLabel id="target-area-label">Target Area</InputLabel>
                            <Select
                                labelId="target-area-label"
                                id="target-area"
                                value={targetArea}
                                label="Target Area"
                                onChange={(e) => setTargetArea(e.target.value)}
                                sx={{
                                    bgcolor: "white",
                                    color: "#064e3b",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#d1fae5",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#10b981",
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#047857",
                                    },
                                }}
                            >
                                {targetAreas.map((area) => (
                                    <MenuItem key={area} value={area}>
                                        {area}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <FormControl fullWidth sx={{ flex: 1 }}>
                            <InputLabel id="massage-type-label">Massage Type</InputLabel>
                            <Select
                                labelId="massage-type-label"
                                id="massage-type"
                                value={massageType}
                                label="Massage Type"
                                onChange={(e) => setMassageType(e.target.value)}
                                sx={{
                                    bgcolor: "white",
                                    color: "#064e3b",
                                    "& .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#d1fae5",
                                    },
                                    "&:hover .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#10b981",
                                    },
                                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                                        borderColor: "#047857",
                                    },
                                }}
                            >
                                {massageTypes.map((type) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>

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
                            mt: 2,
                            "& .MuiInputBase-root": {
                            color: "#064e3b",
                            bgcolor: "#ffffff",
                            },
                            "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                                borderColor: "#d1fae5",
                            },
                            "&:hover fieldset": {
                                borderColor: "#10b981",
                            },
                            "&.Mui-focused fieldset": {
                                borderColor: "#047857",
                            },
                            },
                            "& .MuiInputLabel-root": {
                            color: "#065f46",
                            },
                            "& .MuiInputLabel-root.Mui-focused": {
                            color: "#047857",
                            },
                            py: 1,
                        }}
                    />
                    <FormControl fullWidth sx={{ mt: 2 }} variant="filled">
                        <InputLabel htmlFor="filled-adornment-amount">Price</InputLabel>
                        <FilledInput
                            id="filled-adornment-amount"
                            type="number"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            startAdornment={<InputAdornment position="start">$</InputAdornment>}
                        />
                    </FormControl>

                    <button 
                        type="submit" 
                        className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition duration-300 font-medium flex items-center justify-center"
                        onClick={(e) => { e.preventDefault(); onSubmit(serviceName, price, detail, targetArea, massageType); }}
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