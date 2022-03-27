async function updatePostHandler() {


  const post_id = window.location.toString().split("/")[
    window.location.toString().split("/").length - 1
  ];

  const title = document.querySelector("#title-input").value.trim();
  const postBody = document.querySelector("#body-input").value.trim();

  if (title && postBody) {
    const response = await fetch(`/api/posts/${post_id}`, {
      method: "PUT",
      body: JSON.stringify({
        post_title: title,
        post_body: postBody,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      document.location.replace("/dashboard");
    } else {
      alert(response.statusText);
    }
  }
}

document.querySelector('#update-post-btn').addEventListener('click', updatePostHandler); 