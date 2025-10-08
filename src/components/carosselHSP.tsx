"use client";

import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

// Importe as imagens locais
import slide1 from "../../public/images/biblia.png";
import slide2 from "../../public/images/microfone.png";
import slide3 from "../../public/images/cruz.png";

export function CarouselHSP() {
  const plugin = React.useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));

  // Array com as imagens importadas
  const images = [slide1, slide2, slide3];

  return (
    <Carousel
      plugins={[plugin.current]}
      className=" max-w-2xl  bg-telas"
    >
      <CarouselContent>
        {images.map((src, index) => (
          <CarouselItem key={index}>
            {/* Removi o padding externo */}
            <div className="p-0">
              <Card className="h-full border-0 shadow-none"> {/* Remove borda e sombra */}
                <CardContent className="flex items-center justify-center p-0 h-[500px]"> {/* Altura fixa */}
                  <img
                    src={src.src}
                    alt={`Slide ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}