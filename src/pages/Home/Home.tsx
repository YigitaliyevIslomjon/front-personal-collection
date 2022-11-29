import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import React from "react";
import { TagCloud } from "react-tagcloud";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import { Link } from "react-router-dom";
import HomeSearch from "../../components/Search/Search";
import { useSelector } from "react-redux";
import CollectionCard from "../../components/CollectionCard/CollectionCard";
import ItemCard from "../../components/ItemCard/ItemCard";
import "./Home.scss";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";
import { ToastContainer } from "react-toastify";
import CardSkeletion from "../../components/CardSkeleton/CardSkeleton";
import { useTranslation } from "react-i18next";
import { useGetTagList, useGetSearchTag } from "./hooks/useTagData";
import { useGetitemList } from "./hooks/useItemData";
import { useGetLargCollectionList } from "./hooks/useCollectionData";
import { breakpointsSwiper } from "./data/constant";

function Home() {
  let { t } = useTranslation();
  const searchData = useSelector((state: any) => state.search);

  const { data: tagList } = useGetTagList();
  const { mutate: getSearchTag } = useGetSearchTag();
  const { data: itemList, isLoading: itemListLoading } = useGetitemList();
  const { data: collectionList, isLoading: collectionListLoading } =
    useGetLargCollectionList();

  if (
    (searchData.item.length > 0 ||
      searchData.collection.length > 0 ||
      searchData.comment.length > 0) &&
    searchData.url === "/"
  ) {
    return <HomeSearch />;
  }

  return (
    <Box id="home" className="flex flex-col mb-10">
      <Box className="flex items-center justify-between mt-5 mb-4">
        <Typography variant="h6" className="text-base sm:text-xl">
          {t("largeCollections")}
        </Typography>
        <Link to="/collection" className="underline-offset-2">
          <Typography
            variant="body1"
            className="text-base sm:text-base"
            color="textPrimary"
          >
            {" "}
            {t("viewAll")}
          </Typography>
        </Link>
      </Box>

      <Grid container>
        <Swiper
          breakpoints={breakpointsSwiper}
          slidesPerView={4}
          spaceBetween={30}
          slidesPerGroup={1}
          loop={true}
          loopFillGroupWithBlank={true}
          pagination={{
            clickable: true,
          }}
          navigation={false}
          modules={[Pagination, Navigation]}
          className="pb-10"
        >
          {!collectionListLoading
            ? collectionList?.map((item) => (
                <SwiperSlide key={item._id}>
                  <CollectionCard data={item} />
                </SwiperSlide>
              ))
            : Array(5)
                .fill(0)
                .map((item, index) => (
                  <SwiperSlide key={index}>
                    <CardSkeletion />
                  </SwiperSlide>
                ))}
        </Swiper>
      </Grid>

      <Box className="flex items-center justify-between mt-6 mb-4">
        <Typography variant="h6" className="text-base sm:text-xl">
          {t("lastItem")}
        </Typography>
        <Link to="/collection" className="underline-offset-2">
          <Typography
            variant="body1"
            className="text-base sm:text-base"
            color="textPrimary"
          >
            {" "}
            {t("viewAll")}
          </Typography>
        </Link>
      </Box>

      <Grid container>
        <Swiper
          breakpoints={breakpointsSwiper}
          slidesPerView={4}
          spaceBetween={30}
          slidesPerGroup={1}
          loop={true}
          loopFillGroupWithBlank={true}
          pagination={{
            clickable: true,
          }}
          navigation={false}
          modules={[Pagination, Navigation]}
          className="pb-10"
        >
          {!itemListLoading
            ? itemList?.map((item) => (
                <SwiperSlide key={item._id}>
                  <ItemCard data={item} />
                </SwiperSlide>
              ))
            : Array(5)
                .fill(0)
                .map((item, index) => (
                  <SwiperSlide key={index}>
                    <CardSkeletion />
                  </SwiperSlide>
                ))}
        </Swiper>
      </Grid>

      <Box className="pt-12 pb-20">
        <Box className="flex justify-between mt-5 mb-4">
          <Typography variant="h6" className="text-base sm:text-xl">
            {" "}
            Tag cloud
          </Typography>
        </Box>
        <Box className="bg-slate-900 px-5 py-5 md:px-12 md:py-12 rounded-[20px]">
          <TagCloud
            className="simple-cloud"
            minSize={12}
            maxSize={40}
            tags={tagList}
            onClick={(tag: any) => getSearchTag(tag.id)}
          />
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
}

export default Home;
