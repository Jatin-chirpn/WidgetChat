import Container from "./Container";
import React from "react";
import { signInAnonymously, updateProfile } from "firebase/auth";
import { auth } from "../Firebase.js";
import { FcElectroDevices } from "react-icons/fc";
// Importing contexts
import { useContext } from "react";
import { Chat } from "../Context/ChatContext";
import { Context } from "../Context/MyContext";
// Importing contexts
import {
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  doc,
  collection,
  where,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../Firebase.js";

export default function AnonymousLogin(props) {
  const myContext = useContext(Context);
  const ChatContext = useContext(Chat);

  async function loginHandler(event) {
    event.preventDefault();
    const displayName = event.target.user.value;
    // CREATING A ANONYMOUS USER
    await signInAnonymously(auth)
      .then(async (res) => {
        updateProfile(res.user, {
          displayName: displayName,
        });

        setDoc(doc(db, "Users", res.user.uid), {
          displayName: displayName,
          uid: res.user.uid,
          websiteURL: "http://localhost:3000",
          websiteId: "testing_harshit",
        });
        // CREATING A ANONYMOUS USER

        myContext.getUser(res.user.uid); // Sending info into context

        // FINDING OR CREATING A CHAT INBOX
        let userId = res.user.uid;
        let userName = displayName;

        // GET ADMIN ID AND NAME

        let adminId, adminName;
        await getDocs(
          query(
            collection(db, "Admins"),
            where("websiteId", "==", "testing_harshit")
          )
        )
          .then((res) => {
            res.forEach((admin) => {
              adminId = admin.data().uid;
              adminName = admin.data().displayName;
            });
          })
          .catch((error) => {
            console.log(error);
          });
        // GET ADMIN ID AND NAME

        if (userId !== null && adminId !== null) {
          const inboxId = adminId + userId;
          try {
            // check if doc exists or not
            const checkInbox = await getDoc(doc(db, "Chats", inboxId));
            if (!checkInbox.exists()) {
              // new doc created
              await setDoc(doc(db, "Chats", inboxId), { messages: [] });
            }

            // Checking if doc exists or not
            const checkUserInfo = await getDoc(doc(db, "userChats", userId));
            if (!checkUserInfo.exists()) {
              // if doc doesnt exists this will make one
              await setDoc(doc(db, "userChats", userId), {});
              // this will update doc
              await updateDoc(doc(db, "userChats", userId), {
                [inboxId + ".userInfo"]: {
                  userId: userId,
                  displayName: userName,
                },
                [inboxId + ".date"]: serverTimestamp(),
              });
            }

            // Checking if doc exists or not
            const check = await getDoc(doc(db, "userChats", adminId));
            if (!check.exists()) {
              // if doc doesnt exists this will make one
              await setDoc(doc(db, "userChats", adminId), {});
              // this will update doc
              await updateDoc(doc(db, "userChats", adminId), {
                [inboxId + ".userInfo"]: {
                  adminId: adminId,
                  displayName: adminName,
                },
                [inboxId + ".date"]: serverTimestamp(),
              });
            }
          } catch (error) {
            console.log("something went wrong");
          }
        }
        // FINDING OR CREATING A CHAT INBOX
        ChatContext.getUser(userId, adminId); // Sending info into context
      })
      .catch((error) => {
        console.log(error);
      });
  }
  return (
    <>
      <div
        className={` bg-slate-100 bottom-36 shadow-2xl rounded-2xl rounded-t-none right-16 w-full h-full duration-700 ${props.className}`}
      >
        <Container>
          <div className="h-[35vh] rounded-2xl shadow-inner  rounded-b-none text-center bg-gradient-to-r from-[#0052F1] to-[#003BAF] ">
            <div>
              <div className="flex justify-between pr-4 overflow-hidden">
                <div className="text-5xl shadow-2xls pb-0 p-3 ">
                  <FcElectroDevices />
                </div>
                <div className="p-3 pb-0">
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                    src="https://images.unsplash.com/photo-1491528323818-fdd1faba62cc?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                    src="https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                    alt=""
                  />
                  <img
                    className="inline-block h-8 w-8 rounded-full ring-2 ring-white"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.25&w=256&h=256&q=80"
                    alt=""
                  />
                </div>
              </div>
              <div className="mt-1 pr-4 text-right text-xs font-medium">
                <a href="/" className="text-white">
                  + 150 others
                </a>
              </div>
            </div>
            <div className="font-bold font-[jatin34]  text-white text-2xl">
              <div>
                Hello There :)
              </div>
            </div>
            <div className="font-bold   font-[jatin34]  text-white text-2xl">
              How can we help?
            </div>
          </div>
        </Container>
        <Container>
          <form
            onSubmit={loginHandler}
            className="h-[35vh] shadow-2xl bg-[#F5F5F5] rounded-2xl absolute left-[28%] top-[25%] w-[45vw] drop-shadow-2xl  rounded-b-none py-2"
          >
            <div className="m-2 text-center ">
              <p className="font-bold text-lg font-[ubantu] p-5 pb-0">
                Send us a message
              </p>
              <p className="font-serif text-[15px]  p-5 pt-0">
                We will reply you as soon as possible
              </p>
            </div>
            <div className="w-full mt-6 h-[60px] m-auto">
              <input
                name="user"
                type="text"
                className="form-control bg-slate-100 outline-none  block w-52 ml-4 mt-3 px-3 py-1.5 text-base font-normal text-gray-700"
                id="exampleFormControlInput5"
                placeholder="Enter Your Name..."
              />
              <button
                type="submit"
                className=" mt-[-35px] mr-5 px-3 py-1 float-right  text-blue-600 font-medium text-xs rounded-full "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                  />
                </svg>
              </button>
            </div>
          </form>
        </Container>
        <Container>
          <div className=" h-[35vh] shadow-inner  w-full rounded-2xl rounded-t-none mt-[10vh] bg-gradient-to-r from-[#0052F1] to-[#003BAF]"></div>
        </Container>
      </div>
    </>
  );
}
