import { useState } from 'react';
import axios from "axios";

const SignUp = () => {
    const [email, setEmail] = useState('o2m222222g@om.com');
    const [password, setPassword] = useState('312389');
    const [errors, setErrors] = useState([]);

    const onSubmit = async event => {
        event.preventDefault();

        try {
            const response = await axios.post('/api/users/signup', {
                email,password
            })

            console.log(response.data);
        } catch (e) {
            setErrors(e.response.data.errors);
        }
    }

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign Up</h1>
            <div className="form-group">
                <label>Email Address</label>
                <input
                    className="form-control"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label>Password</label>
                <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>
            {errors.length > 0 && (
                <div className="alert alert-danger">
                    <h4>Ooops...</h4>
                    <ul className="my-0">
                        {errors.map(error => (<li key={error.message}>{error.message}</li>))}
                    </ul>
                </div>
            )}
            <button className="btn btn-primary">Sign Up</button>

        </form>
    );
};

export default SignUp;