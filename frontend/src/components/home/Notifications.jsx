import React, { useState, useEffect } from "react";
import { fetchNotifications, markNotificationAsRead } from "../../api/Usuarios";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await fetchNotifications();
        setNotifications(response.data);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    getNotifications();
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif._id === id ? { ...notif, status: "read" } : notif
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  return (
    <div className="p-6 max-w-4xl  w-11/12 md:w-7/12 mx-auto bg-white rounded-lg shadow absolute top-48">
      <h1 className="text-2xl font-bold mb-4">Notificaciones</h1>
      {notifications.length === 0 ? (
        <p>No tienes notificaciones.</p>
      ) : (
        <ul className="space-y-4">
          {notifications.map((notif) => (
            <li
              key={notif._id}
              className={`p-4 border rounded ${notif.status === "unread" ? "bg-green-50" : ""}`}
            >
              <p>{notif.message}</p>
              <small className="text-gray-500">{new Date(notif.createdAt).toLocaleString()}</small>
              {notif.status === "unread" && (
                <button
                  onClick={() => handleMarkAsRead(notif._id)}
                  className="ml-4 text-green-500 hover:underline"
                >
                  Marcar como leída
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Notifications;
