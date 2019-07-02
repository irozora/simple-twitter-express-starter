const open = document.querySelectorAll('[data-reply="open"]')

open.forEach(a => {

  a.addEventListener('click', () => {
    const arrow = a.firstElementChild

    if (arrow.classList.contains('fa-caret-right')) {
      arrow.classList.replace('fa-caret-right', 'fa-caret-down')
    } else {
      arrow.classList.replace('fa-caret-down', 'fa-caret-right')
    }

    const replyData = a.parentElement.parentElement.parentElement.nextElementSibling
    replyData.classList.toggle('open-it')
  })

})

