import React from 'react';

const GreenFlagSVG = () => {
    return (
        <div className='relative'>
            <span className="animate-ping absolute top-[25px] left-2  inline-flex h-6 w-6 rounded-full bg-[#00AE65] opacity-50"></span>
            <svg width="41" height="58" viewBox="0 0 41 58" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M37.5 0H18V32H20V14H37.5V13L34 7L37.5 1V0Z" fill="#00AE65" />
                {/* <circle cx="20.0298" cy="37.0295" r="18.4603" transform="rotate(5.10443 20.0298 37.0295)" fill="#00AE65" fillOpacity="0.2" /> */}
                <circle cx="20.0289" cy="37.0285" r="12.8619" transform="rotate(5.10443 20.0289 37.0285)" fill="#00AE65" fillOpacity="0.5" />
                <circle cx="20.0297" cy="37.0292" r="7.99865" transform="rotate(5.10443 20.0297 37.0292)" fill="#00AE65" />
                <circle cx="20.0294" cy="37.0288" r="1.75826" transform="rotate(5.10443 20.0294 37.0288)" fill="white" />
            </svg>
        </div>
    );
};

export default GreenFlagSVG;