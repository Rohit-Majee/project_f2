import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import Layout from "./pages/Layout";
import FakeNews from "./pages/FakeNews";
import DeepFake from "./pages/DeepFake";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/fakenews" element={<FakeNews />} />
          <Route path="/deepfake" element={<DeepFake />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
