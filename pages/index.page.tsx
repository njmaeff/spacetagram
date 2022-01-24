import router from "next/router";
import {useEffect} from "react";

export default () => {
    useEffect(() => {
        router.push('/discover')
    }, []);

    return <></>
};
