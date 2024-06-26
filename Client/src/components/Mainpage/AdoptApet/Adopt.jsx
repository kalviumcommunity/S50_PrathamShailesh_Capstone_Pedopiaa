import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { URL } from "@/components/Constant/api";

const PetDetailsPopup = ({ pet, onClose }) => {
  const navigate = useNavigate();
  const [sellerName, setSellerName] = useState("");
  const [user, setUser] = useState("");
  const sellerId = pet.userId;
  const token = localStorage.getItem("token");


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User not authenticated");
        }

        const response = await axios.get(`${URL}/users`, {

          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.User_Name);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchSellerName = async () => {
      try {
        const response = await axios.get(

          `${URL}/users/seller/${sellerId}`,

          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSellerName(response.data.User_Name);
      } catch (error) {
        console.error("Error fetching seller name:", error);
      }
    };

    fetchSellerName();
  }, [sellerId, token]);

  const chat = async () => {
    if (user !== sellerName) {
      try {
        const response = await axios.post(
          `${URL}/chat`,
          {
            participants: [user, sellerName],
            messages: [],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data);
        navigate(`/chat?userId=${sellerName}`);
      } catch (error) {
        console.error("Error initiating chat:", error);
      }
    }
  };

  const isSameUser = user === sellerName;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 text-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-[800px] flex">
        <button
          className="absolute top-4 right-4 text-white text-3xl"
          onClick={onClose}
        >
          X
        </button>
        <div className="w-1/2 pr-4 flex flex-col justify-between">
          <h2 className="text-2xl font-semibold mb-4">{pet.name}</h2>
          <p className="text-gray-700 mb-4">{pet.description}</p>
          <div className="flex justify-between flex-col">
            <button
              onClick={chat}
              disabled={isSameUser}
              className={`py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-50 ${
                isSameUser
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 text-white font-bold focus:ring-blue-600"
              }`}
            >
              Chat with seller
            </button>
          </div>
        </div>
        <div className="w-1/2 flex justify-center items-center">
          <img
            src={pet.image}
            alt={pet.name}
            className="max-w-full h-auto mb-4"
          />
        </div>
      </div>
    </div>
  );
};

export default PetDetailsPopup;
