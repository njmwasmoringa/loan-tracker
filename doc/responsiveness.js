document.addEventListener("DOMContentLoaded", () => {

    setInterval(() => {
        const width = window.innerWidth;
        if (width < 768) {
            document.querySelector('.debtors-container').style.width = "100%";
            document.querySelector("#page-container").classList.add('flex-column', 'flex-column-reverse');
            document.querySelector('#mini-dash').classList.add('d-flex', 'justify-content-stretch');
            document.querySelector('#mini-dash .card-holder:nth-child(2)').classList.add('me-2', 'ms-2', 'flex-fill');
        }
        else {
            document.querySelector('.debtors-container').style.width = "70%";
            document.querySelector("#page-container").classList.remove('flex-column', 'flex-column-reverse');
            document.querySelector('#mini-dash').classList.remove('d-flex', 'justify-content-stretch');
            document.querySelector('#mini-dash .card-holder:nth-child(2)').classList.remove('me-2', 'ms-2', 'flex-fill');
        }
    }, 500);

})