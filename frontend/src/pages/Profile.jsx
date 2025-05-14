import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage';
import { app } from "../firebase";
import {updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure} from "../redux/user/userSlice.js"
import { useDispatch } from "react-redux";

import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const navigate = useNavigate();
  const fileRef = useRef(null);
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileuploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [uploadProgress, setUploadProgress] = useState(0);
  const [updateSuccess, setUpdateSuccess] = useState(false);
 
  useEffect(() => {
    if(file) {
      handleFileUpload(file);
    }
  }, [file]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
        setUploadProgress(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.error('Upload error:', error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then
        ((downloadURL) => 
          setFormData({...formData, avatar: downloadURL})
      );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value})
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("this is form data", formData)
    try {

      dispatch(updateUserStart());
      const res = await fetch(`http://localhost:3000/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

        const data = await res.json();
        if (data.success === false) {
          dispatch(updateUserFailure(data.message));
          return;
        }
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      console.log('Current User Object:', currentUser);
      const res = await fetch(`http://localhost:3000/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${currentUser.token}`,
        },
      });

      const data = await res.json();
      console.error('Delete request failed:', res.status, data);
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
      navigate('/signin');
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  return (
    <div className="p-3 max-w-lg mx-auto rounded-lg">
      <h1 className="text-3xl font-semibold text-center my-3">Profile</h1>
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="text-center text-blue-600 my-1">
          Uploading: {uploadProgress}%
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input onChange={(e) => setFile(e.target.files[0]) } type="file" ref={fileRef} hidden accept="image/*"/>
        <img
          onClick={(()=>fileRef.current.click())}
          src={ formData.avatar ||  currentUser?.avatar} 
          alt="profile"
          className="rounded-full h-20 w-20 object-cover cursor-pointer self-center mt-1 "
        />
        <p className="text-sm self-center">
          {fileuploadError ? 
        (<span className="text-red-600">Error Image upload</span>)  :
        filePerc > 0 && filePerc < 100 ? (
          <span className="text-green-600">{`Uploading ${filePerc}`}</span>)
          :
          filePerc === 100 ? (
            <span className="text-green-600">successfully uploaded!</span>)
            : (
              ''
            )}
        </p>
        <input
          type="text"
          placeholder="username"
          defaultValue={currentUser.username}
          id="username"
          className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
        />
        <input
          type="email"
          placeholder="email"
          defaultValue={currentUser.email}
          id="email"
          className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
        />
        <input
          type="password"
          id="password"
          className="border p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={handleChange}
        />
        <button disabled={loading} className="bg-slate-600 text-white rounded-lg p-2 uppercase hover:opacity-90 disabled:opacity-80">
          {loading ? 'loading...' : 'Update'}
        </button>
      </form>

      <div className="flex justify-between mt-3">
        <span onClick={handleDeleteUser} className="text-red-600 cursor-pointer">Delete account</span>
        <span className="text-red-600 cursor-pointer">Sign out</span>
      </div>
      <div className="flex justify-between mt-3">
        <p className="text-red-600">{error ? error : ''}</p>
        <p className="text-green-700 mt-3">{updateSuccess ? 'User updated successfully' : ''}</p>
      </div>
    </div>
  );
};

export default Profile;

 //  Firebase storage
      // allow read;
      // allow write:if 
      // request.resource.size < 2 * 1024 * 1024 &&
      // request.resource.contentType.matches('image/.*')