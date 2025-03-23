import React, { useState } from "react";
import logo from "../../images/logo.png";
import { HiMenuAlt4 } from "react-icons/hi";
import { AiOutlineClose } from "react-icons/ai";
// 这里是定义了一个组建来处理导航页的item
const NavBarItem = ({ title, classprops }) => {
  return <li className={`mx-4 cursor-pointer ${classprops}`}>{title}</li>;
};

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);

  return (
    <>
      {/* w-full 设置元素宽度,items-center垂直对齐*/}
      <nav className="w-full flex md:justify-center justify-between items-center p-4">
        {/* flex-initial让项目可以收缩但不能增长，切考虑其初始的大小 */}
        {/* flex-[0.5]可以让项目占用剩余空间的一半 */}
        <div className="md:flex-[0.5] flex-initial justify-center items-center">
          <img src={logo} alt="logo" className="w-32 cursor-pointer" />
        </div>
        {/* 导航页item */}
        {/* hidden可以隐藏元素 */}
        <ul className="text-white md:flex  list-none flex-row justify-between items-center flex-initial">
          {["Market", "Exchange", "Tutorials", "Wallets"].map((item, index) => (
            <NavBarItem key={item + index} title={item} />
          ))}
          {/* rounded-full全圆角 */}
          <li className="bg-[#2952e3] py-2 px-7 mx-4 rounded-full cursor-pointer hover:bg-[#2546bd]">
            Login
          </li>
        </ul>
        {/* 在小屏幕上显示 */}
        <div className="flex relative">
          {/* 菜单 */}
          {!toggleMenu && (
            <HiMenuAlt4
              fontSize={28}
              className="text-white md:hidden cursor-pointer"
              onClick={() => setToggleMenu(true)}
            />
          )}
          {toggleMenu && (
            <AiOutlineClose
              fontSize={28}
              className="text-white md:hidden cursor-pointer"
              onClick={() => setToggleMenu(false)}
            />
          )}
          {toggleMenu && (
            <ul
              // -top-0 -代表负值
              className="z-10 fixed -top-0 -right-2 p-3 w-[70vw] h-screen shadow-2xl md:hidden list-none 
        flex flex-col justify-start items-end rounded-md blue-glassmorphism text-white animate-slide-in
        "
            >
              <li className="text-xl w-full my-2">
                <AiOutlineClose onClick={() => setToggleMenu(false)} />
              </li>
              {["Market", "Exchange", "Tutorials", "Wallets"].map(
                (item, index) => (
                  <NavBarItem
                    key={item + index}
                    title={item}
                    classprops="my-2 text-lg"
                  />
                )
              )}
            </ul>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;
