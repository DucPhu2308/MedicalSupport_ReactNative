import { ImageBackground, View } from "react-native";
import { useState, useEffect } from "react";

export default function DefaultLayoutLogReg({ children }) {
  const images = [
    require('../assets/pictureDoctor.jpg'),
    require('../assets/pictureDoctor2.jpg'),
];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [nextImageIndex, setNextImageIndex] = useState((currentImageIndex + 1) % images.length);
  const [fadeIn, setFadeIn] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentImageIndex((prev) => {
          const newIndex = (prev + 1) % images.length;
          setNextImageIndex((newIndex + 1) % images.length);
          return newIndex;
        });
        setFadeIn(true);
      }, 300); // Thay đổi hình ảnh sau khi mờ đi
    }, 10000); // Thay đổi hình ảnh sau mỗi 10 giây

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <ImageBackground
        source={images[currentImageIndex]}
        style={{ flex: 1, justifyContent: 'center' }}
      >
        {children}
      </ImageBackground>
    </View>

  );
}
