import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Search = () => {
  const navigate = useNavigate();
  const [sidebardata, setSidebardata] = useState({
    searchTerm: '',
    type: 'all',
    parking: false,
    furnished: false,
    sort_order: 'created_at',
    order: 'desc',
  })

  const [loading, setLoading] = useState(false);
  const [listings, setListings] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('Current search parameters:', sidebardata);
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingFromUrl = urlParams.get('parking');
    const furnishedFromUrl = urlParams.get('furnished');
    const offerFromUrl = urlParams.get('offer');
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSidebardata({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl === 'true' ? true : false,
        furnished: furnishedFromUrl === 'true' ? true : false,
        offer: offerFromUrl === 'true' ? true : false,
        sort: sortFromUrl || 'created_at',
        order: orderFromUrl || 'desc',
      });
    }
  }, [location.search]);

  useEffect(() => {
    fetchListings();
  }, [sidebardata]);

  const fetchListings = async () => {
    setLoading(true);
    setError(null);
    try {
      const urlParams = new URLSearchParams();
      urlParams.set('searchTerm', sidebardata.searchTerm);
      urlParams.set('type', sidebardata.type);
      urlParams.set('parking', sidebardata.parking);
      urlParams.set('furnished', sidebardata.furnished);
      urlParams.set('sort', sidebardata.sort);
      urlParams.set('order', sidebardata.order);
      
      const searchQuery = urlParams.toString();
      console.log('Making API request with query:', searchQuery);
      
      const res = await fetch(`http://localhost:3000/listing/get?${searchQuery}`);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log('Received data:', data);
      
      if (data.success) {
        setListings(data.listings || []);
      } else {
        setError(data.message || 'Failed to fetch listings');
        setListings([]);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
      setError(error.message);
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    console.log('Changing:', e.target.id, e.target.value);
    if(e.target.id ==='all' || e.target.id === 'rent' || e.target.id === 'sale') {
      setSidebardata({...sidebardata, type: e.target.id});
    }
    
    if(e.target.id === 'searchTerm') {
      setSidebardata({...sidebardata, searchTerm: e.target.value});
    }

    if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
      setSidebardata({...sidebardata, [e.target.id]: e.target.checked});
    }
    
    if(e.target.id === 'sort_order') {
      const [sort, order] = e.target.value.split('_') || ['created_at', 'desc'];
      setSidebardata({...sidebardata, sort_order: sort, order});
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitting search with:', sidebardata);
    fetchListings();
  };

  return (
    <div className='flex flex-col md:flex-row'>
      <div className="p-7 border-b-2 md:border-r-2 md:min-h-screen">
        <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
          <div className="flex items-center gap-2">
            <label className='whitespace-nowrap font-semibold'>Search Term:</label>
            <input type="text" id='searchTerm' placeholder='search...' className='border rounded-lg p-3 w-full' value={sidebardata.searchTerm}   onChange={handleChange}/>
          </div>
          <div className='flex gap-2 flex-wrap items-center'>
            <label className='whitespace-nowrap font-semibold'  >Type:</label>
            <div className="flex gap-2">
              <input type="checkbox" id='all' className='w-5' onChange={handleChange} checked={sidebardata.type === 'all'} />
              <span>Rent & Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id='rent' className='w-5' onChange={handleChange} checked={sidebardata.type === 'rent'}   />
              <span>Rent</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id='sale' className='w-5' onChange={handleChange} checked={sidebardata.type === 'sale'}   />
              <span>Sale</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id='offer' className='w-5' onChange={handleChange} checked={sidebardata.offer} />
              <span>Offer</span>
            </div>
          </div>

          <div className='flex gap-2 flex-wrap items-center'>
            <label className='whitespace-nowrap font-semibold'>Amenities:</label>
            <div className="flex gap-2">
              <input type="checkbox" id='parking' className='w-5' onChange={handleChange} checked={sidebardata.parking} />
              <span>Parking</span>
            </div>
            <div className="flex gap-2">
              <input type="checkbox" id='furnished' className='w-5' onChange={handleChange} checked={sidebardata.furnished} />
              <span>Furnished</span>
            </div>
        </div>

            <div className="flex items-center gap-2 flex-wrap focus:outline-none focus:ring-2 focus:ring-slate-700">  
              <label className='whitespace-nowrap font-semibold'>Sort:</label>
              <select onChange={handleChange} defaultValue={'created_at_desc'} id="sort_order" className='border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-slate-700  '>
                <option value='regularPrice_desc'>Price high to low</option>
                <option value='regularPrice_asc'>Price low to high</option>
                <option value='created_at_desc'>Latest</option>
                <option value='created_at_asc'>Oldest</option>
              </select>
            </div>
            <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95'>Search</button>
         
        </form>
      </div>
      <div className="div">
        <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing results:</h1>
      </div>
    </div>
  )
}

export default Search