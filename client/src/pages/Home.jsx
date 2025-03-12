import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import banner from "../assets/banner.jpg";
import bannerMobile from "../assets/banner-mobile.jpg";
import { valideURLConvert } from "../utils/valideURLConvert";
import CategoryWiseProductDisplay from "../components/CategoryWiseProductDisplay";
import isAdmin from "../utils/isAdmin";

const Home = () => {
  const user = useSelector((state) => state.user);
  const loadingCategory = useSelector((state) => state.product.loadingCategory);
  const categoryData = useSelector((state) => state.product.allCategory);
  const subCategoryData = useSelector((state) => state.product.allSubCategory);
  const navigate = useNavigate();

  // Redirect admin to the dashboard
  useEffect(() => {
    if (isAdmin(user?.role)) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleRedirectProductListPage = (id, cat) => {
    const subcategory = subCategoryData.find((sub) =>
      sub.category.some((c) => c._id === id)
    );

    if (subcategory) {
      const url = `/${valideURLConvert(cat)}-${id}/${valideURLConvert(subcategory.name)}-${subcategory._id}`;
      navigate(url);
    }
  };

  return (
    <section className="bg-white">
      <div className="container mx-auto">
        <div className={`w-full h-full min-h-48 bg-blue-100 rounded ${!banner && "animate-pulse my-2"}`}>
          <img src={banner} className="w-full h-full hidden lg:block" alt="banner" />
          <img src={bannerMobile} className="w-full h-full lg:hidden" alt="banner" />
        </div>
      </div>

      <div className="container mx-auto px-4 my-2 grid grid-cols-5 md:grid-cols-8 lg:grid-cols-10 gap-2">
        {loadingCategory ? (
          new Array(12).fill(null).map((_, index) => (
            <div key={index + "loadingcategory"} className="bg-white rounded p-4 min-h-36 grid gap-2 shadow animate-pulse">
              <div className="bg-blue-100 min-h-24 rounded"></div>
              <div className="bg-blue-100 h-8 rounded"></div>
            </div>
          ))
        ) : (
          categoryData.map((cat) => (
            <div key={cat._id + "displayCategory"} className="w-full h-full" onClick={() => handleRedirectProductListPage(cat._id, cat.name)}>
              <div>
                <img src={cat.image} className="w-full h-full object-scale-down" alt={cat.name} />
              </div>
            </div>
          ))
        )}
      </div>

      {/*** Display category products ***/}
      {categoryData?.map((c) => (
        <CategoryWiseProductDisplay key={c?._id + "CategorywiseProduct"} id={c?._id} name={c?.name} />
      ))}
    </section>
  );
};

export default Home;
