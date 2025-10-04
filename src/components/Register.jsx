import React from 'react'
import './Register.css'
import { useState } from 'react'
import axios from 'axios';
import Loader from './loader/loader.jsx';

const Register = ({ funcSetLogin }) => {
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [inputField, setinputField] = useState({
        mobilenumber: "", 
        password: "", 
        name: "",
        profile: ""  
    });

    const GotoLogin = () => {
        funcSetLogin(true);
    };

    // ✅ Use the same upload function from your previous project
    const uploadImageToCloudinary = async (file) => {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "Hope-By-Aziz");
        formData.append("cloud_name", "dovqlntrq");

        try {
            const response = await axios.post(
                "https://api.cloudinary.com/v1_1/dovqlntrq/image/upload",
                formData
            );
            return response.data.secure_url; // Return Cloudinary URL
        } catch (error) {
            console.error("Upload error:", error);
            return null;
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {    
            // Create temporary preview
            const imageUrl = URL.createObjectURL(file);
            setSelectedImage(imageUrl);
            
            // ✅ Upload to Cloudinary
            setLoading(true);
            const cloudinaryUrl = await uploadImageToCloudinary(file);
            
            if (cloudinaryUrl) {
                // ✅ Save Cloudinary URL to state
                setinputField(prev => ({
                    ...prev,
                    profile: cloudinaryUrl
                }));
            }
            
            setLoading(false);
        }
    };

    const handleonchange = (event, key) => {
        setinputField(prev => ({
            ...prev,
            [key]: event.target.value
        }));
    };

    const handleRegister = async () => {
        setLoading(true);
        
        // ✅ Send to backend - profile contains Cloudinary URL
        await axios.post("/api/auth/register", inputField)
            .then((response) => {
                GotoLogin()
            })
            .catch(err => {
                console.log(err);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <div className='login'>
            {loading && <Loader />}
            
            <div className='Register-card'> 
                <div className='card-name'>Register</div>

                <div className='Login-form'>
                    <input 
                        type="number" 
                        value={inputField.mobilenumber}   
                        onChange={(event) => handleonchange(event, "mobilenumber")}  
                        className='inputbox' 
                        placeholder='Enter Number' 
                    />
                    <input 
                        type="password"
                        value={inputField.password}   
                        onChange={(event) => handleonchange(event, "password")}  
                        className='inputbox' 
                        placeholder='Enter Password'
                    />
                    <input 
                        type="text" 
                        value={inputField.name}     
                        onChange={(event) => handleonchange(event, "name")}  
                        className='inputbox' 
                        placeholder='Enter Name'
                    />
                    
                    {/* Image Upload Section */}
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            style={{ display: 'none' }}
                            id="image-upload"
                        />
                        <label htmlFor="image-upload">
                            <div className="circle-container">
                                {selectedImage ? (
                                    <img src={selectedImage} alt="Preview" className="circle-image" />
                                ) : (
                                    <span>Click to upload</span>
                                )}
                            </div>
                        </label>
                    </div>

                    <div 
                        onClick={loading ? null : handleRegister} 
                        className='button'
                        style={{ opacity: loading ? 0.6 : 1 }}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </div>
                    
                    <div className='LinkedLinks' onClick={GotoLogin}>
                        Already have an Account? Login
                    </div>
                </div>
            </div>
        </div> 
    );
};

export default Register;