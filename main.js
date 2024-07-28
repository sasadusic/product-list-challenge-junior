const addBtns = document.querySelectorAll('.add-btn')

bucket = []

addBtns.forEach(addBtn => {
    addBtn.onclick = () => {
        alert(addBtn.dataset.cake)
    }
})