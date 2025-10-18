import { useEffect } from "react";

const GetToken = () => {
    useEffect(() => {
        // URL dan tokenni olish
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            console.log("Token:", token);
            localStorage.setItem("access_token", token);

            window.location.href = "/tasks";
        }
    }, []);

    return <div>Loading...</div>;
};

export default GetToken;
