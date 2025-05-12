import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import {useSelector} from 'react-redux';


const Header = () => {
  const {currentUser} = useSelector((state) => state.user);
  return (
    <>
      <header className='bg-slate-200 shadow-md'>
        <div className='flex justify-between items-center  max-w-6xl mx-auto p-4'>
            <Link to='/'>
        <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Bhavani</span>
            <span className='text-slte-700'>Estate</span>
        </h1>
        </Link>
        <form className='bg-slate-100 p-2 rounded-lg flex items-center'>
            <input type="text" placeholder='search...'
            className='bg-transparent focus:outline-none w-64 sm:w-80' />
            <FaSearch className='text-slate-600' />
        </form>
        <ul className='flex gap-4'>
            <li className='hidden sm:inline text-slate-800 hover:underline'>
              <Link to='/'>Home</Link>
            </li>
            <li className='hidden sm:inline text-slate-800 hover:underline'>
              <Link to='/about'>About</Link>
            </li>
            {currentUser ? (
              <li>
                <Link to='/profile'>
                  <img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt="profile" />
                </Link>
              </li>
            ) : (
              <li className='text-slate-700 hover:underline'>
                <Link to='/signin'>Sign in</Link>
              </li>
            )}
        </ul>
        </div>
      </header>
    </>
  )
}

export default Header
