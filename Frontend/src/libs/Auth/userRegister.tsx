import { signIn } from "next-auth/react";
export default async function userRegister(userFirstName:string,userLastName:string,userEmail:string, userPassword:string, userRole:string, userTelephone:string){
    
    try{
        const response = await fetch(`${process.env.BACKEND_URL}/api/v1/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json'
            },
            body: JSON.stringify({
                firstName:userFirstName,
                lastName: userLastName,
                email: userEmail,
                password: userPassword,
                role: userRole,
                telephone: userTelephone
            })
        });
    
        if(response.ok){
            const data = await response.json();

            await signIn('credentials', {
                redirect: true,
                email: userEmail,
                password: userPassword,
                callbackUrl: '/'
            })

            return {
                success: true,
                message: data.message || "Registration successful!",
            };
        }
        else {
            return { success: false, message: "Registration failed." };
          }
    }
    catch(err){
        return { success: false, message: "An error occurred. Please try again." };
    }
}