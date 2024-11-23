import React, { useState, useEffect } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import axios from 'axios';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const AddSchoolImagesForm = ({ onSuccess }) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [schools, setSchools] = useState([]);
  const [selectedSchoolId, setSelectedSchoolId] = useState('');

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        console.log('Fetching schools...');
        const response = await axios.get('https://school-locator.onrender.com/api/schools');
        console.log('Schools response:', response.data);
        
        // Check if response.data.data exists, otherwise use response.data
        const schoolsData = response.data.data || response.data;
        setSchools(schoolsData);
      } catch (err) {
        console.error('Error fetching schools:', err);
        setError('Failed to fetch schools: ' + err.message);
      }
    };

    fetchSchools();
  }, []);

  // For debugging
  useEffect(() => {
    console.log('Current schools state:', schools);
  }, [schools]);

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setSelectedFiles(prev => [...prev, ...files]);

    // Create previews for the new files
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedSchoolId) {
      setError('Please select a school');
      return;
    }
    setError(null);
    setUploading(true);

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('images', file);
      });

      const response = await axios.post(
        `https://school-locator.onrender.com/api/schools/${selectedSchoolId}/gallery`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        setSelectedFiles([]);
        setPreviews([]);
        if (onSuccess) {
          onSuccess(response.data.data);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error uploading images');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add School Images</CardTitle>
        <CardDescription>Upload images for the school gallery</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* School Select Dropdown */}
          <div className="space-y-2">
            <label htmlFor="school-select" className="text-sm font-medium">
              Select School
            </label>
            <Select
              value={selectedSchoolId}
              onValueChange={setSelectedSchoolId}
              disabled={schools.length === 0}

            >
              <SelectTrigger>
                <SelectValue placeholder="Select a school" />
              </SelectTrigger>
              <SelectContent>
                {schools && schools.length > 0 ? (
                  schools.map((school) => (
                    <SelectItem key={school._id} value={school._id}>
                      {school.name}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="0" disabled>
                    No schools available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            {error && (
              <p className="text-sm text-red-500 mt-1">{error}</p>
            )}
          </div>

          {/* File Input */}
          <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
              <label
                htmlFor="dropzone-file"
                className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-secondary/50 hover:bg-secondary"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <Upload className="w-8 h-8 mb-4 text-gray-500" />
                  <p className="mb-2 text-sm text-gray-500">
                    <span className="font-semibold">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 10 images)</p>
                </div>
                <input
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Preview Section */}
            {previews.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {previews?.map((preview, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={selectedFiles.length === 0 || uploading}
            className="w-full"
          >
            {uploading ? 'Uploading...' : 'Upload Images'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AddSchoolImagesForm; 