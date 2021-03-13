import axios from "axios";

const Index = ({currentUser}) => {
    console.log(currentUser);
    return <h1>Landing page</h1>
}

Index.getInitialProps = async () => {
    // const response = await axios.get('/api/users/currentuser');
    if (typeof window === 'undefined') {
        
    } else {
        
    }
    
    return {};
       
    // return response.data;
}

export default Index;
