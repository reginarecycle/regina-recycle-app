import { Outlet } from "react-router-dom";

// type Props = {};

const AuthLayout = () => {
  return (
    <main>
      <>bg image</>
      <div>
        <Outlet />
        <>footer</>
      </div>
    </main>
  );
};

export default AuthLayout;
