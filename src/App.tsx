import { Toaster } from "react-hot-toast";
import { RichTextEditor } from "~/editor/RichTextEditor";
import { TitleEditor } from "~/editor/TitleEditor";

function App() {
  return (
    <div>
      <div>
        <TitleEditor />
        <RichTextEditor />
      </div>
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
