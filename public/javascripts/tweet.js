const tweetInput = document.getElementById('tweetInput')
const feedback = document.querySelector('.feedback')
const tweetButton = document.getElementById('tweetButton')

tweetInput.addEventListener('input', e => {
  let input = e.target.value
  feedback.innerHTML = 140 - input.trim().length
  if (Number(feedback.innerHTML) > 0) {
    feedback.style.color = 'black'
  }
  if (Number(feedback.innerHTML) <= 0) {
    feedback.style.color = 'red'
    feedback.innerHTML = 0
  }

  if (input.trim().length === 0 || input.trim().length > 140) {
    tweetButton.setAttribute('disabled', 'disabled')
    tweetButton.classList.add('disabled')
  }
  if (input.trim().length > 0 && input.trim().length <= 140) {
    tweetButton.removeAttribute('disabled')
    tweetButton.classList.remove('disabled')
  }
})
