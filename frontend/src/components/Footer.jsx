import React from "react";
import { Footer, Label, TextInput } from "flowbite-react";
import { SiMinutemailer } from "react-icons/si";
import logo from "../assets/logo.png";

const MyFooter = () => {
  return (
    <footer className="bg-neutralBlack text-white">
      <div className="px-4 lg:px-14 max-w-screen-2xl mx-auto py-12">
        <div className="grid w-full justify-between gap-8 sm:flex sm:items-start sm:justify-between md:flex md:grid-cols-1">
          <div className="mt-2">
            <a
              href=""
              className="text-2xl font-semibold flex items-center space-x-3"
            >
              <img
                src={logo}
                alt=""
                className="w-10 inline-block items-center"
              />
              <span>NEXCENT</span>
            </a>
            <div className="my-8">
              <p className="mb-1"> Copyright © 2020 Nexcent ltd.</p>
              <p>All rights reserved</p>
            </div>

           
          </div>
          <div className="md:w-2/3 grid grid-cols-2 gap-8 items-start sm:mt-4 sm:grid-cols-3 sm:gap-6 text-white">
            <div>
              <Footer.Title title="Company" className="text-white" />
              <Footer.LinkGroup col>
                <Footer.Link href="#" className="text-white">
                  About us
                </Footer.Link>
                <Footer.Link href="#" className="text-white">
                  Blog
                </Footer.Link>
                <Footer.Link href="#" className="text-white">
                  Contact us
                </Footer.Link>
                
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Support" className="text-white" />
              <Footer.LinkGroup col>
                <Footer.Link href="#" className="text-white">
                  Help center
                </Footer.Link>
                <Footer.Link href="#" className="text-white">
                  Terms of service
                </Footer.Link>
                <Footer.Link href="#" className="text-white">
                  Legal
                </Footer.Link>
                <Footer.Link href="#" className="text-white">
                  Privacy policy
                </Footer.Link>               
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Stay up to date" className="text-white" />
              <div className="max-w-md text-white">
                <div className="mb-2 block"></div>
                <TextInput
                  id="email4"
                  placeholder="name@flowbite.com"
                  required
                  rightIcon={SiMinutemailer}
                  type="email"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default MyFooter;