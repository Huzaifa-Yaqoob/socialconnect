import { ReactNode } from "react";
import Navbar from "@/components/sections/Navbar";

function Layout({ children }: { children: ReactNode }) {
  return (
    <div className={"flex-grow"}>
      <Navbar />
      {children}
    </div>
  );
}

export default Layout;
