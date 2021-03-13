import axios from "axios";
import buildClient from "../api/build-client";

const Index = ({currentUser}) => {
    console.log(currentUser);
    return currentUser ?  <h1>You are signed in </h1> : <h1>You are NOT signed in</h1>
}

Index.getInitialProps = async context => {
    let client =  buildClient(context);
    const { data } = await client.get('/api/users/currentuser');
    return data;
}

export default Index;
