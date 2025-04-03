import React, { useState, useEffect } from "react";

const APIKEY = import.meta.env.VITE_GIFHY_API_KEY;
// 自定义hook

export const useFetch = ({ keyword }) => {
  const [gifUrl, setGifUrl] = useState("");

  console.log(APIKEY);
  //W8hoJHRYEwGZGiKyTXnjcFb9l08Szxd4
  const fetchGifs = async () => {
    try {
      // 这个返回是看api那边的返回吧？还有其中的方法有什么作用呢？split("") .join(""),fetch作用是？
      //  fetch：用于发起网络请求，获取远程资源。
      // .split("")：将字符串拆分为字符数组。
      // .join("")：将字符数组拼接为字符串。
      // 所以这一块.split和.join感觉是有点问题的，估计就是为了清楚掉空格
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search/tags?api_key=${APIKEY}&q=${keyword
          .split("")
          .join("")}&limit=1&offset=0`
      );
      //.json()有什么作用？
      //转化为js对象，这样就能直接用里面内容了
      const { data } = await response.json();
      //   ?号的作用是?
      // 如果？前面的对象不存在就返回undefined
      setGifUrl(data[0]?.images?.downsized_medium.url);
    } catch (error) {
      setGifUrl(
        "https://metro.co.uk/wp-content/uploads/2015/05/pokemon_crying.gif?quality=90&strip=all&zoom=1&resize=500%2C284"
      );
    }
  };

  //   当keyword改变的时候就调用获取方法
  useEffect(() => {
    if (keyword) fetchGifs();
  }, [keyword]);

  return gifUrl;
};

export default useFetch;
