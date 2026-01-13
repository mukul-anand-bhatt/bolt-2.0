import React, { useContext } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import Lookup from '@/data/Lookup'
import { Button } from '../ui/button'
import { useGoogleLogin } from '@react-oauth/google'
import { UserDetailContext } from '@/context/UserDetailContext'
import axios from 'axios';





function SignInDialog({ openDialog, closeDialog }) {

    const { userDetail, setUserDetail } = useContext(UserDetailContext)

    const CreateUser = async (user) => {
        try {
            const result = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user`, {
                user: {
                    name: user?.name,
                    email: user?.email,
                    picture: user?.picture
                }
            })
            console.log(result);
        } catch (error) {
            console.log(error);
        }
    }

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log(tokenResponse);
            const userInfo = await axios.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                { headers: { Authorization: 'Bearer ' + tokenResponse?.access_token } },
            );

            console.log(userInfo);
            await CreateUser(userInfo?.data);
            setUserDetail(userInfo?.data);
            closeDialog(false);
        },
        onError: errorResponse => console.log(errorResponse),
    });



    return (
        <Dialog open={openDialog} onOpenChange={closeDialog}>
            <DialogContent className="bg-gray-950 gap-3" >
                <DialogHeader>
                    <DialogTitle></DialogTitle>
                    <DialogDescription>
                        <div className="flex flex-col items-center justify-center gap-3">
                            <h2 className='font-bold text-2xl items-center justify-center'>{Lookup.SIGNIN_HEADING}</h2>
                            <p className='mt-2 text-center'>{Lookup.SIGNIN_SUBHEADING}</p>
                            <Button onClick={googleLogin} className='bg-blue-500 text-white hover:bg-blue-600 mt-3 gap-2'>Sign In with Google</Button>
                            <p className='text-center'>{Lookup.SIGNIn_AGREEMENT_TEXT}</p>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default SignInDialog
