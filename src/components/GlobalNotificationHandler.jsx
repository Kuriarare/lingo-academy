import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import useNotificationSound from "../hooks/useNotificationSound";
import notificationSound from "../assets/sounds/notification.wav";

const GlobalNotificationHandler = () => {
  const user = useSelector((state) => state.user.userInfo?.user);
  const unreadCountsByRoom = useSelector(
    (state) => state.chat.unreadCountsByRoom
  );
  const studentUnreadCount = useSelector(
    (state) => state.chat.studentUnreadCount
  );
  const playSound = useNotificationSound(notificationSound);
  const prevTotalUnreadCount = useRef(0);

  useEffect(() => {
    let currentTotalUnreadCount = 0;
    if (user?.role === "teacher") {
      currentTotalUnreadCount = Object.values(unreadCountsByRoom).reduce(
        (acc, count) => acc + count,
        0
      );
    } else {
      currentTotalUnreadCount = studentUnreadCount;
    }

    if (currentTotalUnreadCount > prevTotalUnreadCount.current) {
      playSound();
    }

    prevTotalUnreadCount.current = currentTotalUnreadCount;
  }, [unreadCountsByRoom, studentUnreadCount, user, playSound]);

  return null;
};

export default GlobalNotificationHandler;