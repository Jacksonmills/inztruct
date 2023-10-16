'use client';

import Marquee from 'react-fast-marquee';
import { Logo } from './logo';
import { LogoAlt } from './logo-alt';

export default function TiltedMarquee() {
  return (
    <>
      <div className="relative top-12 lg:mb-32 lg:text-4xl">
        <div className="relative flex overflow-x-hidden mx-[-12rem] bg-black text-white dark:bg-white dark:text-black rotate-[4deg] p-4 lg:p-6 shadow-lg">
          <Marquee className="flex gap-12 marquee-seamless" autoFill speed={60}>
            <div className="flex gap-12">
              <Logo />
            </div>
          </Marquee>
        </div>
        <div className="relative -top-24 flex overflow-x-hidden mx-[-12rem] bg-black text-white dark:bg-white dark:text-black rotate-[-4deg] p-4 lg:p-6 shadow-lg">
          <Marquee
            className="flex gap-12 marquee-seamless"
            autoFill
            direction="right"
            speed={60}
          >
            <div className="flex gap-12">
              <LogoAlt />
            </div>
          </Marquee>
        </div>
      </div>
    </>
  );
}
