axios({
    method: 'POST',
    url: 'https://rk-tech.shop/api/v1/auth/login',
    data: {
        login: 'pavel',
        password: 'qwerty'
    }
})