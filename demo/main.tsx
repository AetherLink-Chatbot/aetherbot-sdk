import React from "react";
import { createRoot } from "react-dom/client";
import AetherChatWidget from "../src/ui/AetherChatWidget";

const App = () => {
  return (
    <div className="h-full">
      <div className="p-6">
        <h1 className="text-xl font-semibold text-zinc-800">Aetherbot Widget Demo</h1>
        <p className="text-zinc-500">Open/close the launcher at bottom-right.</p>
      </div>

      {/* The widget attaches fixed to the viewport */}
      <AetherChatWidget />
    </div>
  );
};

const root = createRoot(document.getElementById("root")!);
root.render(<App />);

