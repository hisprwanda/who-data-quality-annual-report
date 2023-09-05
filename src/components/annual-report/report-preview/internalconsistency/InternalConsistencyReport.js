import React from "react";
import { ParentHeader } from "../ParentHeader";

export const InternalConsistencyReport = ({ main_title, sub_title }) => {
  return (
    <div>
      <ParentHeader main_title={main_title} sub_title={sub_title} subtitle_display = {false} />
    </div>
  );
};
