"use client"
import { Accordion } from "@/app/components/Acordion";
import { TToken } from "@/models/data/token";
import { User } from "@/models/data/user";
import jwtDecode from "jwt-decode";
import { useEffect, useId, useState } from "react"
import { MdAccountBox, MdKeyboardArrowDown } from "react-icons/md"
import { toast , ToastContainer} from "react-toastify";
import userService from "@/services/user.service";
import { useTopBar } from "../../contexts/useTopBar";
import { useForm } from "react-hook-form";
import ConfirmDialog from "@/app/components/ConfirmDialog";
import { TUpdateUserRequest } from "@/models/requests/userRequests";
import { AxiosError } from "axios";


export default function UserConfig() {
    const {setPageDetails} = useTopBar();
    const [tokenData, setTokenData] = useState<TToken | null>(null);
    const [userData, setUserData] = useState<User | null>(null);
    const [openAccountInfo, setOpenAccountInfo] = useState(true);
    const [openAccountInfoEmailConfirmation, setOpenAccountInfoEmailConfirmation] = useState(false);
    const [openAccountInfoPassphraseConfirmation, setOpenAccountInfoPassphraseConfirmation] = useState(false);
    
    const emailForm = useForm<{email: string}>();
    const passphraseForm = useForm<{passphrase: string, confirmPassphrase: string}>({defaultValues: {passphrase: "", confirmPassphrase: ""}});
    async function fetchData() {
       const user = await userService.findUser();
       setUserData(user);
       emailForm.setValue("email", user.email);
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token) {
            toast.error("Could not Authenticate Token")
            return
        }
        try {
            setPageDetails({pageName: "User Settings"})
            const parsedToken:TToken = jwtDecode(token);
            setTokenData(parsedToken);
            fetchData();    
        } catch(e) {
            toast.error("Could not Authenticate Token")
            console.log(e);
            return;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
    const emailId = useId();
    const passphraseId = useId();
    const confirmPassphraseId = useId();
    return (
    <>    
        <div className="sm:ml-0 ml-5 w-11/12 h-fit  bg-white dark:bg-slate-700 flex gap-4 drop-shadow-lg p-4 rounded-md mb-4">
           <div className="flex items-end">
                <MdAccountBox className="text-xl sm:text-2xl md:text-4xl"/>
                <span className="text-sm sm:text-md md:text-xl">Logged as {" "} 
                <span className="text-emerald-500">{userData?.email}</span>
                </span>
           </div>
        </div>

        <Accordion open={openAccountInfo} closeOpen={() => setOpenAccountInfo((prev) => !prev)} subject="Account Data" height="h-[38rem] md:h-[20rem]">
            <form onSubmit={emailForm.handleSubmit((data) => {               
                setOpenAccountInfoEmailConfirmation(true);
            })} 
            className="flex flex-col md:flex-row items-center gap-8">
                <label htmlFor={emailId} className="w-full md:w-[73.5%] flex flex-col flex-shrink flex-grow-0">
                    <span>Email</span>
                    <input id={emailId}{...emailForm.register("email", {required: true})} type="email"  className="input-flat" />
                </label>
                <div className="w-full md:w-[30%]">
                    <button type="submit" className="p-4 h-12 button-flat w-full md:translate-y-1/4">Edit Email</button>
                </div>
            </form>
            <section className="flex flex-col text-red-400">
                <div>{emailForm.formState.errors.email?.type == "required" && "Email is Required"}</div>
               <div>{emailForm.formState.errors.email?.type == "validate" && "Email is not valid"}</div>
            </section>

            <hr className="w-full h-0.5 bg-slate-200 dark:bg-slate-600 border-0 rounded-3xl my-8" />
            <form onSubmit={passphraseForm.handleSubmit((data) => {
                    setOpenAccountInfoPassphraseConfirmation(true);
                })}  
            className="flex flex-col md:flex-row items-center gap-8">
                <label htmlFor={passphraseId} className="w-full md:w-[35%] flex flex-col flex-shrink flex-grow-0">
                    <span>Passphrase</span>
                    <input id={passphraseId}{...passphraseForm.register("passphrase", {required: true, minLength: 16})} type="password" className="input-flat" />
                </label>
                <label htmlFor={confirmPassphraseId} className="w-full md:w-[35%] flex flex-col flex-shrink flex-grow-0">
                    <span>Confirm Passphrase</span>
                    <input id={confirmPassphraseId}{...passphraseForm.register("confirmPassphrase", {required: true, minLength: 16})} type="password" className="input-flat" />
                </label>
                <div className="w-full md:w-[30%]">
                    <button type="submit"  className="p-4 h-12 button-flat w-full md:translate-y-1/4">Edit Passphrase</button>
                </div>
            </form>
            <section className="flex flex-col text-red-400">
                <div>{passphraseForm.formState.errors.passphrase?.type == "required" && "Passphrase is Required"}</div>
                <div>{passphraseForm.formState.errors.passphrase?.type == "minLength" && "Passphrase Length Must be higher than 16 characters"}</div>
                <div>{passphraseForm.formState.errors.confirmPassphrase?.type == "required" && "Confirm Passphrase is Required"}</div>
                <div>{passphraseForm.formState.errors.confirmPassphrase?.type == "minLength" && "Confirm Passphrase Length Must be higher than 16 characters"}</div>
                <div>{passphraseForm.watch("passphrase").length >= 16 && passphraseForm.watch("confirmPassphrase").length >= 16 && passphraseForm.watch("passphrase") != passphraseForm.watch("confirmPassphrase") && "Passphrases Missmatch"}</div>
            </section>
        </Accordion>

        <ConfirmDialog  onClose={() => setOpenAccountInfoEmailConfirmation(false)} open={openAccountInfoEmailConfirmation} onOkay={async () => {
            const emailData = emailForm.getValues("email");
            const filteredBody:TUpdateUserRequest = {
                email: emailData
            }

            try {
                await userService.updateUser(localStorage.getItem('token')!,filteredBody);
                toast.success(`Successed update your Email to ${emailData}`);
            } catch(e:any) {
                toast.error(e.response.data.detail);
            }
        }}
        question={"Are you Sure about update your email?"} declineButtonContent={"No, Close"} okayButtonContent={"Yes, update"} title="Confirm Warning"/> 
       
       <ConfirmDialog  onClose={() => setOpenAccountInfoPassphraseConfirmation(false)} open={openAccountInfoPassphraseConfirmation} onOkay={async () => {
            const passphraseData = passphraseForm.getValues("passphrase");
            const filteredBody:TUpdateUserRequest = {
                passphrase: passphraseData
            }

            try {
                await userService.updateUser(localStorage.getItem('token')!,filteredBody);
                toast.success(`Successed update your Passphrase to ${passphraseData}`);
            } catch(e:any) {
                toast.error(e.response.data.detail);
            }
        }}
        question={"Are you Sure about update your Passphrase?"} declineButtonContent={"No, Close"} okayButtonContent={"Yes, update"} title="Confirm Warning"/> 

       <ToastContainer/>
    </>
    )
}