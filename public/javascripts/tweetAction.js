const actionButton = document.querySelectorAll('.user-action')
const actionOption = document.querySelectorAll('.action-click-option')
const body = document.querySelector('body')
const alert = document.querySelector('.alert-box')

function showOption() {
  const actionOption = document.querySelector(
    `.action-click-option[data-id="${this.dataset.id}"]`
  )
  const deleteButton = document.querySelector(
    `.deleteTweet[data-id="${this.dataset.id}"]`
  )
  const editButton = document.querySelector(
    `.editTweet[data-id="${this.dataset.id}"]`
  )
  if (deleteButton) {
    deleteButton.addEventListener('click', () => {
      body.style.overflow = 'hidden'
      alert.style.display = 'flex'
      alert.innerHTML = `
        <div class="dark-bg">
        </div>
        <div class="delete-confirm">
          <div class="delete-box">
            <form action="/tweets/${
              this.dataset.id
            }?_method=DELETE" method="POST">
              <div class="box-top">確定要刪除貼文嗎？</div>
              <div>
                <button type="submit" style="color:red">刪除</button>
                <button type="button" class="closeBox">返回</button>
              </div>
            </form>
          </div>
        </div>
      `

      const close = document.querySelector('.closeBox')
      close.addEventListener('click', () => {
        body.style.overflow = 'unset'
        alert.style.display = 'none'
      })
    })
  }

  if (editButton) {
    editButton.addEventListener('click', () => {})
  }

  body.addEventListener('click', e => {
    if (e.target.closest('.user-action') !== this) {
      actionOption.style.display = 'none'
    } else {
      actionOption.style.display = 'block'
    }
  })
}

actionButton.forEach(b => b.addEventListener('click', showOption))
