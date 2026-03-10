export default async function postLogin(email, password) {
    const response = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
    });

    if(!response.ok) {
        throw new Error("Network response was not ok");
    }

    return response.json();
}