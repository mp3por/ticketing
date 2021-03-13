import useRequest from "../../hooks/use-request";
import Router from "next/router";
import {useEffect} from "react";

const SignOut = () => {
    const {doRequest } = useRequest({
        url: '/api/users/signout',
        method: 'post',
        body: {},
        onSuccess: () => Router.push('/')
    });

    // run the doRequest only once
    useEffect(()=>{
        doRequest();
    }, []);

    return <div>Signing you out ...</div>
};
export default SignOut;
