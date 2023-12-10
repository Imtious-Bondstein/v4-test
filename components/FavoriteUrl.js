import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";

//===========utils
import findUrlName from "@/utils/urlMapper";

//===========store
import { useSelector, useDispatch } from "react-redux";
import { fetchFavoriteLists } from "@/store/slices/favoriteSlice";

import { useRouter } from "next/router";

//===========css
import "@/styles/components/favoriteUrl.css";
import { clientBaseUrl } from "@/utils/clientBaseUrl";

const FavoriteUrl = () => {
  const [favoriteLists, setFavoriteLists] = useState([]);
  const [isFavoriteLoading, setIsFavoriteLoading] = useState(true);
  const isDispatched = useRef(false);

  const dispatch = useDispatch();
  const { storeFavoriteLists, isStoreLoading } = useSelector(
    (state) => state.reducer.favorite
  );

  //   const localBaseURL = "http://localhost:3000";
  const clientBaseURL = clientBaseUrl(window.location.hostname);

  console.log(">> clientBaseURL", clientBaseURL);

  //====== get data from store ========
  // useEffect(() => {
  //   console.log("store calling favorite", isStoreLoading);
  //   console.log("store calling favorite list", storeFavoriteLists);
  //   if (!storeFavoriteLists) {
  //     dispatch(fetchFavoriteLists());
  //   }
  //   if (!isStoreLoading && storeFavoriteLists) {
  //     // console.log("store fav list", storeFavoriteLists);
  //     setFavoriteLists(JSON.parse(JSON.stringify(storeFavoriteLists)));
  //     // setFavoriteLists(storeFavoriteLists);
  //     setIsFavoriteLoading(isStoreLoading);
  //   }
  // }, [isStoreLoading]);
  useEffect(() => {
    if (!storeFavoriteLists && !isStoreLoading && !isDispatched.current) {
      isDispatched.current = true;
      dispatch(fetchFavoriteLists());
    }
    if (!isStoreLoading && storeFavoriteLists) {
      setFavoriteLists(JSON.parse(JSON.stringify(storeFavoriteLists)));
      setIsFavoriteLoading(isStoreLoading);
    }
  }, [isStoreLoading]);

  return (
    <div className="Favourite">
      <p className="text-[#8D96A1] font-light text-base sm:text-lg mt-2">
        Favourite/Frequently visited
      </p>

      {isFavoriteLoading ? (
        <p>Loading....</p>
      ) : (
        <div className="flex sm:flex-wrap overflow-x-auto pt-3 sm:py-5">
          {favoriteLists.map((route) => (
            <Link
              href={route}
              key={route}
              className={`group w-[187px] h-[40px] sm:h-[56px] bg-[#FFFAE6] text-[#6A7077] font-medium rounded-xl favorite-url-shadow px-[17px] flex items-center hover:fill-[#1E1E1E] hover:bg-primary hover:text-black gap-4 whitespace-nowrap mr-4 mb-4`}
            >
              {findUrlName(route)}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoriteUrl;
