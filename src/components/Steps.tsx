"use client";

import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const STEPS = [
  {
    name: "Step 1 : Add Image",
    description: "Choose an image for your case",
    url: "/upload",
  },
  {
    name: "Step 2 :Customize design",
    description: "Make the case yours",
    url: "/design",
  },
  {
    name: "Step 3 :Summery",
    description: "Rivew your final design",
    url: "/preview",
  },
];

const Steps = () => {
  const pathname = usePathname();

  console.log("=========");
 
  return (
    <div>
      <ol className="rounded-md lg:border-r lg:border-gray-200">
        {STEPS.map((step, i) => {
          const isCurrent = pathname.endsWith(step.url);
          const isCompleted = STEPS.slice(i + 1).some((step) => {
            pathname.endsWith(step.url);
          });


          return (
            <li key={step.name} className="relative overflow-hidden lg:flex-1">
              <div>
                <span
                  className={cn(
                    "absolute left-0 top-0 h-full w-1 bg-zinc-400 lg:bottom-0 lg:top-auto lg:w-full",
                    { "bg-zinc-700": isCurrent, "bg-primary": isCompleted }
                  )}
                  aria-hidden="true"
                >
                  <span
                    className={cn(
                      i !== 0 ? "lg:pl-9" : "",
                      "flex items-center  py-4 text-sm font-medium"
                    )}
                  >
                    <span className="flex-shrink-0">
                      <img
                        src={imgPath}
                        className={cn(
                          "flex h-20 w-20 object-contain items-center justify-center",
                          {
                            "border-none": isCompleted,
                            "border-zinc-700": isCurrent,
                          }
                        )}
                        alt=""
                      />
                    </span>
                    <span className="ml-4 h-full mt-0.5 flex min-w-0 flex-col justify-center">
                      <span
                        className={cn("text-sm font-semibold text-zinc-700", {
                          "text-primary": isCompleted,
                          "text-zinc-700": isCurrent,
                        })}
                      >
                        {step.name}
                      </span>
                      <span className="text-sm text-zinc-500">
                        {step.description}
                      </span>
                    </span>
                  </span>
                </span>
              </div>
            </li>
          );
        })}
      </ol>
      <></>
    </div>
  );
};

export default Steps;
