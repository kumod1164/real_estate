import { Link } from 'react-router-dom';
import { MdLocationOn } from 'react-icons/md';

const ListingItem = ({ listing }) => {
  return (
    <div className='group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden w-full max-w-[330px]'>
    <Link to={`/listing/${listing._id}`} className='block'>
      {/* Image Section */}
      <div className='relative h-[220px] sm:h-[280px] overflow-hidden'>
        <img
          src={
            listing.imageUrls?.[0] ||
            'https://53.fs1.hubspotusercontent-na1.net/hub/53/hubfs/Sales_Blog/real-estate-business-compressor.jpg?width=595&height=400&name=real-estate-business-compressor.jpg'
          }
          alt={listing.name || 'Property listing'}
          className='w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-105'
        />
        {/* Type Badge */}
        <div className='absolute top-3 right-3 bg-slate-800/90 text-white px-3 py-1 rounded-full text-xs font-semibold tracking-wide'>
          {listing.type === 'rent' ? 'FOR RENT' : 'FOR SALE'}
        </div>
      </div>
  
      {/* Content Section */}
      <div className='p-4 space-y-2'>
        {/* Title */}
        <h3 className='text-lg font-semibold text-slate-900 truncate'>
          {listing.name || 'No title'}
        </h3>
  
        {/* Location */}
        <div className='flex items-center gap-2 text-sm text-slate-600'>
          <MdLocationOn className='text-green-600 text-base' />
          <span className='truncate max-w-[200px]'>
            {listing.address || 'Location not specified'}
          </span>
        </div>
  
        {/* Description */}
        <p className='text-sm text-slate-600 line-clamp-2'>
          {listing.description || 'No description available'}
        </p>
  
        {/* Price and Amenities */}
        <div className='flex items-center justify-between mt-2'>
          <div className='flex items-center gap-1 text-slate-900'>
            <span className='text-sm text-slate-600'>$</span>
            <span className='text-xl font-semibold'>
              {listing.offer
                ? listing.discountPrice?.toLocaleString('en-US')
                : listing.regularPrice?.toLocaleString('en-US')}
            </span>
            {listing.type === 'rent' && (
              <span className='text-sm text-slate-600'>/month</span>
            )}
          </div>
  
          <div className='flex items-center gap-4 text-sm text-slate-600'>
            <div className='flex items-center gap-1'>
              <span className='font-medium text-slate-900'>
                {listing.bedrooms || 0}
              </span>
              <span>beds</span>
            </div>
            <div className='flex items-center gap-1'>
              <span className='font-medium text-slate-900'>
                {listing.bathrooms || 0}
              </span>
              <span>baths</span>
            </div>
          </div>
        </div>
      </div>
  
      {/* Hover Overlay */}
      <div className='absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center'>
        <div className='text-white text-center p-4'>
          <h3 className='text-lg font-semibold mb-1'>View Details</h3>
          <p className='text-sm'>Click to see more</p>
        </div>
      </div>
    </Link>
  </div>
  
  );
};

export default ListingItem;