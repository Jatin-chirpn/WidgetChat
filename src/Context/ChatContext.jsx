import { useState } from "react";
import { createContext } from "react";

export const Chat = createContext();

export default function ChatContext(props){
    const [ adminId , setAdminId ] = useState(null)
    const [ currentUserId , setCurrentUserId ] = useState(null)
    const [ inboxId , setinboxId ] = useState(null)
    
    function getUser( currentUserId, adminId){
        setAdminId(adminId)
        setCurrentUserId(currentUserId)
        setinboxId(adminId + currentUserId)
    }
    return(
        <Chat.Provider value={{getUser , adminId , currentUserId , inboxId}}>
            {props.children}
        </Chat.Provider>
    )
}