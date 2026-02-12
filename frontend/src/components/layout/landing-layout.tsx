import { Outlet } from "react-router-dom";

// type Props = {};

const LandingLayout = () => {
  return (
    <main>
      <>toolbar</>
      <div className="min-h-svh lg:min-h-[767px] bg-card mt-20 pb-[184px]">
        <Outlet />
      </div>
      <>footer</>
    </main>
  );
};

export default LandingLayout;
