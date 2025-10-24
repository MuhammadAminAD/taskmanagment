import { useEffect, useCallback } from "react";
import { useLoginWithCodeMutation } from "../../services/Login.services";

const GetToken = () => {
    const [getTokens] = useLoginWithCodeMutation();

    const handleGetTokens = useCallback(async (code: string | null) => {
        if (code) {
            try {
                const response = await getTokens(code).unwrap();
                const { access_token, refresh_token } = response.data;

                localStorage.setItem("access_token", access_token);
                localStorage.setItem("refresh_token", refresh_token);

                window.location.href = "/todo";
                console.log(code)
            } catch (error) {
                console.error("Token olishda xatolik:", error);
            }
        }
    }, [getTokens]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const code = params.get("code");
        handleGetTokens(code);
    }, [handleGetTokens]);

    return <div>Loading...</div>;
};

export default GetToken;
