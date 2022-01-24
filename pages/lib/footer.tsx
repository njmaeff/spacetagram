import {TextStyle} from "@shopify/polaris";
import Link from "next/link";
import React from "react";

export const Footer: React.FC<{ remaining?: number }> = ({remaining}) => {

    return <footer>
        <TextStyle variation={'subdued'}><p>Brought
            to
            you by by the <Link href={'https://api.nasa.gov/'}>
                <a>Nasa free API</a>
            </Link></p></TextStyle>
        {remaining &&
            <TextStyle variation={'subdued'}><p>Remaining
                Queries: {remaining}</p></TextStyle>
        }
    </footer>
};
