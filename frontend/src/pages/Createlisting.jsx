import React, { useState, useEffect } from 'react';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { app } from '../firebase';

const Createlisting = () => {
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    imageFiles: [],
    name: '',
    description: '',
    address: '',
    sell: false,
    rent: false,
    parking: false,
    furnished: false,
    offer: false
  });
  const [uploading, setUploading] = useState(false);
  const [user, setUser] = useState(null);
  const auth = getAuth(app);

  // Check authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return unsubscribe;
  }, [auth]);

  // Handle file selection
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length > 0 && selectedFiles.length <= 7) {
      setFiles(selectedFiles);
      setFormData(prev => ({
        ...prev,
        imageFiles: selectedFiles
      }));
    }
  };
  
  const handleImageSubmit = (e) => {
    if (!user) {
      console.error('User must be authenticated to upload images');
      return;
    }
    
    if(files.length > 0 && files.length <= 7) {
      setUploading(true);
      const promises = [];
      
      for(let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
      .then((urls) => {
        setFormData({...formData, imageUrls: formData.imageUrls.concat(urls)});
        console.log("All image URLs in form data:", formData.imageUrls);
      })
      .catch((error) => {
        console.error('Error uploading images:', error);
      })
      .finally(() => {
        setUploading(false);
      });
    };

  }; 
   const storeImage = async (file) => {
      return new Promise((resolve, reject) => {
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log(`Upload progress: ${progress}%`);
          },  
          (error) => {
            console.error('Upload failed:', error.message || error);
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              resolve(downloadURL);
            });
          }
        );
      })
   }


   const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index) 
    })
   }  

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-2xl font-semibold text-center my-5'>Create a Listing</h1>
      <form className='flex flex-col sm:flex-row gap-4'>
        {/* Left Side */}
        <div className='flex flex-col gap-4 flex-1'>
          <input
            type="text"
            placeholder='Name'
            className='border p-2 rounded-lg'
            id='name'
            maxLength='62'
            minLength='10'
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />
          <textarea
            placeholder='Description'
            className='border p-2 rounded-lg'
            id='description'
            required
          ></textarea>
          <input
            type="text"
            placeholder='Address'
            className='border p-2 rounded-lg'
            id='address'
            required
          />

          {/* File Upload */}
          <div className="mb-4">
            <input
              type="file"
              multiple
              accept="image/*"
              className="border p-2 rounded-lg"
              onChange={handleFileChange}
            />
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6 flex-wrap">
            <div className='flex gap-2'>
              <input type="checkbox" id='sell' className='w-5' />
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id='rent' className='w-5' />
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id='parking' className='w-5' />
              <span>Parking spot</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id='furnished' className='w-5' />
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" id='offer' className='w-5' />
              <span>Offer</span>
            </div>
          </div>

          {/* Inputs for beds, baths, price */}
          <div className='flex gap-4 flex-wrap'>
            <div className='flex items-center gap-2'>
              <input
                type="number"
                id='bedrooms'
                min='1'
                max='10'
                required
                className='p-2 border border-gray-300 rounded-lg'
              />
              <p>Beds</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type="number"
                id='bathrooms'
                min='1'
                max='10'
                required
                className='p-2 border border-gray-300 rounded-lg'
              />
              <p>Baths</p>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type="number"
                id='regularprice'
                min='1'
                max='10'
                required
                className='p-2 border border-gray-300 rounded-lg'
              />
              <div className='flex flex-col items-center'>
                <p>Regular price</p>
                <span className='text-xs'>(₹ / Month)</span>
              </div>
            </div>
            <div className='flex items-center gap-2'>
              <input
                type="number"
                id='discountprice'
                min='1'
                max='10'
                required
                className='p-2 border border-gray-300 rounded-lg'
              />
              <div className='flex flex-col items-center'>
                <p>Discounted price</p>
                <span className='text-xs'>(₹ / Month)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex flex-col flex-1 gap-4">
          <p className='font-semibold'>
            Images:
            <span className='font-normal text-gray-600 ml-2'>
              The first image will be the cover (max 6)
            </span>
          </p>
          <div className='flex gap-4'>
            <input
              onChange={(e)=>setFiles(e.target.files)}
              className='p-3 border border-gray-300 rounded w-full'
              type="file"
              id='images'
              accept='image/*'
              multiple
            />
            <button disabled={uploading}  type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg disabled:opacity-80'>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

            {
              formData.imageUrls.length > 0 && formData.imageUrls.map((url, index) => (
                <div key={url} className="flex justify-between p-3 border items-center">
                 <img src={url} alt="listing image" className='w-20 h-20 object-contain rounded-lg' />
                 <button type='button' onClick={() => handleRemoveImage(index)} className='text-red-700 hover:opacity-80'>
                   Remove
                 </button>
                </div>
              ))
            }

          <button className='p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
            Create Listing
          </button>
        </div>
      </form>
    </main>
  );
};

export default Createlisting;
