axios({
    method: 'POST',
    url: 'http://localhost:3000/api/v1/auth/login',
    data: {
        login: 'pavel',
        password: 'qwerty'
    },
    credentials: 'same-origin',
    headers: {
        'access-control-expose-headers': 'Set-Cookie'
    },
    withCredentials: true
})