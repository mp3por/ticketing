import axios from "axios";

const Index = ({currentUser}) => {
    console.log(currentUser);
    return <h1>Landing page</h1>
}

Index.getInitialProps = async () => {
    const response = await axios.get('/api/users/currentuser');

    return response.data;
}

export default Index;