import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "./Carousel.css";

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

function ProductCarousel() {

  const responsive = {
    desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
    tablet: { breakpoint: { max: 1024, min: 600 }, items: 2 },
    mobile: { breakpoint: { max: 600, min: 0 }, items: 1 }
  };

  const products = [
    { id: 1, image: "https://m.media-amazon.com/images/I/71vFKBpKakL._SX679_.jpg" },
    { id: 2, image: "https://m.media-amazon.com/images/I/61Dw5Z8LzJL._SX679_.jpg" },
    { id: 3, image: "https://m.media-amazon.com/images/I/71GLMJ7TQiL._SX679_.jpg" },
    { id: 4, image: "https://m.media-amazon.com/images/I/61u48FEs0rL._SX679_.jpg" },
    { id: 5, image: "https://m.media-amazon.com/images/I/61bK6PMOC3L._SX679_.jpg" }
  ];

  return (
    <div className="carousel-container">
      <Carousel
        responsive={responsive}
        infinite
        autoPlay
        autoPlaySpeed={1500}
        transitionDuration={400}
        showDots
        customLeftArrow={<CustomLeftArrow />}
        customRightArrow={<CustomRightArrow />}
        keyBoardControl
      >
        {products.map((item) => (
          <div className="card" key={item.id}>
            <img
              src={item.image}
              alt="product"
              className="product-image"
              loading="lazy"
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default ProductCarousel;
