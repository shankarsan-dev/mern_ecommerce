


import uploadImageClodinary from "../utils/uploadImageClodinary.js"

const uploadImageController = async (request, response) => {
    try {
        const file = request.file

        if (!file) {
            return response.status(400).json({
                message: 'No file uploaded',
                error: true,
                success: false
            })
        }

        // Upload to Cloudinary
        const uploadImage = await uploadImageClodinary(file)

        return response.json({
            message: "Upload done",
            data: uploadImage,
            success: true,
            error: false
        })
    } catch (error) {
        console.error("Upload error:", error)

        return response.status(500).json({
            message: error.message || "An unexpected error occurred",
            error: true,
            success: false
        })
    }
}

export default uploadImageController
