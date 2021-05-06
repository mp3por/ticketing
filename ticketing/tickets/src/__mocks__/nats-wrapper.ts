/**
 * Fake implementation to natsWrapper to be used during tests
 * 
 * We are mocking the publish call which is used by our classes
 * */
export const natsWrapper = {
    client: {
        publish: (subject: string, data: string, callback: () => void) => {
            callback();
        }
    }
};
