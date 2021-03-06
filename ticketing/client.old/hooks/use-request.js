import axios from "axios";
import {useState} from "react";

const useRequest = ({url, method, body, onSuccess}) => {
    const [errors, setErrors] = useState(null);
    const doRequest = async () => {
        try {
            const response = await axios[method](url, body);

            if (onSuccess) {
                onSuccess(response.data)
            }

            return response.data;
        } catch (e) {
            console.log(e);
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