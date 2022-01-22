import React from "react";

export const WithDefaultContext: React.FC<{ Frame }> = ({
                                                     children,
                                                     Frame,
                                                 }) => {
    return (
        <Frame>{children}</Frame>
    );
}
