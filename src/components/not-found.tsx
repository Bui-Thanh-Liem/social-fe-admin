import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-5 overflow-hidden font-sans text-[#e7e9ea]">
      <div className="text-center max-w-150">
        {/* Logo Section */}
        <svg
          className="w-25 h-25 mx-auto mb-7.5 fill-current"
          viewBox="0 0 24 28"
          aria-hidden="true"
        >
          <g>
            <path d="M3 4h3.8c2.8 0 4.7 1.6 4.7 4v8c0 2.4-1.9 4-4.7 4H3V4Zm2 2v12h1.6c1.7 0 2.8-1 2.8-2.7V8.7c0-1.7-1.1-2.7-2.8-2.7H5Z" />
            <path d="M12 4h7v2h-5v4h4.5v2H14v4h5v2h-7V4Z" />
            <path d="M21 4h2l-3.7 16h-2.4L13 4h2l2.9 12.5L21 4Z" />
          </g>
          <text
            x="12"
            y="26"
            fontSize="5"
            fontWeight="bold"
            textAnchor="middle"
            className="font-mono"
            fill="currentColor"
          >
            &BUG
          </text>
        </svg>

        {/* Error Code */}
        <div
          className="text-[120px] font-black leading-none -tracking-[5px] mb-2.5 
                        bg-linear-to-b from-white to-[#333] bg-clip-text text-transparent 
                        hover:animate-subtle-glitch cursor-default select-none animate-bounce"
        >
          404
        </div>

        {/* Messages */}
        <h1 className="text-xl font-normal mb-2.5 text-[#71767b]">
          Rất tiếc, trang này không tồn tại!
        </h1>
        <p className="text-[15px] text-[#71767b] leading-5 mb-7.5">
          Đường dẫn bạn đang cố gắng truy cập có thể đã bị xóa, đổi tên hoặc tạm
          thời không khả dụng.
        </p>

        {/* Button */}
        <Link to="/">
          <Button className="bg-white text-black hover:bg-white/90">
            Tìm kiếm thứ khác
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
