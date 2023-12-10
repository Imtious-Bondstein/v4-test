import React from 'react';
import Link from 'next/link'
import NotFound404SVG from '@/components/SVG/NotFound404SVG';
import Layout from '@/components/layouts/Layout';

const Custom404 = () => {
    return (
        <div>
            {/* <NotFound404SVG /> */}
            <div className='text-[#6A7077] '><span className='font-semibold'>Oops!</span> Something went wrong, the page could not be found!</div>
            {/* <Link href="/">
                <div className='w-48 bg-gradient tmv-shadow'>
                    Go back home
                </div>
            </Link> */}
        </div>
    );
};

export default Custom404;

Custom404.getLayout = function getLayout(page) {
    return (
        <Layout>
            {page}
        </Layout>
    );
};