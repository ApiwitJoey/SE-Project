import Image from 'next/image';


export default function Card({shopName , imgSrc} : {shopName:string  , imgSrc:string}) {
    return (
        <div className = 'w-1/5 h-[280px] rounded-lg shadow-lg mt-3'>
            <div className='w-full h-[70%] relative rounded-t-lg'>
                <Image src={imgSrc}
                alt='Product Picture'
                fill={true}
                objectFit='object-contain rounded-t-lg' />
            </div>
            <div className='w-full h-[30%] p-[10px]'>
                {shopName}
            </div>
        </div>
    );
}