/* eslint-disable react/no-unescaped-entities */


import {Link} from "react-router-dom";
import { useEffect, useState } from "react";
import TestimonialCard from './../../../ui/Cards/Testimonial';

const TestimonialSection = ({ button = "true" }) => {
  const [testimonialDatas, setTestimonialDatas] = useState([]);
  const testimonialData = async () => {
    const res = await fetch("./db/testimonialData.json");
    const testimonialData = await res.json();
    setTestimonialDatas(testimonialData);
  };
  useEffect(() => {
    testimonialData();
  }, []);

  return (
    <div className="section zubuz-section-padding2 light-bg">
      <div className="container">
        <div className="zubuz-section-title center">
          <h2>We're proud to be a top choice for many of our happy clients.
          </h2>
        </div>
        <div className="row">
          {testimonialDatas?.map((testimonial, index) => (
            <TestimonialCard
              key={index}
              title={testimonial?.title}
              description={testimonial?.description}
              avatar={testimonial?.author?.avatar}
              name={testimonial?.author?.name}
              role={testimonial?.author?.role}
            />
          ))}
        </div>
        {button === "true" && (
          <div className="zubuz-testimonial-btn">
            <Link className="zubuz-default-btn" to="/testimonials">
              <span>View All Reviews</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestimonialSection;
