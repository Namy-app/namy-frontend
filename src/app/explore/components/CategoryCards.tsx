"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { useCurrentUser } from "@/domains/user/hooks/query/useCurrentUser";
import { Card } from "@/shared/components/Card";

export function CategoryCards(): React.JSX.Element {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();

  return (
    <div className="px-4 sm:px-4 py-4 sm:py-5">
      <div className="flex flex-row gap-3 sm:gap-4 md:gap-3">
        <button
          onClick={() => router.push("/restaurants")}
          className="w-full flex-1"
        >
          <Card className="p-4 sm:p-8 bg-[#FFF5E9] shadow-[0px_4px_22px_0px_#00000040]shadow-[0_4px_10px_#FFEDD5] hover:shadow-glow transition-all group border-0 rounded-3xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6">
              <div className="flex sm:hidden shrink-0 w-20 h-20 bg-white/20 rounded-full items-center justify-center">
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                  <path d="M7 2v20" />
                  <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                </svg> */}
                <Image
                  width="68"
                  height="68"
                  src="/drink.svg"
                  alt="restairant Image"
                />
              </div>
              <div className="hidden sm:flex shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-full items-center justify-center">
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[#FF7B54] sm:w-10 sm:h-10 md:w-12 md:h-12"
                >
                  <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                  <path d="M7 2v20" />
                  <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                </svg> */}
                <Image
                  width="68"
                  height="68"
                  src="/drink.svg"
                  alt="Restairant Image"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p className="text-xs sm:text-lg font-extrabold text-[#F1A151]">
                  Descuentos en
                </p>
                <h2 className="text-xl sm:text-xl md:text-2xl font-bold text-[#423A33] mb-1 sm:mb-2">
                  Restaurantes
                </h2>
              </div>
            </div>
          </Card>
        </button>

        <button
          onClick={() => router.push("/service")}
          className="w-full flex-1"
        >
          <Card className="p-2 py-4 sm:py-0 sm:p-8 bg-[#F5F3FF] hover:shadow-glow transition-all group border-0 shadow-[0px_4px_22px_0px_#00000040] rounded-3xl">
            <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6">
              <div className="flex sm:hidden shrink-0 w-20 h-20 rounded-full items-center justify-center">
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white"
                >
                  <circle cx="6" cy="6" r="3" />
                  <circle cx="6" cy="18" r="3" />
                  <line x1="20" y1="4" x2="8.12" y2="15.88" />
                  <line x1="14.47" y1="14.48" x2="20" y2="20" />
                  <line x1="8.12" y1="8.12" x2="12" y2="12" />
                </svg> */}

                <Image
                  width="68"
                  height="68"
                  src="/flower.svg"
                  alt="restairant Image"
                />
              </div>
              <div className="hidden sm:flex shrink-0 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-full items-center justify-center">
                {/* <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-[hsl(var(--services))] sm:w-10 sm:h-10 md:w-12 md:h-12"
                >
                  <circle cx="6" cy="6" r="3" />
                  <circle cx="6" cy="18" r="3" />
                  <line x1="20" y1="4" x2="8.12" y2="15.88" />
                  <line x1="14.47" y1="14.48" x2="20" y2="20" />
                  <line x1="8.12" y1="8.12" x2="12" y2="12" />
                </svg> */}
                <Image
                  width="68"
                  height="68"
                  src="/flower.svg"
                  alt="restairant Image"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <p
                  className="text-xs sm:text-sm font-extrabold text-[#A07BF8];
"
                >
                  Descuentos en{" "}
                </p>{" "}
                <h2 className="text-xl sm:text-xl md:text-2xl font-bold text-[#423A33] mb-1 sm:mb-2 ">
                  Servicios
                </h2>
              </div>
            </div>
          </Card>
        </button>
      </div>

      {!isLoading && !user?.isPremium && (
        <div className="w-full mx-auto mt-4 sm:mt-5">
          <Card className="p-6 sm:p-8 bg-black hover:shadow-glow transition-all group border-0 shadow-lg rounded-3xl">
            <div className="flex sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
              {/* <div className="flex items-center justify-center gap-4 sm:gap-6"> */}
              <Image
                width="68"
                height="68"
                src="/premiumbadge.png"
                alt="restairant Image"
              />
              <div className="text-center">
                <h2 className="sm:text-xl text-lg font-bold text-white mb-0 sm:mb-1">
                  Más Descuentos Sin anuncios
                </h2>
                <button
                  onClick={() => router.push("/subscription")}
                  className="w-fit sm:hidden sm:w-fit mt-2 text px-4 sm:px-6 py-2 sm:py-3 bg-[#6C63FF] hover:bg-[#5B52E8] text-white font-semibold rounded-full transition-colors text-sm sm:text-md"
                >
                  Hazte Premium
                </button>
                {/* </div> */}
              </div>
              <button
                onClick={() => router.push("/subscription")}
                className="w-full hidden sm:block sm:w-auto shrink-0 px-6 sm:px-8 py-3 sm:py-4 bg-[#6C63FF] hover:bg-[#5B52E8] text-white font-semibold rounded-full transition-colors text-base sm:text-lg"
              >
                Hazte Premium
              </button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
