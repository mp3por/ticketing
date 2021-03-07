import axios from "axios";
import {useState} from "react";

const useRequest = ({url, method, body}) => {
    const [errors, setErrors] = useState(null);
    const doRequest = async () => {
        try {
            const response = await axios[method](url, body);
            return response.data;
        } catch (e) {
            setErrors(
                <div className="alert alert-danger">
                    <h4>Ooops...</h4>
                    <ul className="my-0">
                        {e.response.data.errors.map(error => (<li key={error.message}>{error.message}</li>))}
                    </ul>
                </div>
            )
        }
    }

    return {doRequest, errors};
}

export default useRequest;