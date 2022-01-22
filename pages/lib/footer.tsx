import {DisplayText, Icon} from "@shopify/polaris";
import Link from "next/link";
import {CirclePlusMinor} from "@shopify/polaris-icons";
import React from "react";

export const Footer = () => {

    return <footer>
        <DisplayText>
            <Link href={'https://github.com/njmaeff/spacetagram'}>
                <> <Icon source={CirclePlusMinor} color={'base'}/> this
                    project on GitHub!
                </>
            </Link>
        </DisplayText>
    </footer>
};
