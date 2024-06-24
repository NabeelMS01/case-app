"use client";
import Phone from "@/components/Phone";
import { Button } from "@/components/ui/button";
import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { cn, formatPrice } from "@/lib/utils";
import { COLORS, FINISHES, MODELS } from "@/validators/options-validator";
import { Configuration } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { ArrowRight, Check } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Confetti from "react-dom-confetti";
import { createCheckoutSession } from "./actions";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'
import LoginModel from "@/components/LoginModel";

const DesignPreview = ({ configuration }: { configuration: Configuration }) => {

  const {id} = configuration
  const router = useRouter();
  const {user} = useKindeBrowserClient()
  const [isLoginModelOpen,setIsLoginModelOpen] = useState(false)
  const { toast } = useToast();
  const [showConfetti, setShowConfetti] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const { color, model, finish, material } = configuration;
  const [isInteracted, setIsInteracted] = useState(false);

  const playConfettiWithSound = () => {
    setShowConfetti(true);
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
  };

  useEffect(() => {
    const handleUserInteraction = () => {
      localStorage.setItem("userInteracted", "true");
      playConfettiWithSound();
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };

    if (localStorage.getItem("userInteracted") === "true") {
      playConfettiWithSound();
    } else {
      window.addEventListener("click", handleUserInteraction);
      window.addEventListener("keydown", handleUserInteraction);
    }

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("keydown", handleUserInteraction);
    };
  }, []);

  const tw = COLORS?.find(
    (supportedColor) => supportedColor?.value === color
  )?.tw;

  const { label: modelLabel } = MODELS.options.find(
    ({ value }) => value === model
  )!;

  let totalPrice = BASE_PRICE;
  if (material === "polycarbonate")
    totalPrice += PRODUCT_PRICES.material.polycarbonate;

  if (material === "metal") totalPrice += PRODUCT_PRICES.material.metal;

  if (finish === "textured") totalPrice += PRODUCT_PRICES.finish.textured;

  const { mutate: CreatePaymentSession } = useMutation({
    mutationKey: ["get-checkout-session"],
    mutationFn: createCheckoutSession,
    onSuccess: ({ url }) => {
      if (url) {
        router.push(url);
      } else {
        throw new Error("Unable to retrieve payment url");
      }
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "There was an error on our end please try again",
        variant: "destructive",
      });
    },
  });

  const handleCheckout = ()=>{
    if(user){
      // create paymetn session
      CreatePaymentSession({configId:id})

    }else{
      // need to login;
      localStorage.setItem('configurationId',id)
      setIsLoginModelOpen(true)
    }
  }

  return (
    <>
      <div
        aria-hidden={true}
        className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center "
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
      <LoginModel isOpen ={isLoginModelOpen} setIsOpen={setIsLoginModelOpen} />
      <div className="mt-20 grid grid-cols-1 text-sm sm:grid-cols-12 sm:grid-rows-1 sm:gap-x-6 md:gap-x-8 lg:gap-x-12 mb-5">
        <div className="col-span-1 flex max-w-md justify-center   items-center  sm:col-span-4 md:col-span-3 md:row-span-2 md:row-end-2">
          <Phone
            className={cn(
              `bg-${tw}  w-1/2 sm:w-full md:w-full lg:w-full xl:w-full`
            )}
            imgSrc={configuration?.croppedImageUrl!}
          />
        </div>
        <div className="mt-6 sm:col-span-8 sm:mt-0 md:row-end-1 text-center">
          <h3 className="text-3xl font-bold tracking-tight text-gray-800">
            Your {modelLabel} Case
          </h3>
          <div className="mt-3 flex items-center gap-1.5 text-base">
            <Check className="h-4 w-4 text-green-500" />
            In stock and ready to ship
          </div>
        </div>
        <div className="sm:col-span-12 items-center md:col-span-9 text-base">
          <div className="grid grid-cols-1  gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:py-6 md:py-10">
            <div>
              <p className="font-medium text-zinc-950">Highlights</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>Wirless charging compatible</li>
                <li>TPU shock absortion</li>
                <li>Packaging made from recycled material</li>
                <li>5 year warranty</li>
              </ol>
            </div>

            <div>
              <p className="font-medium text-zinc-950 ">Material</p>
              <ol className="mt-3 text-zinc-700 list-disc list-inside">
                <li>High quality durable material</li>
                <li>Scratch and finger print resistant coating</li>
              </ol>
            </div>
          </div>
          <div className="mt-8">
            <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
              <div className="flow-root text-sm">
                <div className="flex items-center justify-between py-1 mt-2">
                  <p className="text-gray-600">Base price</p>
                  <p className="font-medium text-gray-900">
                    {formatPrice(BASE_PRICE / 100)}
                  </p>
                </div>

                {finish === "textured" ? (
                  <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">Textured Finish</p>
                    <p className="font-medium text-gray-900">
                      {formatPrice(
                        (BASE_PRICE + PRODUCT_PRICES.finish.textured) / 100
                      )}
                    </p>
                  </div>
                ) : null}

                {material === "polycarbonate" ? (
                  <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">Soft Polycarbonate material</p>
                    <p className="font-medium text-gray-900">
                      {formatPrice(
                        (BASE_PRICE + PRODUCT_PRICES.material.polycarbonate) /
                          100
                      )}
                    </p>
                  </div>
                ) : null}

                {material === "metal" ? (
                  <div className="flex items-center justify-between py-1 mt-2">
                    <p className="text-gray-600">Metal case</p>
                    <p className="font-medium text-gray-900">
                      {formatPrice(
                        (BASE_PRICE + PRODUCT_PRICES.material.metal) / 100
                      )}
                    </p>
                  </div>
                ) : null}

                <div className="my-2 h-px bg-gray-200" />

                <div className="flex items-center justify-between py-2">
                  <p className="font-semibold text-gray-900"> Order Total</p>
                  <p className="font-semibold text-gray-900">
                    {formatPrice(totalPrice / 100)}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end pb-12">
              <Button
                disabled={false}
                isLoading={false}
                onClick={() =>
                  // CreatePaymentSession({ configId: configuration.id })
                  handleCheckout()
                }
                className=" px-4 sm:px-6 lg:px-8"
              >
                Checkout <ArrowRight className="h-4 w-4 ml-1.5 inline" />
              </Button>
            </div>
          </div>
        </div>
        {/* <audio ref={audioRef} src="/confetti-pop.mp3" /> */}
      </div>
    </>
  );
};

export default DesignPreview;
