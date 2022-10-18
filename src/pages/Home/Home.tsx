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

type TagListType = {
  value: string;
  id: string;
  count: number;
}[];

export type ItemListType = {
  item_name: string;
  collection_name: string;
  user_name: string;
  id: string;
  path: string;
  tags: string[];
}[];

export type CollectionListType = {
  collection_name: string;
  user_name: string;
  id: string;
  path: string;
  item_count: number;
  topic_name: string;
}[];

function Home() {
  const dispatch = useDispatch();
  let { t } = useTranslation();
  const searchData = useSelector((state: any) => state.search);

  const [tagList, setTagList] = useState([] as TagListType);
  const [itemList, setItemList] = useState([] as ItemListType);

  const [collectionList, setCollectionList] = useState(
    [] as CollectionListType
  );

  const getItemListApi = (pageSize: number, pageNumber: number) => {
    api
      .get("item/list", { params: { pageNumber, pageSize } })
      .then((res) => {
        setItemList(
          res.data.map((item: any) => ({
            item_name: item.item_name,
            collection_name: item.collection_id?.collection_name,
            user_name: item.user_id?.user_name,
            id: item._id,
            path: item.path,
            tags: item.tags.map((item: any) => item.tag_name),
          }))
        );
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      });
  };

  const getLargetCollectionListApi = () => {
    api
      .get("collection/large")
      .then((res) => {
        setCollectionList(
          res.data.map((item: any, index: any) => ({
            collection_name: item.collection_name,
            user_name: item.user_id.user_name,
            id: item._id,
            path: item.path,
            item_count: item.item_count,
            topic_name: item.topic_id.topic_name,
          }))
        );
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      });
  };

  const getSearchTag = (id: string) => {
    api
      .post(`search/${id}`)
      .then((res) => {
        dispatch(setSearchUrl("/"));
        dispatch(
          setSerachItemList(
            res.data.map((item: any) => ({
              item_name: item.item_name,
              collection_name: item.collection_id?.collection_name,
              user_name: item.user_id?.user_name,
              id: item._id,
              path: item.path,
              tags: item.tags.map((item: any) => item?.tag_name),
            }))
          )
        );
      })
      .catch((err) => {
        toastifyMessage({ type: "error", message: err.response.data.error });
      });
  };

  const getTagListApi = () => {
    api
      .get("/tag/list")
      .then((res) => {
        setTagList(
          res.data.map((item: any, index: any) => ({
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
    <Box id="home" className="flex flex-col">
      <Box className="flex justify-between mb-4 mt-5">
        <Typography variant="h6">{t("largeCollections")}</Typography>
        <Link to="/collection" className="no-underline">
          <Typography variant="body1"> {t("viewAll")}</Typography>
        </Link>
      </Box>

      <Grid container className="h-[400px]">
        <Swiper
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
          className="home-swiper"
        >
          {collectionList.length > 0
            ? collectionList.map((item) => (
                <SwiperSlide key={item.id}>
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

      <Box className="flex justify-between mb-4 mt-6">
        <Typography variant="h6">{t("lastItem")}</Typography>
        <Link to="/collection" className="no-underline">
          <Typography variant="body1"> {t("viewAll")}</Typography>
        </Link>
      </Box>

      <Grid container className="h-[400px]">
        <Swiper
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
          className="home-swiper"
        >
          {itemList.length > 0
            ? itemList.map((item) => (
                <SwiperSlide key={item.id}>
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

      <Box className="pb-80 pt-12">
        <Box className="flex justify-between mb-4 mt-5">
          <Typography variant="h6"> Tag cloud</Typography>
        </Box>
        <Box className="bg-slate-900 px-12 py-12 rounded-[20px]">
          <TagCloud
            minSize={12}
            maxSize={35}
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
