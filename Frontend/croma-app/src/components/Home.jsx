import React, { useState } from "react";
import Carousel from "./Carousel";
import Categories from "./Categories";
import ProductList from "./ProductList";

function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");

  return (<><Carousel />
      <Categories onSelectCategory={setSelectedCategory} />
      <ProductList selectedCategory={selectedCategory} />
    </>
  );
}

export default Home;
