function listRenderer(listName) {
    $.get('/api/list/' + listName, (booklist) => {

        for (let key in booklist) {
            let isbn = booklist[key]['isbn']
            console.log(booklist[key])

            listAdder(listName, isbn)
        }
    })
}

function listAdder(listName, isbn) {
    $.get('/api/books/' + isbn, (book) => {
        $('.list-' + listName).append(`<li class="list-item">
    <img src="${book['img']}">
    <p>${book['title']}.</p>
    <p>Price: ${book['pages']}</p>
    <button id="${book['isbn']}-del" class="book-delete" >Delete</button>`)
        console.log($('#' + isbn + "-del"))
        $('#' + isbn + '-del').click(function () {
            console.log("clicked")
            $.ajax({
                url: `/api/list/${listName}/${isbn}`,
                type: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                },
                success: function (data) {
                    $('#' + isbn + "-del").closest('li').remove();
                },
                error: function () {
                    console.log('error')
                }
            })
        })
    })
}

function changeCss() {

}
window.onload = function () {

    $('.register-button').click(() => {
        $('#register-container')
            .append(` <form class="register-form">
                    <input id="newUser"type="text" placeholder="Your Name">
                    <input class="register-submit" type="submit"  value="Register">
                    </form>
                `)
        $('.register-form').submit(function (e) {
            e.preventDefault();
            let currentUser = $('#newUser').val()
            console.log(currentUser)
            $.ajax({
                url: "/register",
                type: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                data: JSON.stringify({
                    "userName": currentUser
                }),
                success: function (data) {
                    alert("User account successfully created.")
                    return $('#register-container').hide();

                },
                error: function (data) {
                    $('#register-container').hide();
                    if (data.responseText === 'Unauthorized')
                        return alert("Please Login or register to add Books into list.")
                    else if (data.responseText === "exists")
                        return alert(`User name already taken!`)
                    else if (data.responseText === "invalid")
                        return alert(`Please Enter a valid name (atleast 3 characters)`)
                }

            });

        })

    })
    $('.login-button').click(() => {
        $('#form-container')
            .append(` <form class="login-form">
                    <input id="userName"type="text" placeholder="Username">
                    <input class="login-submit" type="submit"  value="Login">
                    </form>
                `)
        $('.login-form').submit(function (e) {
            e.preventDefault();
            let currentUser = $('#userName').val()
            $.ajaxSetup({
                beforeSend: function (xhr) {
                    xhr.setRequestHeader('userName', currentUser)
                }
            })
            $('#myInput').css({
                "visibility": "visible"
            })
            $('.user-list').css({
                "visibility": "visible"
            })
            $('#form-container').hide();
            $('.welcome-text').append(` "${currentUser}"`)
            $('.user-access').css({
                'display': "none"
            })
            $('.logout').css({
                "display": "flex",
                "justify-content": "center",
                "align-items": "center",
                "width": "auto",
                "height": "64px",
            })
            $('.logout input').css({
                "background-color": "green",
                "border": "none",
                "width": "9em",
                "height": "2em",
                "border-radius": "4px",
                "color": "white"
            })
            $(".logout").click(() => {
                location.reload();
            })
            $.get('/api/books', (books) => {
                for (let key in books) {
                    $('.booklist')
                        .append(`<li>
                    <img src="${books[key]['img']}">
                    <p>${books[key]['title']}.</P>
                    <select id="${books[key]['isbn']}">
                        <option>Add-to-List</option>
                        <option value="${books[key]['isbn']}" >want-to-read</option>
                        <option value="${books[key]['isbn']}" >reading</option>
                        <option value="${books[key]['isbn']}" >read</option>
                    </select>
                        </li>`)
                }

                listRenderer("want-to-read");
                listRenderer("read");
                listRenderer("reading");

                $('select').change(function () {
                    let isbn = $(this).children("option:selected").val();
                    let listName = $(this).children("option:selected").text();
                    $.ajax({
                        url: "/api/list/" + listName,
                        type: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        data: JSON.stringify({
                            "isbn": isbn
                        }),
                        success: function () {
                            listAdder(listName, isbn)
                        },
                        error: function (data) {
                            if (data.responseText === 'Unauthorized')
                                return alert("Please Login or register to add Books into list.")
                            alert(`Book already exists in list.`)
                        }

                    });
                })
            })

            $("#myInput").keyup(function (e) {
                let input, filter, ul, li, a, i, txtValue;
                input = document.getElementById("myInput");
                filter = input.value.toUpperCase();
                ul = document.getElementById("booklist");
                console.log(typeof ul)
                li = ul.getElementsByTagName("p");
                console.log(ul)
                console.log(li)
                for (i = 0; i < li.length; i++) {
                    a = li[i];
                    txtValue = a.innerText;
                    if (txtValue.toUpperCase().indexOf(filter) > -1) {
                        li[i].parentElement.style.display = "";
                       console.log( "reached")
                    } else {
                        li[i].parentElement.style.display = "none";
                    }
                }

            })

        })

    })


}