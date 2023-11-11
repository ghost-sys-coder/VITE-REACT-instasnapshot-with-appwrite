import { Routes, Route } from "react-router-dom"
import { Toaster } from "./components/ui/toaster"
import SigninForm from "./_auth/forms/SigninForm"
import SignupForm from "./_auth/forms/SignupForm"
import { AllUsers, CreatePost, EditPost, Explore, Home, PostDetails, Profile, Saved, UpdateProfile } from "./_root/pages"
import AuthLayout from "./_auth/AuthLayout"
import RootLayout from "./_root/RootLayout"

const App = () => {
  return (
    <main className="flex h-screen">

      <Routes>
        {/* public route */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<SigninForm />} />
          <Route path="/signup" element={<SignupForm />} />
        </Route>
        {/* private routes */}
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/all-users" element={<AllUsers />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/update-post/:id" element={<EditPost />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  )
}

export default App
