import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./Categories.css";

function CustomLeftArrow({ onClick }) {
  return (
  <button className="carousel-arrow left" onClick={onClick}>
      {"<"}
    </button>
  );
}

function CustomRightArrow({ onClick }) {
  return (
    <button className="carousel-arrow right" onClick={onClick}>
      {">"}
    </button>
  );
}

function Categories({ onSelectCategory }) {
  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 0 }, items: 8 },
    tablet: { breakpoint: { max: 1024, min: 464 }, items: 4 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 2 }
  };

  const items = [
    { name: "Washing Machines", icon: "🧺" },
    { name: "Speakers", icon: "🔊" },
    { name: "Microwaves", icon: "📦" },
    { name: "Vacuum", icon: "🧹" },
    { name: "Wearables", icon: "⌚" },
    { name: "Cameras", icon: "📷" },
    { name: "Heaters", icon: "🔥" },
    { name: "Geysers", icon: "🚿" }
  ];

  const handleItemClick = (index) => {
    onSelectCategory(items[index].name);
  };

  return (
    <div className="category-container">
      <Carousel 
        responsive={responsive} 
        infinite 
        customLeftArrow={<CustomLeftArrow />}
        customRightArrow={<CustomRightArrow />}
        autoPlay={false}
        itemClass="carousel-item"
        onItemClick={handleItemClick}
      >
        {items.map((item, index) => (
          <div className="category-card" key={index}>
            <div className="icon">{item.icon}</div>
            <p>{item.name}</p>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default Categories;
