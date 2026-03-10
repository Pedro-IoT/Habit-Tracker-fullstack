export default async function postRegister(name, email, password) {
    const response = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
    });

    if(!response.ok) {
        throw new Error("Network response was not ok");
    }

    return response.json();
}