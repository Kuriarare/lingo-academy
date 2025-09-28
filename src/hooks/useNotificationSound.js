import { useCallback } from 'react';

const useNotificationSound = (soundFile) => {
  const playSound = useCallback(() => {
    const audio = new Audio(soundFile);
    audio.play().catch(error => {
      // Autoplay was prevented. This is common in browsers.
      // The user needs to interact with the page first.
      console.warn("Notification sound could not be played:", error);
    });
  }, [soundFile]);

  return playSound;
};

export default useNotificationSound;