import { Routes, Route } from "react-router-dom";
import "./index.css";
import {
  AllUsers,
  CreatePost,
  EditPost,
  Explore,
  Home,
  PostDetails,
  Profile,
  Saved,
  Setting,
  UpdateProfile,
} from "./_root/pages";
import SignInForm from "./_auth/forms/SignInForm";
import SignUpForm from "./_auth/forms/SignUpForm";
import AuthLayout from "./_auth/AuthLayout";
import RootLayout from "./_root/RootLayout";
import { Toaster } from "@/components/ui/toaster";
import SendPassRecovery from "./_auth/forms/SendPassRecovery";
import ResetPassword from "./_auth/forms/ResetPassword";

const App = () => {
  return (
    <div className="flex h-screen">
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route element={<AuthLayout />}>
          <Route path="/sign-in" element={<SignInForm />} />
          <Route path="/sign-up" element={<SignUpForm />} />
          <Route path="/password-recovery" element={<SendPassRecovery />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>

        {/* PRIVATE ROUTES */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
          <Route path="/setting" element={<Setting />} />
          {/* <Route path="*" element={<div>Page not Found</div>} /> */}
        </Route>
      </Routes>

      <Toaster />
    </div>
  );
};

export default App;
