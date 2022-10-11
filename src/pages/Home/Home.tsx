import React, { useEffect, useState } from "react";
import { TagCloud } from "react-tagcloud";
import api from "../../utils/api";

type TagListType = {
  value: string;
  id: string;
  count: number;
}[];
function Home() {
  const [tagList, setTagList] = useState([] as TagListType);

  const data = [
    { value: "JavaScript", count: 38 },
    { value: "React", count: 30 },
    { value: "Nodejs", count: 28 },
    { value: "Express.js", count: 25 },
    { value: "HTML5", count: 33 },
    { value: "MongoDB", count: 18 },
    { value: "CSS3", count: 20 },
  ];

  const getItemRealatedTagApi = (id: string) => {
    api.post(`search/${id}`).then((res) => {
      console.log(res.data);
    });
  };

  const getTagListApi = () => {
    api
      .get("/tag/list")
      .then((res) => {
        console.log(res.data);
        setTagList(
          res.data.map((item: any, index: any) => ({
            value: item.tag_name,
            _id: item._id,
            count: 10 + index,
          }))
        );
      })
      .catch((err) => {});
  };
  useEffect(() => {
    getTagListApi();
  }, []);

  return (
    <div>
      <TagCloud
        minSize={12}
        maxSize={35}
        tags={tagList}
        onClick={(tag: any) => getItemRealatedTagApi(tag._id)}
      />
    </div>
  );
}

export default Home;
