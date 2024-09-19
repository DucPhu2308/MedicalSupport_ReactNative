import { ImageBackground, View } from "react-native";
import { useState, useEffect } from "react";



export default function DefaultLayoutLogReg({ children }) {
    const images = [
        require('../assets/pictureDoctor1.jpg'),
        require('../assets/pictureDoctor2.jpg'),
        require('../assets/doctor_picture.jpg'),
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
          }, 300); // Change image after fade-out
        }, 10000); // Change image every 10 seconds
    
        return () => clearInterval(interval);
      }, [images.length]);
    
    return (
        <ImageBackground
            source={images[currentImageIndex]}
            className="flex-1 justify-center p-5"  // Kích thước phủ đầy
            resizeMode="cover">
            <View className="absolute top-0 bottom-0 left-0 right-0 bg-black opacity-50" />
            {children}
        </ImageBackground>
    )
}

