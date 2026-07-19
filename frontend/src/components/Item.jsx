import React from 'react'
import { Link } from 'react-router-dom'
import {FaHeart} from "react-icons/fa"
import {MdOutlineBed,MdOutlineBathtub,MdOutlineGarage} from "react-icons/md"
import { CgRuler } from 'react-icons/cg'



const Item = ({property}) => {
  return (
    <div className='rounded-lg overflow-hidden bg-white ring-1 ring-slate-900/5'>
        {/* IMAGE */}
        <div className='relative'>
            <Link to={`/property/${property.id}`}>
                <img src={property.image} alt={property.title} className='h-[13rem] w-full aspect-square object-cover cursor-pointer hover:opacity-90 transition-opacity' />
            </Link>
            <div className='absolute top-4 right-6'>
                <FaHeart className='text-white text-lg'/>
            </div>
        </div>
        {/* INFO */}
        <div className='m-3'>
            <div className='flexBetween'>
                <div className='flex items-center gap-x-2'>
                    <h5 className='bold-16 my-1 text-secondary'>{property.city}</h5>
                    {property.distance !== undefined && property.distance !== null && (
                        <span className='bg-blue-50 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full border border-blue-100'>
                            {property.distance.toFixed(1)} km away
                        </span>
                    )}
                </div>
                <h4 className='h4'>${property.price}.00</h4>
            </div>
            <Link to={`/property/${property.id}`}>
                <h4 className='medium-18 line-clamp-1 hover:text-secondary transition-colors cursor-pointer'>{property.title}</h4>
            </Link>
            <div className='flex gap-x-2 py-2'>
                <div className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'>
                    <MdOutlineBed/> {property.facilities.bedrooms}
                </div>
                <div className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'>
                    <MdOutlineBathtub/> {property.facilities.bathrooms}
                </div>
                <div className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'>
                    <MdOutlineGarage/> {property.facilities.parkings}
                </div>
                <div className='flexCenter gap-x-2 border-r border-slate-900/50 pr-4 font-[500]'>
                    <CgRuler/> 400
                </div>
            </div>
            <p className='pt-2 mb-4 line-clamp-2'>{property.description}</p>
        </div>
    </div>
  )
}

export default Item