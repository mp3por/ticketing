import { useState } from 'react';
import useRequest from "../../hooks/use-request";
import Router from 'next/router';

const SignUp = () => {
    const [email, setEmail] = useState('o2m222222g@om.com');
    const [password, setPassword] = useState('312389');
    const { doRequest, errors } = useRequest({
        url:'/api/users/signup',
        method: 'post',
        body: {
            email, password
        },
        onSuccess: () => Router.push('/')
    });

    const onSubmit = async event => {
        event.preventDefault();
        await doRequest();
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
            {errors}
            <button className="btn btn-primary">Sign Up</button>

        </form>
    );
};

export default SignUp;