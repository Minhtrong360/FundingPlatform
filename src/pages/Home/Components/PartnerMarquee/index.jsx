import React from "react";
import Marquee from "react-marquee-slider";
import logo1 from "./imgs/bk-hcm.png";
import logo2 from "./imgs/fpt-u.png";
import logo3 from "./imgs/rmit.png";
import logo4 from "./imgs/sbs.png";
import logo5 from "./imgs/upyouth.png";
import logo6 from "./imgs/vanlang.png";

const partnerLogos = [logo1, logo3, logo4, logo6, logo5, logo2];

const PartnerMarquee = () => {
	return (
		<div className="w-full py-24 bg-white">
			<h3 className="block mb-16 text-3xl font-extrabold text-center text-gray-800 sm:text-4xl md:text-5xl lg:text-7xl darkTextWhite">Our Partners</h3>
			<div className="h-[200px]">
				<Marquee velocity={35} minScale={0.7} resetAfterTries={200}>
						{partnerLogos.map((logo, index) => (
							<div
								key={index}
								className="grid p-4 place-items-center w-[250px] mx-[0px] lg:mx-[40px] select-none hover:bg-gray-50 group transition-all  rounded-2xl"
							>
								<img
									src={logo}
									alt={`Partner ${index + 1}`}
									className="aspect-[3/2] object-cover max-w-full h-[90%]  group-hover:scale-110 transition-all duration-[1s]"
								/>
							</div>
						))}
				</Marquee>
			</div>
		</div>
	);
};

export default PartnerMarquee;
