const School = require('../models/School');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('@fluidjs/multer-cloudinary');
const multer = require('multer');
const Application = require('../models/Application');
const { startOfDay, endOfDay, subDays } = require('date-fns');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'school_logos',
    allowed_formats: ['jpg', 'png', 'jpeg']
  },
});

// Configure multer
const upload = multer({ storage: storage });


// PUBLIC RIGHTS

//search schools
exports.searchSchools = async (req, res) => {
    try {
        const { 
            query,
            district,
            region,
            type,
            category,
            curriculum,
            maxTuition,
            hasBoarding,
            sortBy = 'name',
            sortOrder = 'asc',
            limit = 10, 
            page = 1 
        } = req.query;

        let searchQuery = {};

        // Text search
        if (query) {
            searchQuery.$or = [
                { name: { $regex: query, $options: 'i' } },
                { 'location.district': { $regex: query, $options: 'i' } }
            ];
        }

        // Location filters
        if (district) {
            searchQuery['location.district'] = { 
                $regex: new RegExp(district, 'i')
            };
        }
        if (region) {
            searchQuery['location.region'] = region;
        }

        // School type filter
        if (type) {
            searchQuery.type = type;
        }

        // Category filter
        if (category) {
            searchQuery.category = category;
        }

        // Curriculum filter
        if (curriculum) {
            searchQuery.curriculum = curriculum;
        }

        // Tuition fee filter
        if (maxTuition) {
            searchQuery['fees.tuitionFee.dayStudent'] = { 
                $lte: parseInt(maxTuition) 
            };
        }

        // Boarding filter
        if (hasBoarding === 'true') {
            searchQuery.type = { $in: ['Boarding', 'Mixed'] };
        }

        // Active schools only
        searchQuery['metadata.isActive'] = true;

        // Enhanced sorting
        let sortOptions = {};
        switch (sortBy) {
            case 'performance':
                sortOptions = { 'performance.UCE.div1Count': sortOrder === 'asc' ? 1 : -1 };
                break;
            case 'tuition':
                sortOptions = { 'fees.tuitionFee.dayStudent': sortOrder === 'asc' ? 1 : -1 };
                break;
            default:
                sortOptions = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };
        }

        const resultsPerPage = parseInt(limit);
        const currentPage = parseInt(page);

        const schools = await School.find(searchQuery)
            .sort(sortOptions)
            .limit(resultsPerPage)
            .skip(resultsPerPage * (currentPage - 1));

        const totalResults = await School.countDocuments(searchQuery);
        console.log(totalResults);
        res.status(200).json({
            success: true,
            data: schools,
            total: totalResults,
            page: currentPage,
            totalPages: Math.ceil(totalResults / resultsPerPage)
        });

    } catch (error) {
        console.error("Error during school search:", error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while searching for schools',
            error: error.message
        });
    }
};


// get single school by id || Can be a public one too
exports.getSchoolById = async (req, res) => {
    try {
        const school = await School.findById(req.params.id);
        if (!school) {
            return res.status(404).json({
                success: false,
                message: 'School not found',
            });
        }
        res.status(200).json({
            success: true,
            data: school,
        });
    } catch (error) {
        console.error('Error fetching school by ID:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the school',
            error: error.message,
        });
    }
};


// SUPER ADMIN RIGHTS

// Get school statistics for super admin
exports.getSchoolStats = async (req, res) => {
  try {
    const totalSchools = await School.countDocuments();
    const activeSchools = await School.countDocuments({ status: 'Active' });
    const pendingSchools = await School.countDocuments({ status: 'Pending' });
    const inactiveSchools = await School.countDocuments({ status: 'Inactive' });

    const schoolsByType = await School.aggregate([
      {
        $group: {
          _id: '$type',
          count: { $sum: 1 }
        }
      }
    ]);

    const schoolsByRegion = await School.aggregate([
      {
        $group: {
          _id: '$region',
          count: { $sum: 1 }
        }
      }
    ]);

    // Get schools created in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newSchools = await School.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      success: true,
      data: {
        total: totalSchools,
        active: activeSchools,
        pending: pendingSchools,
        inactive: inactiveSchools,
        new: newSchools,
        byType: schoolsByType,
        byRegion: schoolsByRegion
      }
    });
  } catch (error) {
    console.error('Error getting school stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting school statistics',
      error: error.message
    });
  }
};

// Update getAllSchools to include pagination, sorting, and filtering
exports.getAllSchools = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sort = '-createdAt',
      search,
      type,
      category,
      region,
      district
    } = req.query;

    // Build query
    const query = {};

    // Add filters if provided
    if (type) query.type = type;
    if (category) query.category = category;
    if (region) query['location.region'] = region;
    if (district) query['location.district'] = district;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'location.district': { $regex: search, $options: 'i' } },
        { 'location.region': { $regex: search, $options: 'i' } }
      ];
    }

    // Set up pagination options
    const options = {
      page: parseInt(page, 10),
      limit: parseInt(limit, 10),
      sort,
      select: 'name type location status category curriculum createdAt updatedAt',
      lean: true
    };

    // Get paginated results
    const schools = await School.paginate(query, options);

    // Transform response
    const response = {
      success: true,
      schools: schools.docs,
      pagination: {
        total: schools.totalDocs,
        page: schools.page,
        pages: schools.totalPages,
        limit: schools.limit
      }
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Error getting schools:', error);
    res.status(500).json({
      success: false,
      message: 'Error getting schools',
      error: error.message
    });
  }
};

// delete schools
exports.deleteSchool = async (req, res) => {
    try {
        const school = await School.findById(req.params.id);
        if (!school) {
            return res.status(404).json({ message: 'School not found' });
        }

        if (school.logo) {
            const publicId = school.logo.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }

        await School.findByIdAndDelete(req.params.id);
        res.json({ message: 'School deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// add schools
exports.addSchools = async (req, res) => {
    try {
        upload.single('logo')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'Error uploading file', error: err.message });
            }

            try {
                const schoolData = {
                    ...req.body,
                    media: {
                        logo: req.file ? req.file.path : null
                    }
                };

                // Parse nested JSON objects if they're sent as strings
                if (typeof schoolData.location === 'string') {
                    schoolData.location = JSON.parse(schoolData.location);
                }
                if (typeof schoolData.fees === 'string') {
                    schoolData.fees = JSON.parse(schoolData.fees);
                }
                if (typeof schoolData.admissions === 'string') {
                    schoolData.admissions = JSON.parse(schoolData.admissions);
                }
                if (typeof schoolData.facilities === 'string') {
                    schoolData.facilities = JSON.parse(schoolData.facilities);
                }
                if (typeof schoolData.contact === 'string') {
                    schoolData.contact = JSON.parse(schoolData.contact);
                }
                if (typeof schoolData.subjects === 'string') {
                    schoolData.subjects = JSON.parse(schoolData.subjects);
                }

                // Handle arrays
                if (typeof schoolData.curriculum === 'string') {
                    schoolData.curriculum = schoolData.curriculum.split(',').map(item => item.trim());
                }
                
                // Create and save the school
                const newSchool = new School(schoolData);
                await newSchool.save();

                res.status(201).json({ 
                    message: 'School added successfully', 
                    school: newSchool 
                });
            } catch (validationError) {
                console.error('Validation Error:', validationError);
                return res.status(400).json({ 
                    message: 'Invalid school data', 
                    error: validationError.message,
                    details: validationError.errors 
                });
            }
        });
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Update school
exports.updateSchool = async (req, res) => {
    try {
        upload.single('logo')(req, res, async (err) => {
            if (err) {
                return res.status(400).json({ message: 'Error uploading file', error: err.message });
            }

            const updates = req.body;
            const schoolId = req.params.id;

            if (req.file) {
                const school = await School.findById(schoolId);
                if (school.logo) {
                    const publicId = school.logo.split('/').pop().split('.')[0];
                    await cloudinary.uploader.destroy(publicId);
                }
                updates.logo = req.file.path;
            }

            if (updates.requirements) {
                updates.requirements = updates.requirements.split(',').map(req => req.trim());
            }

            const updatedSchool = await School.findByIdAndUpdate(schoolId, updates, { new: true, runValidators: true });
            if (!updatedSchool) {
                return res.status(404).json({ message: 'School not found' });
            }

            res.json({ message: 'School updated successfully', school: updatedSchool });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// Add this new function
exports.getSimilarSchools = async (req, res) => {
  try {
    const { schoolId, category, region, type } = req.query;
    
    const query = {
      'metadata.isActive': true // Only get active schools
    };

    // Exclude current school if provided
    if (schoolId) {
      query._id = { $ne: schoolId };
    }

    // Add filters if provided
    if (category) query.category = category;
    if (region) query['location.region'] = region;
    if (type) query.type = type;

    // Find schools with similar characteristics
    const similarSchools = await School.find(query)
      .limit(5) // Limit to 5 similar schools
      .select('name logo type category location.region') // Select only needed fields
      .sort({ 
        // You can add custom sorting logic here
        // For example, sort by rating if you have that field
        'metadata.rating': -1,
        name: 1
      });

    res.status(200).json({
      success: true,
      data: similarSchools
    });
  } catch (error) {
    console.error("Error fetching similar schools:", error);
    res.status(500).json({
      success: false,
      message: 'Error fetching similar schools',
      error: error.message
    });
  }
};

// Add gallery images
exports.addGalleryImages = async (req, res) => {
  try {
    const schoolId = req.params.id;
    const images = req.files; // Assuming multiple file upload

    const imageUrls = await Promise.all(
      images.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: 'school_gallery'
        });
        return {
          url: result.secure_url,
          caption: '',
          isMain: false
        };
      })
    );

    const school = await School.findByIdAndUpdate(
      schoolId,
      { 
        $push: { 
          'media.gallery': { 
            $each: imageUrls 
          } 
        } 
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: school.media.gallery
    });
  } catch (error) {
    console.error('Error adding gallery images:', error);
    res.status(500).json({
      success: false,
      message: 'Error adding gallery images',
      error: error.message
    });
  }
};

// Remove gallery image
exports.removeGalleryImage = async (req, res) => {
  try {
    const { schoolId, imageId } = req.params;

    const school = await School.findById(schoolId);
    const image = school.media.gallery.id(imageId);

    if (image) {
      // Delete from Cloudinary
      const publicId = image.url.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);

      // Remove from database
      school.media.gallery.pull(imageId);
      await school.save();
    }

    res.status(200).json({
      success: true,
      message: 'Image removed successfully'
    });
  } catch (error) {
    console.error('Error removing gallery image:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing gallery image',
      error: error.message
    });
  }
};

// STAFF RIGHTS

// Get school by admin ID
exports.getSchoolByAdminId = async (req, res) => {
  try {
    const adminId = req.params.adminId;
    
    if (!adminId) {
      return res.status(400).json({ 
        success: false,
        message: 'Admin ID is required' 
      });
    }

    const school = await School.findOne({ adminId })
      .populate('adminId', 'name email role')
      .select('-__v');

    if (!school) {
      return res.status(404).json({ 
        success: false,
        message: 'No school found for this admin' 
      });
    }

    res.status(200).json({
      success: true,
      school
    });
  } catch (error) {
    console.error('Error in getSchoolByAdminId:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error fetching school',
      error: error.message 
    });
  }
};

// Get school dashboard statistics
exports.getSchoolDashboardStats = async (req, res) => {
  try {
    const { schoolId } = req.params;
    console.log('Fetching dashboard stats for school:', schoolId);

    if (!schoolId) {
      console.log('No schoolId provided');
      return res.status(400).json({
        success: false,
        message: 'School ID is required'
      });
    }

    // Convert schoolId to ObjectId
    const mongoose = require('mongoose');
    const schoolObjectId = new mongoose.Types.ObjectId(schoolId);
    console.log('Converted to ObjectId:', schoolObjectId);

    // Get current date
    const now = new Date();
    const today = startOfDay(now);
    const last7Days = subDays(today, 6); // Get date 6 days ago for last 7 days
    console.log('Date range:', { today: today.toISOString(), last7Days: last7Days.toISOString() });

    // Get total counts and status distribution
    console.log('Starting aggregation pipeline...');
    const [totalStats, dailyStats, recentApplications] = await Promise.all([
      // Get total statistics and status distribution
      Application.aggregate([
        { 
          $match: { 
            school: schoolObjectId
          } 
        },
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 }
          }
        }
      ]),

      // Get daily statistics for the last 7 days
      Application.aggregate([
        {
          $match: {
            school: schoolObjectId,
            createdAt: { $gte: last7Days }
          }
        },
        {
          $group: {
            _id: {
              date: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
              status: "$status"
            },
            count: { $sum: 1 }
          }
        },
        {
          $group: {
            _id: "$_id.date",
            total: { $sum: "$count" },
            approved: {
              $sum: {
                $cond: [{ $eq: ["$_id.status", "Approved"] }, "$count", 0]
              }
            },
            rejected: {
              $sum: {
                $cond: [{ $eq: ["$_id.status", "Rejected"] }, "$count", 0]
              }
            },
            pending: {
              $sum: {
                $cond: [{ $eq: ["$_id.status", "Pending"] }, "$count", 0]
              }
            }
          }
        },
        { $sort: { _id: 1 } }
      ]),

      // Get recent applications
      Application.find({ school: schoolObjectId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('status createdAt applicant')
        .populate('applicant', 'firstName lastName')
    ]);

    console.log('Aggregation results:', { totalStats, dailyStats, recentApplications });

    // Format status distribution
    const statusDistribution = totalStats.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    // Calculate total applications
    const totalApplications = Object.values(statusDistribution).reduce((a, b) => a + b, 0);

    // Format chart data with all dates in the last 7 days
    const chartData = [];
    for (let i = 0; i < 7; i++) {
      const date = subDays(today, 6 - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayStats = dailyStats.find(d => d._id === dateStr) || {
        total: 0,
        approved: 0,
        rejected: 0,
        pending: 0
      };
      chartData.push({
        date: dateStr,
        ...dayStats
      });
    }

    console.log('Formatted response:', {
      statusDistribution,
      totalApplications,
      applicationTrends: chartData,
      recentApplications
    });

    res.json({
      success: true,
      data: {
        statusDistribution,
        totalApplications,
        applicationTrends: chartData,
        recentApplications
      }
    });

  } catch (error) {
    console.error('Error in getSchoolDashboardStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};
