import axios from "axios";
import {useState} from "react";

export default ( {url, method, body}) => {
    const [errors, setErrors] = useState(null);
    const doRequest = ( ) => {
        try{
            const response = await axios[method](url, body);
            return response.data;
        } catch (e) {

        }
    }

    return {doRequest, errors};
}