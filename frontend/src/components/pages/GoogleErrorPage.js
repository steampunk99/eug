
import { useEffect } from "react";


const GoogleErrorPage = () => {
    useEffect(() => {
        console.log("Google auth error page");
    }, []);

    return (
        <div>
            <h1>Google auth error</h1>
        </div>
    );
};

export default GoogleErrorPage;

