import React, { useEffect, useState } from 'react'

const Contact = ({listing}) => {
    const [landlord, setLandlord] = useState(null);
    const token = localStorage.getItem('token');
    
    useEffect(() => {
        const fetchLandlord = async () => {
            try {
                const res = await fetch(`http://localhost:3000/user/${listing.userRef}`,{
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                const data = await res.json();
                setLandlord(data);
            } catch (error) {
                console.error('Error fetching landlord:', error);
            }
        };
        fetchLandlord();
    }, [listing.userRef]);
    
  return (
    <>
    {landlord && (
        <div className=''>
            <p>Contact <span>{landlord.username}</span></p>
        </div>
    )}
    </>
  )
}

export default Contact