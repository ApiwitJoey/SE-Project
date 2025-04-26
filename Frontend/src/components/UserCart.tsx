'use client'
import { AppDispatch, RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { fetchUsers } from "@/redux/features/userSlice";
import getUsers from "@/libs/Users/getUsers";
import { User } from "../../interfaces";
import banUser from "@/libs/Users/banUser";
import unbanUser from "@/libs/Users/unbanUser";
import deleteUser from "@/libs/Users/deleteUser";
import { banUser as banUserRedux } from "@/redux/features/userSlice";
import { unbanUser as unbanUserRedux } from "@/redux/features/userSlice";
import { removeUser } from "@/redux/features/userSlice";
import CircularProgress from '@mui/material/CircularProgress';
import ConfirmationPopup from "./ConfirmPopup";

const UserCart = () => {
    const dispatch = useDispatch<AppDispatch>();
    const userArr = useSelector((state: RootState) => state.user.user)
    const router = useRouter();
    
    const { data:session } = useSession();
    const token = session?.user.token;
    const role = session?.user.role;

    const [loading, setLoading] = useState(true)
    const [showPopup, setShowPopup] = useState(false);
    const [currentUser, setUser] = useState({
        name: "",
        id: "",
    });
    
    
    if(role != 'admin'){
        router.push('/api/auth/signin')
    }

    const handleBan = async (id:string) => {
        if(id && token){
            const response = await banUser(id,token);
            if(response.success){
                dispatch(banUserRedux(id));
            }
        }
    }

    const handleUnBan = async (id:string) => {
        if(id && token){
            const response = await unbanUser(id,token);
            if(response.success){
                dispatch(unbanUserRedux(id));
            }
        }
    }

    const handleDelete = async (id:string) => {
        if(id && token){
            const response = await deleteUser(id,token);
            if(response.success){
                dispatch(removeUser(id));
                setShowPopup(false);
            }
        }
    }

    useEffect(() => {
        const fetchUser = async () => {
            if(token){
                const response = await getUsers(token);
                dispatch(fetchUsers(response.data));
                setLoading(false);
            }
            else{
                console.log("No token found");
            }
        }
        fetchUser();
    },[]);

    const normalUser:User[] = [];
    const bannedUser:User[] = [];
    userArr.forEach((user) => {
        if(user.isBan){
            bannedUser.push(user);
        }
        else{
            normalUser.push(user);
        }
    })

    if(loading){
        return (
            <div className="mt-44 flex justify-center">
                <CircularProgress sx={{ color: '#10b981' }} />
            </div>
        )
    }

    if(userArr.length == 0){
        return (
            <div className="text-center py-10 text-emerald-700">
                No Users Found
            </div>
        )
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-emerald-800 mb-6">User Management</h1>
            
            {/* Normal Users Section */}
            <div className="mb-10">
                <h2 className="text-xl font-semibold text-emerald-700 mb-4 border-b border-emerald-200 pb-2">
                    Active Users
                </h2>
                <div className="space-y-4">
                    {normalUser.slice().reverse().map((user:User) => (
                        <div key={user._id} className="bg-white rounded-lg shadow-md p-4 border border-emerald-100 hover:shadow-lg transition-shadow">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <p className="text-sm text-emerald-600">Name</p>
                                    <p className="font-medium text-emerald-600">{user.firstname??user.username??user.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-emerald-600">Email</p>
                                    <p className="font-medium text-emerald-600">{user.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-emerald-600">Role</p>
                                    <p className="font-medium capitalize text-emerald-600">{user.role}</p>
                                </div>
                            </div>
                            <div className="flex justify-end space-x-3 mt-4">
                                <button 
                                    onClick={() => {setUser({name:user.name, id:user._id}); setShowPopup(true);}}
                                    className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                                >
                                    Delete
                                </button>
                                {user.role !== 'admin' && (
                                    <button 
                                        onClick={() => handleBan(user._id)}
                                        className="px-4 py-2 bg-amber-100 text-amber-700 rounded-md hover:bg-amber-200 transition-colors"
                                    >
                                        Ban
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Banned Users Section */}
            {bannedUser.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold text-emerald-700 mb-4 border-b border-emerald-200 pb-2">
                        Banned Users
                    </h2>
                    <div className="space-y-4">
                        {bannedUser.map((user:User) => (
                            <div key={user._id} className="bg-white rounded-lg shadow-md p-4 border border-emerald-100 hover:shadow-lg transition-shadow">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <p className="text-sm text-emerald-600">Name</p>
                                        <p className="font-medium text-emerald-600">{user.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-emerald-600">Email</p>
                                        <p className="font-medium text-emerald-600">{user.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-emerald-600">Role</p>
                                        <p className="font-medium capitalize text-emerald-600">{user.role}</p>
                                    </div>
                                </div>
                                <div className="flex justify-end space-x-3 mt-4">
                                    <button 
                                        onClick={() => {setUser({name:user.name, id:user._id}); setShowPopup(true);}}
                                        className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                                    >
                                        Delete
                                    </button>
                                    <button 
                                        onClick={() => handleUnBan(user._id)}
                                        className="px-4 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors"
                                    >
                                        Unban
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showPopup && (
                <ConfirmationPopup
                title={`Are you sure you want to delete ${currentUser.name} account?`}
                message="this account will be gone forever, there is no redo."
                onConfirm={()=>handleDelete(currentUser.id)} 
                onCancel={()=>setShowPopup(false)}/>
            )}
        </div>
    )
}

export default UserCart