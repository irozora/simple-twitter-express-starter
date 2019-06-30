const endpoint = '/users/api/v1'
const users = []

fetch(endpoint)
  .then(blob => blob.json())
  .then(data => {
    users.push(...data)
  })

const inputField = document.querySelectorAll('input')
const signupButton = document.querySelector('.signin')

function handleError() {
  if (this.value.trim().length === 0) {
    this.nextElementSibling.innerHTML = '請填寫這個欄位。'
    this.classList.add('alert')
    signupButton.setAttribute('disabled', 'disabled')
    signupButton.classList.add('disabled')
  } else if (this.id === 'inputName') {
    users.some(u => u.name === this.value)
      ? addAlert(this.id)
      : removeAlert(this.id)
  } else if (this.id === 'inputEmail') {
    users.some(u => u.email === this.value)
      ? addAlert(this.id)
      : removeAlert(this.id)
  } else if (this.id === 'inputPasswordCheck') {
    this.value !== inputPassword.value
      ? addAlert(this.id)
      : removeAlert(this.id)
  } else {
    this.classList.remove('alert')
    signupButton.removeAttribute('disabled')
    signupButton.classList.remove('disabled')
    this.nextElementSibling.innerHTML = ''
  }
}

function addAlert(id) {
  const field = document.getElementById(`${id}`)
  field.classList.add('alert')
  signupButton.setAttribute('disabled', 'disabled')
  signupButton.classList.add('disabled')

  if (id === 'inputName') {
    inputName.nextElementSibling.innerHTML = '這個名稱已經被註冊過了。'
  } else if (id === 'inputEmail') {
    inputEmail.nextElementSibling.innerHTML = '這個信箱已經被註冊過了。'
  } else {
    inputPasswordCheck.nextElementSibling.innerHTML = '兩次密碼輸入不相符。'
  }
}

function removeAlert(id) {
  const field = document.getElementById(`${id}`)
  field.classList.remove('alert')
  signupButton.removeAttribute('disabled')
  signupButton.classList.remove('disabled')
  field.nextElementSibling.innerHTML = ''
}

inputField.forEach(input => input.addEventListener('input', handleError))
