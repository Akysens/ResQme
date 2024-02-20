import React, { useState } from "react";
import LoginScreen from "../../auth/LoginScreen";
import Profile_Screen from "./Profile";

export default function Parent_Function() {
    const [sharedData, setSharedData] = useState(null);

    return (
        <>
            <LoginScreen setSharedData={setSharedData} />
            <Profile_Screen sharedData={sharedData} />
        </>
    );
}
