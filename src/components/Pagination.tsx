import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Box, Button } from "@material-ui/core";

// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/swiper-bundle.min.css';

type PaginationButtonProps = {
  children: any;
  active: boolean;
  onClick: () => void;
  style?: any;
}

type NavigationButtonProps = {
  icon: any,
  className?: string,
  onClick: () => void,
  canNext: boolean,
  hidden: boolean;
  style?: any;
}

type PaginationProps = {
  pages: number,
  onChange?: (page: number) => void,
  activePage: number,
  className?: string
}


const PaginationButton = ({ children, active, onClick, ...rest }: PaginationButtonProps) => {
  return <Button
    {...rest}
    color={active ? "primary" : "default"}
    onClick={onClick}
  >
    {children}
  </Button>;
};

const NavigationButton = ({ icon, className, onClick, canNext, hidden, ...rest }: NavigationButtonProps) => {
  return (
    <Button {...rest} className={className} hidden={hidden} onClick={onClick} color="primary" disabled={canNext}>
      {icon}
    </Button>
  )
};


const Pagination = (props: PaginationProps) => {

  const { pages, onChange, activePage, className } = props;
  const [swiper, setSwiper] = useState<any>(null);
  const [canNext, setCanNext] = useState(true);
  const [canBack, setCanBack] = useState(false);

  const nextPage = (page: number) => {
    console.log(page);
    if (page <= pages) {
      onChange?.(page);
    }
  }
  const backPage = (page: number) => {
    if (page >= 1) {
      onChange?.(page);
    }
  }

  useEffect(() => {
    swiper?.slideTo?.(activePage)

    if (activePage >= pages) {
      setCanNext(false);
    } else {
      setCanNext(true);
    }


    if (activePage > 1) {
      setCanBack(true);
    } else {
      setCanBack(false);
    }
  }, [activePage]);

  const handleSwiper = (swiper: any): void | undefined => {
    setSwiper(swiper);
  }

  return (
    <Box display="flex" alignItems="center" justifyContent="center" width="100%">
      <NavigationButton style={{ width: "10%" }} hidden={!canBack} canNext={!canBack} onClick={() => { backPage(activePage - 1) }} icon={<ChevronLeftIcon />}></NavigationButton>
      <Swiper
        slidesPerView={10}
        centeredSlides
        style={{ width: "80%" }}
        onSlideChange={() => { }}
        onSwiper={(swiper) => { handleSwiper(swiper) }}
      >
        {
          Array.from(Array(pages).keys()).map(n => {
            return (
              <SwiperSlide style={{ margin: "0 10px" }} key={n}>
                <PaginationButton active={n + 1 === activePage} onClick={() => { onChange?.(n + 1) }}>{n + 1}</PaginationButton>
              </SwiperSlide>
            )
          }
          )
        }
      </Swiper>
      <NavigationButton style={{ width: "10%" }} hidden={!canNext} canNext={!canNext} onClick={() => { nextPage(activePage + 1) }} icon={<ChevronRightIcon />}></NavigationButton>
    </Box>
  )
};

export default Pagination;