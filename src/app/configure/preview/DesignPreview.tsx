"use client";
import Phone from "@/components/Phone";
import { cn } from "@/lib/utils";
import { COLORS, MODELS } from "@/validators/options-validator";
import { Configuration } from "@prisma/client";
import { useEffect, useState } from "react";
import Confetti from "react-dom-confetti";

const DesignPreview = ({ configuration }: { configuration: Configuration }) => {
  const [showConfetti, setShowConfetti] = useState(false);

  const { color, model } = configuration;

  useEffect(() => setShowConfetti(true));

  const tw = COLORS?.find(
    (supportedColor) => supportedColor?.value === color
  )?.tw;

  const { label: modelLabel } = MODELS.options.find(
    ({ value }) => value === model
  )!;
  return (
    <>
      <div
        aria-hidden={true}
        className="pointer-events-none select-none absolute inset-0 overflow-hidden  flex justify-center"
      >
        <Confetti
          active={showConfetti}
          config={{
            angle: 90,
            spread: 360,
            startVelocity: 40,
            elementCount: 200,
            dragFriction: 0.12,
            duration: 3000,
            stagger: 3,
            width: "10px",
            height: "10px",
            colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
          }}
        />
      </div>
      <div className="  mt-20 grid grid-cols-2 text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6  md:gap-x-8 lg:gap-x-12">
        <div className=" col-span-2 items-center w-2/4 sm:w-full md:w-full sm:col-span-4 md:col-span-3 md:row-span-2 md:row-end-2 ">
          <Phone
            className={cn(`bg-${tw}`)}
            imgSrc={configuration?.croppedImageUrl!}
          />
        </div>
        <div className="mt-6 sm:col-span-9 sm:mt-0 md:row-end-1 text-center ">
          <h3 className="text-3xl font-bold  tracking-tight text-gray-800">
            Your {modelLabel} Case
          </h3>
        </div>
      </div>
    </>
  );
};

export default DesignPreview;
