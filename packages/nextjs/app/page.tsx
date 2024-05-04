"use client";

import Image from "next/image";
import Link from "next/link";
import type { NextPage } from "next";
import Chat from "~~/components/chat/chat";

const Home: NextPage = () => {
  return (
    <>
      <div className="flex flex-row bg-[url('/background-kids.jpeg')] bg-cover">
        <div className="flex items-left flex-col flex-grow pt-10 sm:px-5 md:px-10 lg:px-20 ">
          <div className="px-5">
            <span className="flex items-left">
              <Image
                alt="nouns glasses"
                className="my-8 mr-4"
                width={160}
                height={60}
                src="/yellow-orange-multi160px.png"
              />
              <h1 className="block my-8 text-6xl font-bold">TrueReach</h1>
            </span>
            <h2 className="text-left">
              <span className="block text-4xl font-bold">Every $1 Counts</span>
            </h2>
            <p className="text-left text-lg my-0">We&apos;re changing the lives of people in need,</p>
            <p className="text-left text-lg my-0">1 coffee at a time.</p>
          </div>

          <div className="flex-grow max-w-56 mt-12 px-4">
            <div className="flex justify-center items-left gap-12 flex-col sm:flex-column">
              <Link href="/claim" passHref className="link">
                <div className="flex flex-col bg-base-100 px-5 py-0 text-center items-center max-w-48 rounded-3xl">
                  {/* <GiftIcon className="h-8 w-8 fill-secondary" /> */}
                  <p>Make a claim</p>
                </div>
              </Link>
              <Link href="/offramp" passHref className="link">
                <div className="flex flex-col bg-base-100 px-5 py-0 text-center items-center max-w-48 rounded-3xl">
                  {/* <CurrencyDollarIcon className="h-8 w-8 fill-secondary" /> */}
                  <p>Get paid</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="p-20">
          <Chat />
        </div>
      </div>
    </>
  );
};

export default Home;
