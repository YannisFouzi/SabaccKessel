import React, { useEffect } from "react";
import "./Background.css";

const Background = () => {
  useEffect(() => {
    const onLoad = () => {
      setTimeout(() => {
        document.body.classList.add("loaded");
      }, 250);
    };

    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div id="background-container">
      {/* Stars */}
      <div id="stars">
        <div id="stafield">
          <img
            src="https://binarysunset.netlify.app/svg/Stars.svg"
            alt="Stars"
          />
        </div>
      </div>

      {/* Sky gradient */}
      <div id="sky">
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
          <linearGradient id="a" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop stopColor="#000" offset="0">
              <animate
                attributeName="stop-color"
                dur="60s"
                values="rgba(79,120,174,1);rgba(76,101,150,1);rgba(71,82,133,0.93);rgba(59,66,108,0.78);rgba(44,49,84,0.56);rgba(27,30,60,0.33);rgba(0,19,48,0.0);rgba(0,19,48,0);rgba(0,19,48,0);rgba(0,19,48,0);rgba(0,19,48,0);rgba(37,32,70,.33);rgba(69,40,92,0.67);rgba(102,44,113,1);rgba(94,112,155,1);rgba(0,137,185,1);rgba(9,127,182,1);rgba(20,116,178,1);rgba(27,106,175,1);rgba(29,101,173,1);rgba(31,96,173,1);rgba(47,100,170,1);rgba(66,119,177,1);rgba(73,119,174,1);rgba(79,120,174,1);"
                repeatCount="indefinite"
              />
              <animate
                attributeName="offset"
                dur="60s"
                values="0.21;0.07;0.07;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0;0.12;0.21;0.21;"
                repeatCount="indefinite"
              />
            </stop>
            <stop stopColor="#000" offset=".65">
              <animate
                attributeName="stop-color"
                dur="60s"
                values="rgba(135,203,202,1);rgba(148,205,192,1);rgba(153,134,141,1);rgba(174,93,104,1);rgba(150,96,114,0.78);rgba(127,98,124,0.79);rgba(99,99,134,0.53);rgba(54,92,145,0.3);rgba(38,118,123,0.3);rgba(64,105,129,0.3);rgba(76,77,120,0.3);rgba(91,64,124,0.3);rgba(137,66,131,0.53);rgba(175,69,138,0.77);rgba(239,80,154,1);rgba(218,166,181,1);rgba(211,226,199,1);rgba(134,189,187,1);rgba(127,180,194,1);rgba(142,205,217,1);rgba(119,203,227,1);rgba(92,202,273,1);rgba(107,197,222,1);rgba(122,200,212,1);rgba(135,203,202,1);"
                repeatCount="indefinite"
              />
              <animate
                values=".74;.74;.55;.56;.56;.56;.56;.56;.66;.62;.52;.52;.52;.52;.58;.66;.69;.55;.57;.77;.78;.78;.74;.74;.74;"
                repeatCount="indefinite"
              />
            </stop>
            <stop stopColor="#000" offset="100%">
              <animate
                attributeName="stop-color"
                dur="60s"
                values="rgba(197,203,185,1);rgba(187,192,167,1);rgba(218,156,108,1);rgba(244,117,49,1);rgba(208,119,68,1);rgba(179,120,84,1);rgba(151,119,96,1);rgba(119,99,84,1);rgba(99,95,61,1);rgba(113,99,69,1);rgba(128,103,77,1);rgba(142,107,85,1);rgba(172,126,106,1);rgba(206,150,130,1);rgba(249,180,160,1);rgba(244,194,150,1);rgba(242,207,137,1);rgba(255,232,177,1);rgba(245,234,198,1);rgba(235,237,220,1);rgba(229,239,231,1);rgba(226,243,244,1);rgba(216,227,222,1);rgba(206,215,203,1);rgba(197,203,185,1);"
                repeatCount="indefinite"
              />
            </stop>
          </linearGradient>
          <rect x="0" y="0" width="100%" height="100%" fill="url(#a)" />
        </svg>
      </div>

      {/* Landscape elements */}
      <div>
        <img
          id="mountains"
          src="https://binarysunset.netlify.app/svg/mountains.svg"
          alt="Mountains"
        />
        <img
          id="landscape"
          src="https://binarysunset.netlify.app/svg/landscape.svg"
          alt="Landscape"
        />
        <img
          id="sandcrawler"
          src="https://binarysunset.netlify.app/svg/sandcrawler.svg"
          alt="Sandcrawler"
        />
        <img
          id="tuskens"
          src="https://binarysunset.netlify.app/svg/tuskens.svg"
          alt="Tuskens"
        />
        <img
          id="luke"
          src="https://binarysunset.netlify.app/svg/luke.svg"
          alt="Luke"
        />
        <img
          id="house"
          src="https://binarysunset.netlify.app/svg/house.svg"
          alt="House"
        />
        <img
          id="crates"
          src="https://binarysunset.netlify.app/svg/crates.svg"
          alt="Crates"
        />
      </div>

      {/* Shadows */}
      <div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="house_shadow"
          width="100%"
          height="100%"
          viewBox="0 0 1920 275"
          className="shadow_element"
        >
          <path>
            <animate
              attributeName="d"
              dur="60s"
              repeatCount="indefinite"
              values="M 0 0 790 158 690 275 0 275 0 0z; M 0 0 790 158 200 275 0 275 0 0z; M 0 0 790 0 1300 275 0 275 0 0z; M 0 0 790 0 1400 275 0 275 0 0z; M 0 0 790 158 900 275 0 275 0 0z; M 0 0 790 158 690 275 0 275 0 0z;"
            />
            <animate
              attributeName="opacity"
              dur="60s"
              repeatCount="indefinite"
              values="0.2; 0.12; 0; 0; 0; 0; 0.01; 0.2; 0.2; 0.2;"
            />
          </path>
        </svg>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          id="crates_shadow"
          width="100%"
          height="100%"
          viewBox="0 0 1920 275"
          className="shadow_element"
        >
          <defs>
            <linearGradient
              id="linear-gradient"
              x1="203.5"
              y1="209"
              x2="203.5"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopOpacity="0" />
              <stop offset="0.07" stopOpacity="0.5" />
              <stop offset="1" />
            </linearGradient>
          </defs>
          <path className="shadow-1">
            <animate
              attributeName="d"
              dur="60s"
              repeatCount="indefinite"
              values="M 1421 67 1695 77 1650 275 1350 275 1421 67; M 1421 67 1695 77 1200 275 900 275 1421 67; M 1437 78 1703 67 2300 275 2000 275 1437 78; M 1437 78 1703 67 2300 275 2000 275 1437 78; M 1421 67 1695 77 1950 275 1650 275 1421 67; M 1421 67 1695 77 1650 275 1350 275 1421 67"
            />
            <animate
              attributeName="opacity"
              dur="60s"
              repeatCount="indefinite"
              values="0.2; 0.09; 0; 0; 0; 0; 0.01; 0.2; 0.2; 0.2;"
            />
          </path>
        </svg>
      </div>

      {/* Suns */}
      <div className="lightning">
        <div className="suncrane">
          <div className="tatoo1">
            <div></div>
          </div>
          <div className="tatoo2">
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Background;
