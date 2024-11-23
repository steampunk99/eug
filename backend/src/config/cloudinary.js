const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('@fluidjs/multer-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Create storage configurations for different types of uploads
const createStorage = (folder, allowedFormats = ['jpg', 'png', 'jpeg', 'pdf']) => {
    return new CloudinaryStorage({
        cloudinary: cloudinary,
        params: {
            folder: folder,
            allowed_formats: allowedFormats,
            resource_type: 'auto',
            transformation: folder === 'avatars' ? [
                { width: 200, height: 200, crop: 'fill', gravity: 'face' },
                { quality: 'auto', fetch_format: 'auto' }
            ] : []
        },
    });
};

// Create multer upload configurations for different purposes
const uploads = {
    schoolLogo: multer({ 
        storage: createStorage('school_logos', ['jpg', 'png', 'jpeg']) 
    }),
    
    schoolGallery: multer({ 
        storage: createStorage('school_gallery', ['jpg', 'png', 'jpeg']) 
    }),
    
    applicationDocuments: multer({ 
        storage: createStorage('application_documents', ['jpg', 'png', 'jpeg', 'pdf']) 
    }),
    
    avatars: multer({
        storage: createStorage('avatars', ['jpg', 'png', 'jpeg']),
        limits: {
            fileSize: 5 * 1024 * 1024 // 5MB limit
        },
        fileFilter: (req, file, cb) => {
            if (!file.mimetype.startsWith('image/')) {
                cb(new Error('Only image files are allowed!'), false);
            }
            cb(null, true);
        }
    })
};

module.exports = {
    cloudinary,
    uploads
};
