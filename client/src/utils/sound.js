const playSound = (fileName) => {
  try {
    const audio = new Audio(`/sounds/${fileName}`);
    audio.volume = 0.4; // optional nice UX
    audio.play();
  } catch (err) {
    console.log("Sound error:", err);
  }
};

export default playSound;