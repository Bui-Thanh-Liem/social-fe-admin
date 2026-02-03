import { Card, CardContent } from "~/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";

const carouselItems = [
  "Tất cả",
  "Công khai",
  "Riêng tư",
  "Mở",
  "Đóng",
  "Công khai",
  "Riêng tư",
  "Mở",
  "Riêng tư",
  "Mở",
  "Đóng",
  "Công khai",
  "Riêng tư",
  "Mở",
  "Riêng tư",
];

export function HomePage() {
  return (
    <div className="space-y-4">
      {/* Banner */}
      <div className="h-36 rounded-lg bg-sky-200"></div>

      {/* Carousel */}
      <Carousel>
        <CarouselContent>
          {carouselItems.map((_) => (
            <CarouselItem key={_} className="basis-1/2 lg:basis-1/9">
              <Card className="py-3 rounded-lg border-gray-200">
                <CardContent className="flex items-center justify-center">
                  <span className="text-[15px] font-medium">{_}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>

      {/*  */}
      <div className="grid grid-cols-7 gap-x-4">
        {/*  */}
        <div className="rounded-lg p-3 bg-amber-200 col-span-4">
          <div className="flex justify-between items-center">
            <p>Phổ biến nhất</p>
            <p>xem thêm</p>
          </div>
          <div className="grid grid-cols-4 gap-2 mt-3">
            {carouselItems.slice(0, 8).map((_) => (
              <div
                key={_}
                className="rounded-lg flex items-center justify-center h-12 bg-white col-span-1"
              >
                {_}
              </div>
            ))}
          </div>
        </div>

        {/*  */}
        <div className="rounded-lg bg-sky-500 col-span-3 p-3">
          <div className="flex justify-between items-center">
            <p>Phổ biến nhất</p>
            <p>xem thêm</p>
          </div>
          <Carousel className="mt-3">
            <CarouselContent>
              {carouselItems.map((_) => (
                <CarouselItem key={_} className="basis-1/2 lg:basis-1/4 ">
                  <Card className="rounded-lg border-gray-200 h-26">
                    <CardContent className="flex items-center justify-center h-full">
                      <span className="text-[15px] font-medium ">{_}</span>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-0" />
            <CarouselNext className="right-0" />
          </Carousel>
        </div>
      </div>

      {/*  */}
      <div className="grid grid-cols-5 gap-x-4">
        <div className="rounded-lg h-95 bg-amber-200"></div>
        <div className="rounded-lg h-95 bg-sky-500 "></div>
        <div className="rounded-lg h-95 bg-amber-200"></div>
        <div className="rounded-lg h-95 bg-sky-500 "></div>
        <div className="rounded-lg h-95 bg-amber-200"></div>
      </div>
    </div>
  );
}
