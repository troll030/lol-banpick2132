import React from "react";

const Controls = ({ onReset, onUndo }) => (
  <div className="flex space-x-4">
    <button onClick={onUndo} className="border-2 border-white px-4 py-2 rounded">
      되돌리기
    </button>
    <button onClick={onReset} className="border-2 border-white px-4 py-2 rounded">
      리셋
    </button>
  </div>
);

export default Controls;
