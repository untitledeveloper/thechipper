function getid(x) {
    return document.getElementById(x)
}

function addPost() {
    var postTitle = getid("postTitle")
    var postBody = getid("postBody")

    console.log(postTitle.value, postBody.value)
}