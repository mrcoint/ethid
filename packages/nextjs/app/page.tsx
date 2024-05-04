"use client";

import Link from "next/link";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex items-left flex-col flex-grow pt-10 mx-20">
        <div className="px-5">
          <h1 className="text-left my-5">
            <span className="block text-4xl font-bold">Every $1 Counts</span>
          </h1>
          <p className="text-left text-lg my-0">We&apos;re changing the lives of people in need,</p>
          <p className="text-left text-lg my-0">1 coffee at a time.</p>
        </div>

        <div className="flex-grow w-full mt-16 px-8">
          <div className="flex justify-center items-left gap-12 flex-col sm:flex-column">
            <Link href="/claim" passHref className="link">
              <div className="flex flex-col bg-base-100 px-5 py-2 text-center items-center max-w-48 rounded-3xl">
                {/* <GiftIcon className="h-8 w-8 fill-secondary" /> */}
                <p>Make a claim</p>
              </div>
            </Link>
            <Link href="/offramp" passHref className="link">
              <div className="flex flex-col bg-base-100 px-5 py-2 text-center items-center max-w-48 rounded-3xl">
                {/* <CurrencyDollarIcon className="h-8 w-8 fill-secondary" /> */}
                <p>Get paid</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
