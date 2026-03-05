import React, { useState, useEffect } from 'react';
import { MdDevices, MdSpeed, MdBadge, MdPhone, MdFingerprint, MdLocationCity, MdHome, MdSave, MdEdit } from 'react-icons/md';
import NishantProfilePic from '../assets/image/Nishant profile pic.jpeg';
import { profileAPI } from '../services/api';

// Get user data from localStorage
const getUserData = () => {
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const consumerName = localStorage.getItem('consumerName') || 'User';
    const meterSerialNumber = localStorage.getItem('meterSerialNumber') || 'Unknown';
    const mobileNo = localStorage.getItem('mobileNo') || '';
    const address = localStorage.getItem('address') || '';
    const zone = localStorage.getItem('zone') || '';
    const role = localStorage.getItem('role') || '';
    return { userData, consumerName, meterSerialNumber, mobileNo, address, zone, role };
};

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Get user data from localStorage
  const { consumerName, meterSerialNumber, mobileNo, address, zone, role } = getUserData();
  
  const [formData, setFormData] = useState({
    deviceId: meterSerialNumber || "",
    meterId: meterSerialNumber || "",
    customerId: meterSerialNumber || "",
    mobileNo: mobileNo || "",
    aadharNo: "XXXX-XXXX-1234", // Keep masked for security
    localityName: zone || "",
    address: address || "",
    role: role || ""
  });

  // Fetch profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Try to fetch from API, but use localStorage as fallback
        try {
          const profileData = await profileAPI.getProfile();
          console.log('👤 Profile API Response:', profileData);
          
          // Update form with real API data
          if (profileData && profileData.data) {
            const apiData = profileData.data;
            setFormData({
              deviceId: apiData.MeterSerialNumber || meterSerialNumber || "",
              meterId: apiData.MeterSerialNumber || meterSerialNumber || "",
              customerId: apiData.MeterSerialNumber || meterSerialNumber || "",
              mobileNo: apiData.MobileNo || mobileNo || "",
              aadharNo: "XXXX-XXXX-1234", // Keep masked for security
              localityName: apiData.Zone || zone || "",
              address: apiData.address || address || "",
              role: apiData.Role || role || ""
            });
            console.log('✅ Profile data loaded from API:', apiData);
            setSuccess('Profile updated successfully!');
          } else {
            console.log('⚠️ Invalid profile data format');
            // Use localStorage data as fallback
            const fallbackData = {
              deviceId: meterSerialNumber || "",
              meterId: meterSerialNumber || "",
              customerId: meterSerialNumber || "",
              mobileNo: mobileNo || "",
              aadharNo: "XXXX-XXXX-1234",
              localityName: zone || "",
              address: address || "",
              role: role || ""
            };
            setFormData(fallbackData);
            console.log('📋 Using localStorage data as fallback');
          }
        } catch (apiErr) {
          console.warn('Profile API failed:', apiErr);
          // Use localStorage data as fallback
          const fallbackData = {
            deviceId: meterSerialNumber || "",
            meterId: meterSerialNumber || "",
            customerId: meterSerialNumber || "",
            mobileNo: mobileNo || "",
            aadharNo: "XXXX-XXXX-1234",
            localityName: zone || "",
            address: address || "",
            role: role || ""
          };
          setFormData(fallbackData);
          console.log('📋 Using localStorage data as fallback due to API error');
        }
        
      } catch (err) {
        console.error('Profile data fetch error:', err);
        setError(err.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfileData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array - only run once

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      await profileAPI.updateProfile(formData);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">


      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center min-h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            <p className="text-stone-500">Loading profile data...</p>
          </div>
        </div>
      )}

      {/* Profile Content */}
      {!loading && (
        <>
          {/* Error and Success Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-red-100 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-green-800 text-sm">{success}</p>
              </div>
            </div>
          )}

          <div className="mb-8 flex justify-between items-end">
            <div>
               <h1 className="text-2xl font-bold text-stone-800">My Profile</h1>
               <p className="text-stone-500">Manage your personal information and preferences.</p>
            </div>
            <button 
                onClick={() => setIsEditing(!isEditing)}
                disabled={saving}
                className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${isEditing ? 'bg-stone-200 text-stone-700' : 'bg-amber-500 text-white hover:bg-amber-600'} disabled:opacity-50 disabled:cursor-not-allowed`}
            >
                {isEditing ? <><MdEdit /> Cancel Editing</> : <><MdEdit /> Edit Profile</>}
            </button>
          </div>

      <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
         <div className="flex flex-col md:flex-row gap-8 items-start">
             
             {/* Profile Picture Section */}
             <div className="flex flex-col items-center gap-4 w-full md:w-1/3">
                 <div className="relative group">
                    <img src={NishantProfilePic} alt="Profile" className="w-40 h-40 rounded-full object-cover border-4 border-amber-500 shadow-md" />
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white font-medium">
                        Change Photo
                    </div>
                 </div>
                 <div className="text-center">
                     <h3 className="text-lg font-bold text-stone-800">{consumerName}</h3>
                     <p className="text-sm text-stone-500">Customer ID: {formData.customerId}</p>
                 </div>
             </div>

             {/* Form Section */}
             <div className="flex-1 w-full space-y-6">
                 {/* Device ID */}
                 <div>
                     <label className="block text-sm font-medium text-stone-500 mb-1 ml-1" htmlFor="deviceId">Device ID</label>
                     <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             <MdDevices className="text-stone-400" />
                         </div>
                         <input 
                            type="text" name="deviceId" value={formData.deviceId} onChange={handleChange} disabled={!isEditing}
                            className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-stone-800 font-medium"
                         />
                     </div>
                 </div>

                 {/* Meter ID */}
                 <div>
                     <label className="block text-sm font-medium text-stone-500 mb-1 ml-1" htmlFor="meterId">Meter ID</label>
                     <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             <MdSpeed className="text-stone-400" />
                         </div>
                         <input 
                            type="text" name="meterId" value={formData.meterId} onChange={handleChange} disabled={!isEditing}
                            className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-stone-800 font-medium"
                         />
                     </div>
                 </div>

                 {/* Customer ID */}
                 <div>
                     <label className="block text-sm font-medium text-stone-500 mb-1 ml-1" htmlFor="customerId">Customer ID</label>
                     <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             <MdBadge className="text-stone-400" />
                         </div>
                         <input 
                            type="text" name="customerId" value={formData.customerId} onChange={handleChange} disabled={!isEditing}
                            className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-stone-800 font-medium"
                         />
                     </div>
                 </div>

                 {/* Mobile No */}
                 <div>
                     <label className="block text-sm font-medium text-stone-500 mb-1 ml-1" htmlFor="mobileNo">Mobile No</label>
                     <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             <MdPhone className="text-stone-400" />
                         </div>
                         <input 
                            type="text" name="mobileNo" value={formData.mobileNo} onChange={handleChange} disabled={!isEditing}
                            className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-stone-800 font-medium"
                         />
                     </div>
                 </div>

                 {/* Aadhar No */}
                 <div>
                     <label className="block text-sm font-medium text-stone-500 mb-1 ml-1" htmlFor="aadharNo">Aadhar No</label>
                     <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             <MdFingerprint className="text-stone-400" />
                         </div>
                         <input 
                            type="text" name="aadharNo" value={formData.aadharNo} onChange={handleChange} disabled={!isEditing}
                            className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-stone-800 font-medium"
                         />
                     </div>
                 </div>

                 {/* Locality Name */}
                 <div>
                     <label className="block text-sm font-medium text-stone-500 mb-1 ml-1" htmlFor="localityName">Locality Name</label>
                     <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             <MdLocationCity className="text-stone-400" />
                         </div>
                         <input 
                            type="text" name="localityName" value={formData.localityName} onChange={handleChange} disabled={!isEditing}
                            className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-stone-800 font-medium"
                         />
                     </div>
                 </div>

                 {/* Address */}
                 <div>
                     <label className="block text-sm font-medium text-stone-500 mb-1 ml-1" htmlFor="address">Address</label>
                     <div className="relative">
                         <div className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                             <MdHome className="text-stone-400" />
                         </div>
                         <textarea 
                            name="address" value={formData.address} onChange={handleChange} disabled={!isEditing} rows="3"
                            className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-stone-800 font-medium resize-none"
                         />
                     </div>
                 </div>

                 {/* Role */}
                 <div>
                     <label className="block text-sm font-medium text-stone-500 mb-1 ml-1" htmlFor="role">Role</label>
                     <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                             <MdBadge className="text-stone-400" />
                         </div>
                         <input 
                            type="text" name="role" value={formData.role} onChange={handleChange} disabled={!isEditing}
                            className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 disabled:opacity-60 disabled:cursor-not-allowed text-stone-800 font-medium"
                            readOnly
                         />
                     </div>
                 </div>

                 {isEditing && (
                     <div className="flex justify-end pt-4">
                         <button 
                             onClick={handleSave}
                             disabled={saving}
                             className="bg-amber-500 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-amber-600 transition flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                         >
                             {saving ? (
                                 <>
                                     <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                     Saving...
                                 </>
                             ) : (
                                 <>
                                     <MdSave /> Save Changes
                                 </>
                             )}
                         </button>
                     </div>
                 )}
             </div>
         </div>
      </div>
        </>
      )}
    </div>
  );
};

export default Profile;
