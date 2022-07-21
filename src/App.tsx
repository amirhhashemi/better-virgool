import { RichTextEditor } from "./components/editor/RichTextEditor";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div>
      <RichTextEditor />
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "bg-black text-white text-bold",
        }}
      />
    </div>
  );
}

export default App;
