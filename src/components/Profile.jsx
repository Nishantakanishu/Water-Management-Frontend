import React, { useState } from 'react';
import { MdDevices, MdSpeed, MdBadge, MdPhone, MdFingerprint, MdLocationCity, MdHome, MdSave, MdEdit } from 'react-icons/md';
import NishantProfilePic from '../assets/image/Nishant profile pic.jpeg';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    deviceId: "DEV12345678",
    meterId: "MTR98765432",
    customerId: "ANN2411",
    mobileNo: "+91 98765 43210",
    aadharNo: "XXXX-XXXX-1234",
    localityName: "Green Park Extension",
    address: "123, Block A, Green Park, New Delhi - 110016"
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8 flex justify-between items-end">
        <div>
           <h1 className="text-2xl font-bold text-stone-800">My Profile</h1>
           <p className="text-stone-500">Manage your personal information and preferences.</p>
        </div>
        <button 
            onClick={() => setIsEditing(!isEditing)}
            className={`px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors ${isEditing ? 'bg-stone-200 text-stone-700' : 'bg-amber-500 text-white hover:bg-amber-600'}`}
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
                     <h3 className="text-lg font-bold text-stone-800">Ramkishore S/O Patan Deen</h3>
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

                 {isEditing && (
                     <div className="flex justify-end pt-4">
                         <button className="bg-amber-500 text-white px-6 py-2 rounded-lg font-bold shadow-md hover:bg-amber-600 transition flex items-center gap-2">
                             <MdSave /> Save Changes
                         </button>
                     </div>
                 )}
             </div>
         </div>
      </div>
    </div>
  );
};

export default Profile;
