const a = 1
if (a) {
    console.log(a)
}
else {
    console.log(2)
}

const passwordType = {
    value: '',
}

passwordType.value === '' ? (passwordType.value = 'password') : (passwordType.value = '')

passwordType.value && (passwordType.value = 'password')
