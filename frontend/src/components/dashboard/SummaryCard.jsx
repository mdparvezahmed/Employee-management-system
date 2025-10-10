import React from 'react'

const SummaryCard = ({ icon, text, number, bgcolor }) => {
    return (
        <div className='rounded flex items-center gap-4 p-4 bg-gray-800 shadow'>
            <div className={`text-3xl text-blue-500 ${bgcolor} p-2`}>
                {icon}
            </div>

            <div className='flex flex-col'>
                <p className='text-sm text-gray-400'>
                    {text}
                </p>
                <p className='text-lg font-semibold'>
                    {number}
                </p>
            </div>
        </div>
    )
}

export default SummaryCard
