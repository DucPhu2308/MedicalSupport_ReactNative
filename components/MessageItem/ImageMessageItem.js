import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Dimensions } from 'react-native';
import ImageViewing from 'react-native-image-viewing';

const ImageMessageItem = ({ message, isSent }) => {
    const errorImage = require('../../assets/error_image.png');
    const images = message.content;
    const [imageUris, setImageUris] = useState(images);
    const [isVisible, setIsVisible] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);

    const openImageViewer = (index) => {
        setCurrentIndex(index);
        setIsVisible(true);
    };

    return (
        <View className={`flex-wrap my-1
            ${images.length > 1 ? 'flex-row' : ''}
            ${isSent ? 'self-end' : 'self-start'}
        `}>
            {imageUris.map((image, index) => (
                <TouchableOpacity
                    className={`${images.length === 1 ? 'w-3/4 h-64' : 'w-32 h-32'}`}
                    key={index} onPress={() => openImageViewer(index)}>
                    <Image
                        source={typeof image === 'string' ? { uri: image } : image}
                        className={`rounded-lg w-full h-full`}
                        onError={() => setImageUris((prev) => {
                            const newUris = [...prev];
                            newUris[index] = errorImage;
                            return newUris;
                        })}
                    />
                </TouchableOpacity>
            ))}

            {/* Image Viewer */}
            <ImageViewing
                images={images.map((img) => ({ uri: img }))}
                imageIndex={currentIndex}
                visible={isVisible}
                onRequestClose={() => setIsVisible(false)}
            />
        </View>
    );
}

export default ImageMessageItem;