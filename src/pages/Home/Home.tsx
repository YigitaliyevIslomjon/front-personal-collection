import { Box, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import React, { useEffect, useState } from "react";
import { TagCloud } from "react-tagcloud";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";
import { Link } from "react-router-dom";
import HomeSearch from "../../components/Home/HomeSearch";
import { useDispatch, useSelector } from "react-redux";
import { setSearchUrl, setSerachItemList } from "../../store/slice/searchSlice";
import CollectionCard from "../../components/CollectionCard/CollectionCard";
import ItemCard from "../../components/ItemCard/ItemCard";
import api from "../../utils/api";
import "./Home.scss";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";
import { ToastContainer } from "react-toastify";
import { toastifyMessage } from "../../components/ToastifyNotification/ToastifyNotification";
import CardSkeletion from "../../components/CardSkeleton/CardSkeleton";
import { useTranslation } from "react-i18next";
import { CollectionList } from "../../types/collection.types";
import { ItemList, Tag, TagColudList } from "../../types/item.types";

function Home() {
  const dispatch = useDispatch();
  let { t } = useTranslation();
  const searchData = useSelector((state: any) => state.search);

  const [tagList, setTagList] = useState([] as TagColudList);
  const [itemList, setItemList] = useState([] as ItemList);
  const [itemListLoading, setItemListLoading] = useState<boolean>(false);
  const [collectionListLoading, setCollectionListLoading] =
    useState<boolean>(false);
  const [collectionList, setCollectionList] = useState([] as CollectionList);

  const getItemListApi = (pageSize: number, pageNumber: number) => {
    setItemListLoading(true);
    api
      .get("item/list", { params: { pageNumber, pageSize } })
      .then((res) => {
        setItemList(res.data.item);
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      })
      .finally(() => {
        setItemListLoading(false);
      });
  };

  const getLargetCollectionListApi = () => {
    setCollectionListLoading(true);
    api
      .get("collection/large")
      .then((res) => {
        setCollectionList(res.data);
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      })
      .finally(() => {
        setCollectionListLoading(false);
      });
  };

  const getSearchTag = (id: string) => {
    api
      .post(`search/${id}`)
      .then((res) => {
        if (res.data.length === 0) {
          toastifyMessage({
            type: "warn",
            message: "No matching information found",
          });
        } else {
          toastifyMessage({
            type: "success",
            message: "Matching data found",
          });
        }
        dispatch(setSearchUrl("/"));
        dispatch(setSerachItemList(res.data));
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      })
      .finally(() => {});
  };

  const getTagListApi = () => {
    api
      .get("/tag/list")
      .then((res) => {
        setTagList(
          res.data.map((item: Tag, index: number) => ({
            value: item.tag_name,
            id: item._id,
            count: 5 * (index + 1),
          }))
        );
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      });
  };
  const breakpointsSwiper = {
    0: { slidesPerView: 1, spaceBetween: 0 },
    480: { slidesPerView: 2, spaceBetween: 20 },
    768: { slidesPerView: 3, spaceBetween: 20 },
    1024: { slidesPerView: 4, spaceBetween: 30 },
  };
  useEffect(() => {
    getTagListApi();
    getItemListApi(5, 1);
    getLargetCollectionListApi();
  }, []);

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
      <Box className="flex justify-between items-center mb-4 mt-5">
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
            ? collectionList.map((item) => (
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

      <Box className="flex justify-between items-center mb-4 mt-6">
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
            ? itemList.map((item) => (
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

      <Box className="pb-20 pt-12">
        <Box className="flex justify-between mb-4 mt-5">
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
