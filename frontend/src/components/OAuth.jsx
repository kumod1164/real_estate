import { GoogleAuthProvider, getAuth, signInWithPopup,  } from 'firebase/auth';
import { app } from '../firebase.js';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';

const OAuth = () => {
  const dispatch = useDispatch();
  const handleGoogleClick = async () => {
    try {
      const provider = new GoogleAuthProvider(); 
      const auth = getAuth(app);
      const result = await signInWithPopup(auth, provider);

      const res = await fetch('/auth/google', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          photo: result.user.photoURL,
        }),
      });
      let data = null;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
        dispatch(signInSuccess(data));
      } else {
        console.log('No JSON response from backend');
      }
    } catch (error) {
      console.log('Could not sign in with google', error)  
    }
  }

  return (
  <div>
    <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-white p-3 rounded-lg uppercase hover:opacity-85 w-full'>Continue with google</button>
  </div>
  )
}

export default OAuth
