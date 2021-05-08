import 'bootstrap/dist/css/bootstrap.css';
import buildClient from "../api/build-client";
import Header from "../components/header";

// wrapper around the component that is being rendered on the screen
const AppComponent = ({Component, pageProps, currentUser}) => {
    return (
        <div>
            <Header currentUser={currentUser}/>
            <Component currentUser={currentUser} {...pageProps} />
        </div>
    );
};

// there is a difference between the context object for the object ( this )
// and a component ( sign-in.js )
AppComponent.getInitialProps = async appContext => {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get('api/users/currentuser');
    // In NextJS environment if I put getInitialProps on the AppComponent
    // the getInitialProps of the inner component is not being called
    // so i have to manually call it and pass the ctx object
    let pageProps = {};
    if (appContext.Component.getInitialProps) { // verify the component has getInitialProps
        pageProps = await appContext.Component.getInitialProps(appContext.ctx, client, currentUser);
    }

    return {
        pageProps,
        ...data
    };
};

export default AppComponent;
