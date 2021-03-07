import 'bootstrap/dist/css/bootstrap.css';

// wrapper around the component that is being rendered on the screen
const Wrapper = ({Component, pageProps}) => {
    return <Component {...pageProps} />
};

export default Wrapper;