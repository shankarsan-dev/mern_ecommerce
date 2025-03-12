

import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: 'dq1sjhrpt',  // Fixed typo (CLODINARY -> CLOUDINARY)
    api_key: '983717136571528',      // Fixed typo
    api_secret:'eUDLaMapzEunadQsDLPX7EExaEc'
});

const uploadImageClodinary = async (image) => {
    try {
        const buffer = image?.buffer || Buffer.from(await image.arrayBuffer());

        // Ensure the buffer is not empty
        if (!buffer || buffer.length === 0) {
            throw new Error("Invalid image buffer");
        }

        const uploadImage = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                {
                    folder: "binkeyit", // Folder in Cloudinary where images are uploaded
                    resource_type: 'auto' // Ensures Cloudinary auto-detects the file type (image, video, etc.)
                },
                (error, uploadResult) => {
                    if (error) {
                        reject(new Error(`Cloudinary upload failed: ${error.message}`)); // Improved error handling
                    } else {
                        resolve(uploadResult);
                    }
                }
            ).end(buffer);
        });

        return uploadImage;
    } catch (error) {
        throw new Error(`Image upload failed: ${error.message}`); // Improved error handling
    }
};

export default uploadImageClodinary;





